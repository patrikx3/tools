const utils = require('corifeus-utils');
const progress = require('progress');


const executeCommandByPath = async (options) => {

    const {
        findData, command, errors, bar
    } = options;

    const name = options.item ? options.item.name : command;

    if (options.options.dry) {
        console.info('------------------------------------');
        console.info(findData.path);
        console.info(name);
        console.info(command)
        console.info();

        if (bar) {
            utils.repeat(2, () => {
                bar.tick({
                    token: name
                })
            })
        }
        return;
    }

    try {
        if (bar) {
            bar.tick({
                token: name
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
        if (bar) {
            bar.tick({
                token: name
            })
        }
    }
}

const newProgress = (status, list) => {
    const bar = new progress(`${status}[:bar] :token`, {
        total: list.length  * 2,
        width: Math.max(list.length * 2, 20) ,
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