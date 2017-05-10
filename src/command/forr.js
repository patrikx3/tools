// rmdirr dir dirs
const commander = require('commander');
const fsExtra = require('fs-extra');
const utils = require('corifeus-utils');

commander
    .command('forr <dir> <command...>')
    .description(`
Finds a list of directories (without start ./ and end /) recursively
`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (dir, command, options) {
        command = command.join(' ');
        const find = require('../find');
        console.info(`Directory finding: ${dir}`)
        const paths = await find({
            find: dir
        });
        const dry = options.dry || false;
        if (dry) {
            console.info(`Dry, doesn't do anything, just shows what it does`)
        }
        const promises = [];
        paths.forEach(async (path) => {
            const generatedCommand = `bash -c '
pushd ${path}            
set -e
export FOUND=${path}                
${command}            
popd
'`;
            if (dry) {
                console.info(`Dirs`, path)
//                console.log(generatedCommand);
            } else  {
                const run = utils.childProcess.exec(generatedCommand);
                run.stdout.on('data', (data) => {
                    console.info(data);
                });
                run.stderr.on('data', (data) => {
                    console.error(data);
                });
                promises.push(run);
            }
            //console.info(`Path ${path}, Execute ${command}`)
        })
        Promise.all(promises);
    })
;