const commander = require('commander');
const utils = require('corifeus-utils');
const find = require('../find');
const path = require('path');
const git = require('../git');
const mz = require('mz');


//p3x for .git 'cd ..;p3x git truncate'
const commands = [
    'truncate',
    'renew',
    'each',
    'push',
]
commander
    .command('git <command> [plusCommands...]')
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

        plusCommands = plusCommands.join(' ');

        const executeCommandByPath = async (findData, command) => {
            await utils.childProcess.exec(`
bash -c '
pushd ${findData.dir}            
set -e
export FOUND_DIR=${findData.dir}                
export FOUND=${findData.path}                
${command}
popd
'
`, true)
        }

        switch(command) {

            case 'truncate':
            case 'renew':
                const truncate = require('../git').truncate;
                await truncate(options);
                break;

            case 'push':
                await utils.childProcess.exec(`
git add .
git commit -am 'p3x-robot-push'
git push
`, true)
                break;

            case 'pkg':
            case 'build':
                paths = await find({
                    find: 'package.json',
                });

                let count = 0;
                await paths.forEachAsync(async (findData) => {
                    const pkg = JSON.parse((await mz.fs.readFile(findData.path)).toString());
                    let deps = Object.keys(Object.assign(pkg.dependencies || {}, pkg.devDependencies || {}));
                    let hasBuilder;

                    if (pkg.name !== undefined && pkg.name.startsWith('corifeus-builder')) {
                        hasBuilder = true;
                    } else if (command === 'build') {
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
                        if (plusCommands.trim() !== 'count') {
                            await executeCommandByPath(findData, plusCommands)
                        }
                    }
                })
                console.info(`Count: ${count}`)
                break;

            case 'each':
            case 'count':
                paths = await find({
                    find: '.git',
                });
                if (command === 'count') {
                    console.info(paths.length);
                    return
                }
                await paths.forEachAsync(async (findData) => {
                 await executeCommandByPath(findData, plusCommands)
                })
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

