const commander = require('commander');
const fsExtra = require('fs-extra');

commander
    .command('rm <dirs...>')
    .description(`
Delete the list of directories (without start ./ and end /) recursively
`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (dirs, options) {
        const find = require('../find');
        const files = await find({
            find: dirs,
            type: {
                d: true
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