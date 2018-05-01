const commander = require('commander');
const utils = require('corifeus-utils');
const find = utils.fs.find;
const mz = require('mz');

const npmLib = require('../npm');
const lib = require('../lib');

const _ = require('lodash');

const dependenciesFix = require('../../dependencies-fix.json');

const allCommands = [
    'link',
    'publish',
    'pkg',
    'build',
];

const publishableCommand = [
    'link',
    'publish'
];

const read = async (options, bar) => {

    if (options.read) {
        if (bar) {
            bar.interrupt(`
Wait for enter...

`)
        }
        await utils.input.key();
    }

}

const loadCommander = (command) => {

    commander
        .command(`${command} [plusCommands...]`)
        .option('-d, --dry', 'Do not actually remove packages, just show what it does')
        .option('-z, --disable-ncu', 'Disable ncu')
        .option('-a, --all', 'All')
        .option('-s, --serial', 'Serial ')
        .option('-r, --read', 'read a key')
        .option('-n, --non-interactive', 'Non interfactive')
        .option('-p, --disable-progress', 'Disable progress')
        .option('--registry', 'Registry')
        .option('-m, --packageManager <name>', 'Package manager')
        .option('-o, --only <only>', 'Only packages', (list) => {
            return list.split(',');
        })
        .option('-x, --exclude <only>', 'Exclude packages', (list) => {
            return list.split(',');
        })
        .action(async function (plusCommands, options) {

            await executeCommand(command, plusCommands, options);
        })
    ;
}

allCommands.forEach((cmd) => loadCommander(cmd))

const getPkgAndDeps = async(file) => {
    const data = (await mz.fs.readFile(file)).toString();
    try {
        const pkg = JSON.parse(data);
        let deps = Object.keys(Object.assign(pkg.dependencies || {}, pkg.devDependencies || {}));
        return [pkg, deps];
    } catch(e) {
        console.error();
        console.error(file);
        console.error();
        throw e;
    }
}

const dependenciesFixAddon = () => {
    const exclude = dependenciesFix.keep || [];
    let excludeAddon = '';
    if (exclude.length > 0) {
        excludeAddon = `-x ${exclude.join(',')}`
    }
    return excludeAddon;
}

const getNcu = (options) => {
    if (options.disableNcu === true) {
        return '';
    }
    return `ncu ${options.all ? '-a -u' : ''} --loglevel verbose --packageFile package.json ${dependenciesFixAddon()}`
}

