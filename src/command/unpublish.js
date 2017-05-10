const commander = require('commander');

// unpublish
commander
    .command('unpublish [packages...]')
    .description(`
The versioning is Major.Minor.Commit-Build
If you omit the package name, it will use all.
`)
    .option('-u, --username [username]', 'Author username, defaults to patrikx3',  (val) => {
        return val.split(',');
    })
    .option('-s, --search [term]', `Search for the given packages, the default is 'p3x,corifeus`,  (val) => {
        return val.split(',');
    })
    .option('-a, --all')
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (packages, options) {
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

        const unpublish = require('../npm-unpublish');
        await unpublish(username, search, packages, dry, all);
    })
;

