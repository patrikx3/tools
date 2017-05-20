const utils = require('corifeus-utils');
const globby = require('globby');
const path = require('path');

const truncate = async (options) => {

    const command = `git config --global credential.helper 'cache --timeout 7200'
git checkout --orphan temp
git add -A
git commit -am "p3x-robot"
git branch -D master
git branch -m master
git branch --set-upstream-to origin/master master
git push -f origin master`

    console.log(command);
    if (!options.dry) {
        await utils.childProcess.exec(command, true)
    }
}

const findModules = async(root) => {
    const modules = await globby(`${root}/**/.gitmodules`);
    return modules.map((dir) => {
        return path.dirname(dir);
    });
}


module.exports.findModules = findModules;
module.exports.truncate = truncate;
