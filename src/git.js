const utils = require('corifeus-utils');
const globby = require('globby');
const mz = require('mz');
const ini = require('ini');

const truncate = async (options) => {

    const command = `git config --global credential.helper 'cache --timeout 7200'
git checkout --orphan temp
git add -A
git commit -am "p3x-robot"
git branch -D master
git branch -m master
git push -f origin master`

    console.log(command);
    if (!options.dry) {
        await utils.childProcess.exec(command, true)
    }
}

const replaceGitSubmodules = async(root, user) => {
    const files = await globby(`${root}/**/.gitmodules`)
    await files.forEachAsync(async(file) => {
        console.info(`Found submodule: ${file}`)
        const string = (await mz.fs.readFile(file)).toString();
        const iniFile = ini.parse(string);
        Object.keys(iniFile).forEach((key) => {
            const submodule = iniFile[key]
            submodule.url = `https://github.com/${user}/${submodule.path}`;
        })
        const result = ini.stringify(iniFile);
        await mz.fs.writeFile(file, result);
        console.info(`Submodule: ${file}, replaced`)
    })
}

module.exports.truncate = truncate;
module.exports.replaceGitSubmodules = replaceGitSubmodules;