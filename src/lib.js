const utils = require('corifeus-utils');
const progress = require('progress');

const dependenciesFix = require('../dependencies-fix.json');

const dependenciesFixAddon = (options) => {
    const {repo} = options
    let exclude = dependenciesFix.keep || [];


    if (dependenciesFix.hasOwnProperty('keep-by-repo') && dependenciesFix['keep-by-repo'].hasOwnProperty(repo)) {
        exclude = exclude.concat(dependenciesFix['keep-by-repo'][repo])
    }
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
//    const command = `ncu ${options.all ? '-u -a' : ''} --loglevel verbose --packageFile package.json ${dependenciesFixAddon(options)}`
//    return
    const command = `ncu ${options.all ? '-u' : ''} --loglevel verbose --packageFile package.json ${dependenciesFixAddon(options)}`
    return command
}

const executeCommandByPath = async (options) => {

    // commander options: options.options
    const {
        findData, errors, bar
    } = options;

    let {command} = options

    const noInstall = options && options.item && options.item.pkg && options.item.pkg.corifeus && options.item.pkg.corifeus.install === false

    if (command.includes('__NCU__')) {
        const ncu = getNcu({
            all: options.options.u || options.options.all,
            disableNcu: options.options.disableNcu,
            repo: options.item.pkg.corifeus === undefined ? options.item.pkg.name : options.item.pkg.corifeus.reponame
        })
        command = command.replace('__NCU__', ncu)
        //  console.warn('command', command)
    }
    if (options && options.item && options.item.pkg && options.item.pkg.corifeus && options.item.pkg.corifeus['publish-location']) {
        command = command.replace('__PUBLISH_LOCATION_START__', `pushd ${options.item.pkg.corifeus['publish-location']}`)
        command = command.replace('__PUBLISH_LOCATION_END__', 'popd')
    } else {
        command = command.replace('__PUBLISH_LOCATION_START__', '')
        command = command.replace('__PUBLISH_LOCATION_END__', '')

    }

    const name = options.item ? options.item.name : command;

    const token = `${name} ${command}`;

    if (options.options.dry || noInstall) {
        console.info('------------------------------------');
        console.info(findData.path);
        console.info(name);
        // console.info(options.item.pkg.corifeus.reponame);
        console.info(command)
        console.info();

        if (bar) {
            utils.repeat(2, () => {
                bar.tick({
                    token: token
                })
            })
        }
        return;
    }

    try {
        if (bar) {
            bar.tick({
                token: token
            })
        }

        const execPromise = utils.childProcess.exec(`
bash -c '
pushd ${findData.dir}
set -e
export FOUND_DIR=${findData.dir}
export FOUND=${findData.path}
${command}
popd
'
`, bar === undefined ? true : false)
        execPromise.exec.stdout.on('data', (data) => {
            if (bar) {
                bar.interrupt(data)
            }
        });
        execPromise.exec.stderr.on('data', (data) => {
            if (bar) {
                bar.interrupt(data)
            }
        });

        await execPromise;

    } catch (e) {
        if (errors !== undefined) {
            errors.push(e);
        }
        throw e;
    } finally {
        /*
        if (bar) {
            bar.tick({
                token: name
            })
        }
        */
    }
}

const newProgress = (status, list) => {
    const bar = new progress(`${status}[:bar] :token`, {
        total: list.length,
        width: Math.min(list.length, 20),
        complete: '=',
        incomplete: '-',
        clear: true
    })
    bar.tick(0, {
        token: 'loading'
    })
    return bar;
}

const hackNpmInstallPreHook = () => {
    return ``
}

module.exports.newProgress = newProgress;

module.exports.executeCommandByPath = executeCommandByPath;

module.exports.hackNpmInstallPreHook = hackNpmInstallPreHook;
