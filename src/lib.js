const utils = require('corifeus-utils');
const progress = require('progress');

const dependenciesFix = require('../dependencies-fix.json');

const dependenciesFixAddon = (options) => {
    const { repo }= options
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
    return `ncu ${options.all ? '-a -u' : ''} --loglevel verbose --packageFile package.json ${dependenciesFixAddon(options)}`
}

const executeCommandByPath = async (options) => {

    // commander options: options.options

    const {
        findData,   errors, bar
    } = options;

    let { command } = options

    if (command.includes('__NCU__')) {
        const ncu = getNcu({
            all: true,
            disableNcu: options.options.disableNcu,
            repo: options.item.pkg.corifeus === undefined ? options.item.pkg.name : options.item.pkg.corifeus.reponame
        })
        command = command.replace('__NCU__', ncu)
    }

    const name = options.item ? options.item.name : command;

    const token = `${name} ${command}`;

    if (options.options.dry) {
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
            if (!bar) {
                console.log(data);
            }
        });
        execPromise.exec.stderr.on('data', (data) => {
            if (bar) {
                bar.interrupt(data)
            } else {
                console.error(data);
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
        width: Math.min(list.length, 20) ,
        complete: '=',
        incomplete: '-',
        clear: true
    })
    bar.tick(0, {
        token: 'loading'
    })
    return bar;
}

module.exports.newProgress = newProgress;

module.exports.executeCommandByPath = executeCommandByPath;