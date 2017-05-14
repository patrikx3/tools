const commander = require('commander');
const utils = require('corifeus-utils');
const find = require('../find');
const path = require('path');

//p3x for .git 'cd ..;p3x git truncate'
const commands = [
    'truncate',
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
    .action(async function (command, plusCommands, options) {


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

            case 'eachpkg':
            case 'each':
                let paths = await find({
                    find: '.git',
                    all: true,
                    excludes: [
                        'node_modules',
                    ]
                });
                paths = paths.map((dir) => {
                    return path.dirname(dir)
                })
                const promises = [];

                paths.forEach((path) => {

                    promises.push(utils.childProcess.exec(`
bash -c '
pushd ${path}
set -e
${plusCommands.join(' ')}
popd
'
`, true))
                })
                Promise.all(promises);
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

