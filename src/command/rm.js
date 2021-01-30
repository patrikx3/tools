const { program } = require('commander');
const fsExtra = require('fs-extra');
const utils = require('corifeus-utils');

program
    .command('rm <dirs...>')
    .description(`
Delete the list of directories (without start ./ and end /) recursively
`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .option('-f, --file', 'Search for files')
    .option('--directory', 'Search for files')
    .action(async function (dirs, options) {
        const find = utils.fs.find;
        const files = await find({
            find: dirs,
            type: {
                d: options.directory || true,
                f: options.file
            }
        });
        const dry = options.dry || false;
        if (dry) {
            console.info(`Dry, doesn't remove anything`)
        }
        const promises = [];
        files.forEach(async (file) => {
            if (!dry) {
                promises.push(fsExtra.remove(file.path));
            }
            console.info(`Delete ${file.path}`)
        })
        Promise.all(promises);
    })
;
