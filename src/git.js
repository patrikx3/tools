const utils = require('corifeus-utils');
const path = require('path');

const truncate = async (options) => {

    const command = `git config --global credential.helper 'cache --timeout 7200'
git checkout --orphan temp
git add -A
git commit -am "r0b08x (truncate)"
git branch -D master
git branch -m master
git branch --set-upstream-to origin/master master
git push -f origin master`

    console.log(command);
    if (!options.dry) {
        await utils.childProcess.exec(command, {
            display: true,
            maxBuffer: 1024 * 500,
        })
    }
}

const findModules = async (root) => {
    const { globby } = await import('globby')
    const glob = globby

    const modules = await glob(`${root}/**/.gitmodules`);
    return modules.map((dir) => {
        return path.dirname(dir);
    });
}


module.exports.findModules = findModules;
module.exports.truncate = truncate;
