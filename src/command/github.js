const commander = require('commander');
const utils = require('corifeus-utils');
const find = require('../find');
const path = require('path');
const github = require('../github');

//p3x for .git 'cd ..;p3x git truncate'
const commands = [
    'mirror',
]
commander
    .command('github <command>')
    .description(`
    commands:
        ${commands.join(', ')}

`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .option('-u, --user', 'The GitHub repo, default is patrikx3')
    .option('-g, --git <git>', 'The GIT repo, example is https://user:password@git.patrikx3.tk/')
    .action(async function (command, options) {
      const user = options.user || 'patrikx3';
      const gitUrl = options.git || 'https://git.patrikx3.tk' ;
      switch(command) {
            case 'mirror':
                await github.mirror(user, gitUrl, options.dry)
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

