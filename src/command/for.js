// rmdirr dir dirs
const commander = require('commander');
const fsExtra = require('fs-extra');
const utils = require('corifeus-utils');

commander
    .command('for <dir> <command...>')
    .description(`
Finds a list of directories (without start ./ and end /) recursively
`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .option('-t, --types <types>', 'Defaults is all, options: d = directory, f = file, like -t=f,d', (val) => {
        return val.split(',');
    })
    .option('-x, --exclude <items>', 'Exclude paths, default is node_module', (val) => {
        const types = {};
        val.split(',').forEach((type) => types[type] = true);
    })
    .action(async function (dir, command, options) {
        command = command.join(' ');
        const find = utils.fs.find;
        console.info(`Directory finding: ${dir}`)

        const paths = await find({
            find: dir,
            type: options.types || {
                d: true,
                f: true
            }
        });
        const dry = options.dry || false;
        if (dry) {
            console.info(`Dry, doesn't do anything, just shows what it does`)
        }
        const promises = [];
        paths.forEach(async (findData) => {
            const generatedCommand = `bash -c '
pushd ${findData.dir}            
set -e
export FOUND_DIR=${findData.dir}                
export FOUND=${findData.path}                
${command}            
popd
'`;
            if (dry) {
                console.info(`Dirs`, path)
//                console.log(generatedCommand);
            } else  {
                const run = utils.childProcess.exec(generatedCommand);
                run.exec.stdout.on('data', (data) => {
                    console.info(data);
                });
                run.exec.stderr.on('data', (data) => {
                    console.error(data);
                });
                promises.push(run);
            }
            //console.info(`Path ${path}, Execute ${command}`)
        })
        Promise.all(promises);
    })
;