const executeCommand = async (command, plusCommands, options) => {
    let errors = [];
    plusCommands = plusCommands.join(' ').trim();

    if (plusCommands === 'ncu') {
        plusCommands += `  --loglevel verbose --packageFile package.json ${dependenciesFixAddon()}`
    }


    if (options.nonInteractive) {
        plusCommands += ' --non-interactive'
    }

    if (options.registry) {
        plusCommands += ' --registry https://registry.npmjs.com/'
    }

    if (options.packageManager) {
        plusCommands += ' --packageManager ' + options.packageManager
    }

    if (options.all && plusCommands !== 'start') {
        plusCommands += ' -a'
    }


    let paths = await find({
        find: 'package.json',
    });

    let count = 0;

    const key = {};
    let list = [];
    await paths.forEachAsync(async (findData) => {
        const [pkg, deps] = await getPkgAndDeps(findData.path);
        if (dependenciesFix['disable-update'].includes(pkg.name)) {
            return;
        }
        key[pkg.name] = true;
        const result = {
            name: pkg.name,
            pkg: pkg,
            deps: deps,
            findData: findData
        }
        list.push(result)
    });
    list = list.map((item) => {
        item.wants = [];
        item.deps.forEach((want) => {
            if (key.hasOwnProperty(want)) {
                item.wants.push(want);
            }
        })
        return item;
    })
    list = utils.require.resovleDependencies({
        modules: list,
        debug: false,
        recursive: [
            'corifeus-utils'
        ]
    });

    let allList = list.slice();

    const reRunAllList = () => {
        const allListFilter = list.map(item => {
            return item.pkg.name;
        })
        allList = allList.filter(item => {
            for(let masterItemName of allListFilter) {
                if (item.pkg.name === masterItemName) {
                    return true;
                }
                if (item.deps.includes(masterItemName)) {
                    return true;
                }
            }
            return false;

        })

    }

    if (options.only !== undefined) {
        list = list.filter(item => {
            return options.only.includes(item.pkg.name);
        })
        reRunAllList();
    }

    if (options.exclude !== undefined) {
        list = list.filter(item => {
            return !options.exclude.includes(item.pkg.name);
        })
        reRunAllList();
    }


    if (publishableCommand.includes(command)) {
        list = list.filter(item => {
            return item.pkg.hasOwnProperty('corifeus') && item.pkg.corifeus.publish === true;
        })
    }

    switch(command) {
        case 'publish':
            options.serial = true;
            break;

        case 'link':
            plusCommands = `yarn unlink || true
yarn link            
`;
            break;
    }

    if (plusCommands === '') {
        plusCommands = 'list';
    }

    if (plusCommands === 'start') {
        plusCommands = `sudo echo "SUDO IS DONE"
rm -rf node_modules          
${getNcu({all: true, disableNcu: options.disableNcu})}
yarn install --non-interactive --ignore-engines || npm install --non-interactive
${npmLib.command.publish({ all: options.all } )}`;
    }

    const actual = [];
    let doActualExecute = false;
    const displayCommand = `${command} ${plusCommands}`;
    let bar;
    if (options.disableProgress !== true) {
        bar = lib.newProgress(command, list);
    }
    let remained = [];
    await list.forEachAsync(async (item) => {
        const {findData , pkg, deps} = item;
        let hasBuilder;

        if (pkg.name !== undefined && pkg.name.startsWith('corifeus-builder')) {
            hasBuilder = true;
        } else if (command === 'build' || command === 'publish') {
            hasBuilder = deps.find((dep) => {
                return dep.startsWith('corifeus-builder');
            })
        } else {
            hasBuilder = true;
        }
        if (hasBuilder !== undefined ) {
            actual.push(item);
            switch (plusCommands) {
                case 'count':
                case 'deps':
                case 'list':
                    console.info(pkg.name)
                    if (options.disableProgress !== true) {
                        utils.repeat(2, () => {
                            bar.tick({
                                token: pkg.name
                            })
                        })
                    }
                    break;

                default:
                    if (!options.dry) {
                        doActualExecute = true;
                    }

                    await lib.executeCommandByPath({
                        findData: findData,
                        command: plusCommands,
                        errors:  errors,
                        item: item,
                        options: options,
                        bar : bar
                    })
                    await read(options, bar)

            }
        } else {
            if (options.disableProgress !== true) {
                utils.repeat(2, () => {
                    bar.tick({
                        token: pkg.name
                    })
                })
            }
            remained.push(item);
        }
    }, options.serial)

    remained.forEach(allItem => {
        let found = false;
        actual.forEach((actualItem) => {
            if (actualItem.name === allItem.name) {
                found = true;
            }
        })
        if (!found) {
            remained.push(allItem);
        }
    }, options.serial)

    if ((doActualExecute || options.dry) && publishableCommand.includes(command)) {
        const afterBar = lib.newProgress(`post ${command}`, allList);

        await allList.forEachAsync(async (item) => {
            const {findData , pkg, deps} = item;

            let execCommand;
            switch(command) {
                case 'publish':
                    if (options.disableNcu !== true) {
                        execCommand = `
${getNcu({all: true, disableNcu: options.disableNcu})}
rm -rf ./node_modules
yarn install --non-interactive --ignore-engines || npm install --non-interactive
`;

                    }
                    break;

                case 'link':
                    if (item.wants.length > 0) {
                        execCommand = `
yarn link ${item.wants.join(' \nyarn link ')} 
`
                    }
                    break;
            }
            if (execCommand !== undefined) {

                await lib.executeCommandByPath({
                    findData: findData,
                    command: execCommand,
                    errors:  errors,
                    item: item,
                    options: options,
                    bar : afterBar
                })
                await read(options, afterBar)
            }
        }, options.serial )
    }

    console.info(`All: ${allList.map((item) => item.name)}`)
    console.info();
    console.info(`Actual: ${actual.map((item) => item.name)}`)
    console.info();
    console.info(`Remained: ${remained.map((item) => item.name)}`)
    console.info();
    console.info(`Actual count: ${actual.length}`)
    console.info();
    console.info(`Serial: ${options.serial ? 'true' : 'false'}`)
    if (errors.length > 0) {
        console.error(`Errors: ${errors.length}`);
        console.error(errors)
    }

    console.info();
    console.info(displayCommand)

    console.info();
    console.info('Dependencies fix', JSON.stringify(dependenciesFix, null, 4))

}