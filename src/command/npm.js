const { program } = require('commander');
const utils = require('corifeus-utils');
const mz = require('mz');
const hasin = require('lodash/hasIn');

const npmLib = require('../npm');

const commands = [
    'publish',
    'update',
    'login',
    'unpublish',
]

program
    .command('npm <command> [packages...]')
    .description(`
    The versioning is Major.Minor.Commit-Build
    If you omit the package name, it will use all.

    commands:
        ${commands.join(', ')}

`)
    .option('-u, --username [username]', 'Author username, defaults to patrikx3', (val) => {
        return val.split(',');
    })
    .option('-s, --search [term]', `Search for the given packages, the default is 'p3x,corifeus`, (val) => {
        return val.split(',');
    })
    .option('-a, --all')
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (command, packages, options) {
        let search = options.search;
        if (search === undefined) {
            search = ['p3x', 'corifeus']
        }

        let username = options.username;
        if (username === undefined) {
            username = ['patrikx3'];
        }

        const dry = options.dry || false;
        const all = options.all || false;

        switch (command) {

            case 'update':
                if (await mz.fs.exists('./package.json')) {
                    await utils.childProcess.exec(`ncu -u --loglevel verbose --packageFile package.json`, true)
                }

                break;

            case 'unpublish':
                const unpublish = require('../npm-unpublish');
                await unpublish(username, search, packages, dry, all);
                break;

            case 'publish':
                if (await mz.fs.exists('./package.json')) {
                    const pkg = require(`${process.cwd()}/package.json`);
                    if (hasin(pkg, 'corifeus.publish') && pkg.corifeus.publish === true) {
                        await utils.childProcess.exec(npmLib.command.publish({
                            all: options.all
                        }), true)
                    } else {
                        console.info(`This package.json has not corifeus.publish = true`);
                    }
                } else {
                    console.info(`This directory has no package.json`);
                }
                break;

            case 'login':
                await utils.childProcess.exec(`npm login --registry https://registry.npmjs.org`, true)
                break;

            default:
                console.error(`Unknown command: ${command}`)
        }
    })
;

