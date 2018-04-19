const commander = require('commander');
const utils = require('corifeus-utils');

commander
    .command('docker <command>')
    .description(`Commands:
    free: deletes no-name images and dead containers
    clean: delete images the have exited
    clear: delete delete all images
`)
    .action(async function (command, options) {
        switch (command) {
            case 'free':
                console.log('deletes no-name images and dead containers')
                await utils.childProcess.exec(`docker images --no-trunc | grep '<none>' | awk '{ print $3 }' | xargs -r docker rmi || true
docker ps --filter status=dead --filter status=exited -aq | xargs docker rm -v || true`, true)

            case 'clean':
                console.log('delete images the have exited')
                await utils.childProcess.exec(`docker rm $(docker ps -q -f status=exited)
docker rmi $(docker images -q -f dangling=true) || true`, true)
                break;

            case 'clear':
                console.log('delete all images')
                await utils.childProcess.exec(`docker rm $(docker ps -a -q)
docker rmi $(docker images -q)|| true`, true)
                break;

            default:
                commander.outputHelp();

                console.error(`Unknown command: ${command}`)
                process.exit(1)
                break;
        }

    })
;

