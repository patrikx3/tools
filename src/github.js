const GitHub = require('github-api');
const tmp = require('tmp-promise');
const utils = require('corifeus-utils');
const globby = require('globby');
const mz = require('mz');
const ini = require('ini');
const url = require('url');
const git = require('./git');

const list = async(options) => {
    const {only, user , exclude } = options;
    const gh = new GitHub();
    const response = await gh.getUser(user).listRepos();
    const repos = response.data
    return repos.filter(repo => {
        let isOnly;
        if (only !== undefined) {
            isOnly = only.includes(repo.name)
        } else {
            isOnly = true;
        }
        return repo.full_name === `${user}/${repo.name}` && !exclude.includes(repo.name) && isOnly;
    });
}

const mirror = async(options) => {
    let { only, user, password, gitUrl, dry, note, exclude } = options;
    let tmpDir;
    const errors = [];
    try {
        tmpDir = await tmp.dir();
        console.info(`Generate tmp file: ${tmpDir.path}`);
        const repos = await list({
            user: user,
            exclude: exclude,
            only: only
        });

        await repos.forEachAsync(async(repo) => {
            await utils.childProcess.exec(`
git clone https://${user}:${password}@github.com/${user}/${repo.name} ${tmpDir.path}/github/${repo.name}
cd ${tmpDir.path}/github/${repo.name}
git submodule update --init --recursive  --remote

git clone ${gitUrl}/${repo.name}.git ${tmpDir.path}/git/${repo.name}
cd ${tmpDir.path}/git/${repo.name}
git submodule update --init --recursive  --remote
`, true)
        })

        console.info('Remove all Git .git dirs and move to Github .git dirs');
        await repos.forEachAsync(async(repo) => {
            await utils.childProcess.exec(`
rm -rf ${tmpDir.path}/git/${repo.name}/.git                        
mv ${tmpDir.path}/github/${repo.name}/.git ${tmpDir.path}/git/${repo.name}/
`, true)
        })

        console.info('Move GIT to Github dir');
        await utils.childProcess.exec(`
mv ${tmpDir.path}/github/ ${tmpDir.path}/github-old/
mv ${tmpDir.path}/git/ ${tmpDir.path}/github/
`, true)

        console.info('Move submodules to GitHub');
        await replaceGitSubmodules(`${tmpDir.path}/github`, user);

        console.info('Move init.sh to GitHub');
        await replaceInitSh(`${tmpDir.path}/github`, gitUrl, user);

        await repos.forEachAsync(async(repo) => {
            await utils.childProcess.exec(`
cd ${tmpDir.path}/github/${repo.name}
pwd
git add .
git status
`, true)
        })
        await repos.forEachAsync(async(repo) => {
            try {
                await utils.childProcess.exec(`
cd ${tmpDir.path}/github/${repo.name}
git commit -am "${note} ${new Date().toLocaleString()}"
${dry ? 'true' : 'git push'}
`, true)
            } catch(e) {
                errors.push(e);
            }
        }, true)

        const modules = await git.findModules(`${tmpDir.path}/github/`)
        await modules.forEachAsync(async(module) => {
            await utils.childProcess.exec(`
cd ${module}
git pull
git checkout master
git submodule update --init --recursive  --remote
git submodule foreach --recursive git checkout master
git status
${dry ? 'true' : 'git push'}
`, true)
        }, true)

        console.info('All done')
    } catch(e ) {
        errors.push(e);
    } finally {
        if (tmpDir) {
            console.info(`Cleanup tmp file ${tmpDir.path}`);
            if (!dry) {
                await utils.childProcess.exec(`rm -rf ${tmpDir.path}`,true)
            } else {
                console.info('Dry, not cleanup')
            }
        }

        errors.forEach(e => {
            console.error(e)
        })
    }
}


const replaceGitSubmodules = async(root, user) => {
    const files = await globby(`${root}/**/.gitmodules`)
    await files.forEachAsync(async(file) => {
        console.info(`submodule found ${file}`)
        const string = (await mz.fs.readFile(file)).toString();
        const iniFile = ini.parse(string);
        Object.keys(iniFile).forEach((key) => {
            const submodule = iniFile[key]
            submodule.url = `https://github.com/${user}/${submodule.path}`;
        })
        const result = ini.stringify(iniFile);
        await mz.fs.writeFile(file, result);
        console.info(`submodule replaced ${file}`)
    })
}

const replaceInitSh = async(root, gitUrl, user) => {

    const gitUrlObj = url.parse(gitUrl);
    gitUrl = RegExp.escape(`${gitUrlObj.protocol}//${gitUrlObj.hostname}`);
    const gitUrlRegexp = new RegExp(gitUrl, 'ig')
    const files = await globby(`${root}/**/init.sh`)
    await files.forEachAsync(async(file) => {
        console.info(`init.sh found ${file}`)
        const string = (await mz.fs.readFile(file)).toString();
        const result = string.replace(gitUrlRegexp, `https://github.com/${user}`)
        await mz.fs.writeFile(file, result);
        console.info(`
${result}        
        `);
        console.info(`init.sh replaced ${file}`)
    })
}

module.exports.list = list;
module.exports.mirror = mirror;
module.exports.replaceGitSubmodules = replaceGitSubmodules;
module.exports.replaceInitSh = replaceInitSh;