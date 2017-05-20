const commander = require('commander');
const utils = require('corifeus-utils');
const find = require('../find');
const path = require('path');
const git = require('../git');
const mz = require('mz');

const lib = require('../lib');

//p3x for .git 'cd ..;p3x git truncate'
const commands = [
    'truncate',
    'renew',
    'each',
    'push',
]
commander
    .command('git [command] [plusCommands...]')
    .description(`
    The versioning is Major.Minor.Commit-Build
    If you omit the package name, it will use all.

    commands:
        ${commands.join(', ')}

`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .option('-a, --all', 'All')
    .action(async function (command, plusCommands, options) {
        let paths;

        if (command === undefined) {
            command = 'list';
        }

        plusCommands = plusCommands.join(' ').trim();

        switch(command) {

            case 'truncate':
            case 'renew':
                const truncate = require('../git').truncate;
                await truncate(options);
                break;

            case 'each':
            case 'count':
            case 'list':
            case 'push':
                paths = await find('.git');

                paths = paths.map(pathActual => {
                    if (pathActual.dir === pathActual.path) {
                        pathActual.dir = path.dirname(pathActual.dir);
                    }
                    return pathActual;
                })

                if (command === 'count') {
                    console.info(paths.length);
                    return
                }
                await paths.forEachAsync(async (findData) => {
                    if (command === 'list') {
                        console.log(path.basename(findData.dir));
                    } else {
                        await utils.repeat(2, async() => {
                            await lib.executeCommandByPath({
                                findData: findData,
                                command: `git add .
git commit -am 'p3x-robot-push' || true
git push || true
${plusCommands === '' ? 'true' : plusCommands}`,
                            })
                        }, true)
                    }
                }, true)
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

