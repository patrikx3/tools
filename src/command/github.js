const { program } = require('commander');
const utils = require('corifeus-utils');
const find = utils.fs.find;
const path = require('path');
const github = require('../github');

const defaultGithubExcludes = require('../../github.json').excludes

//p3x for .git 'cd ..;p3x git truncate'
const commands = [
    'mirror',
    'pull',
]
program
    .command('github <command>')
    .description(`
    commands:
        ${commands.join(', ')}

`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .option('-u, --user [user]', 'The GitHub repo, default is patrikx3')
    .option('-n, --note [note]', 'The note in the commit, the default is r0b08x chore')
    .option('-p, --password [password]', 'The GitHub password or token')
    .option('-b, --branch <branch>', 'The default branch is master')
    .option('-g, --git <git>', 'The GIT repo, example is https://user:password@git.patrikx3.com/')
    .option('-x, --exclude <items>', `Exclude paths, default is ${defaultGithubExcludes.join(',')}`, (val) => {
        return val.split(',');
    })
    .option('-o, --only <items>', `Only included paths, default is all`, (val) => {
        return val.split(',');
    })
    .action(async function (command, options) {
        const user = options.user || 'patrikx3';
        const gitUrl = options.git || 'https://git.patrikx3.com';
        const note = options.note || 'r0b08x [chore]  '
        const branch = options.branch || 'master';

        const exclude = options.exclude || defaultGithubExcludes

        console.info(`User: ${user}`);
        console.info(`Git url: ${gitUrl}`);
        console.info(`Note: ${note}`);

        switch (command) {
            case 'pull':

                await utils.childProcess.exec(`
GIT_NAME=$(basename \`git rev-parse --show-toplevel\`)
git pull https://github.com/patrikx3/$GIT_NAME ${branch}`, true);
                break;

            case 'list':


                const repos = await github.list({
                    user: user,
                    exclude: exclude,
                    only: options.only
                });
                console.log(repos)
                break;

            case 'mirror':

                if (options.password === undefined) {
                    throw new Error('password required')
                }

                await github.mirror({
                    user: user,
                    password: options.password,
                    gitUrl: gitUrl,
                    dry: options.dry,
                    note: note,
                    exclude: exclude,
                    only: options.only
                })
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

