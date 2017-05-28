const commander = require('commander');
const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');
const lib = require('../lib');

commander
    .command('docker <command>')
    .description(`This is for global update`)
    .action(async function (command, options) {
        switch (command) {
            case 'clear':
                await utils.childProcess.exec(`docker rm $(docker ps -a -q)
docker rmi $(docker images -q)|| true`, true)
                break;

            case 'clean':
                await utils.childProcess.exec(`docker rm $(docker ps -q -f status=exited)
docker rmi $(docker images -q -f dangling=true) || true`, true)
                break;

            default:
                console.error(`Unknown error: ${command}`)
                process.exit(1)
                break;
        }

    })
;

