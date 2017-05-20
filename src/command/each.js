const commander = require('commander');
const utils = require('corifeus-utils');
const find = require('../find');
const path = require('path');
const git = require('../git');
const mz = require('mz');

const npmLib = require('../npm');
const lib = require('../lib');

const loadCommander = (command) => {
    commander
        .command(`${command} [plusCommands...]`)
        .option('-d, --dry', 'Do not actually remove packages, just show what it does')
        .option('-a, --all', 'All')
        .option('-s, --serial', 'Serial ')
        .action(async function (plusCommands, options) {
            await executeCommand(command, plusCommands, options);
        })
    ;
}
loadCommander('pkg');
loadCommander('build');
loadCommander('publish');

const getPkgAndDeps = async(file) => {
    const pkg = JSON.parse((await mz.fs.readFile(file)).toString());
    let deps = Object.keys(Object.assign(pkg.dependencies || {}, pkg.devDependencies || {}));
    return [pkg, deps];
}

const executeCommand = async (command, plusCommands, options) => {
    let errors = [];
    plusCommands = plusCommands.join(' ').trim();

    let paths = await find({
        find: 'package.json',
    });

    let count = 0;

    const key = {};
    let list = [];
    await paths.forEachAsync(async (findData) => {
        const [pkg, deps] = await getPkgAndDeps(findData.path);
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

    if (command === 'publish') {
        list = list.filter(item => {
            return item.pkg.hasOwnProperty('corifeus') && item.pkg.corifeus.publish === true;
        })
        options.serial = true;
    }

    if (plusCommands === '') {
        plusCommands = 'list';
    }

    if (plusCommands === 'start') {
        plusCommands = `ncu -a --loglevel verbose --packageFile package.json
yarn install        
${npmLib.command.publish({ all: options.all } )}`;
    }

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
        if (plusCommands === 'ncu') {
            plusCommands = `ncu ${options.all ? '-a' : ''} --loglevel verbose --packageFile package.json`;
        }
        if (hasBuilder !== undefined ) {
            count++
            switch (plusCommands) {
                case 'count':
                    break;
                case 'deps':
                    break;
                case 'list':
                    console.info(pkg.name)
                    break;

                default:
                    if (options.dry) {
                        console.info('------------------------------------');
                        console.info(findData.path);
                        console.info(pkg.name);
                        console.info(plusCommands)
                    } else {
                        await lib.executeCommandByPath({
                            findData: findData,
                            command: plusCommands,
                            errors:  errors,
                        })
                    }
            }
        }
    }, options.serial)

    console.info(`Count: ${count}`)
    if (errors.length > 0) {
        console.error(`Errors: ${errors.length}`);
        console.error(errors)
    }
}