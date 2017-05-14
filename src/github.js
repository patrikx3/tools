const GitHub = require('github-api');
const tmp = require('tmp-promise');
const git = require('./git');
const utils = require('corifeus-utils');

const list = async(user ) => {
    const gh = new GitHub();
    const response = await gh.getUser(user).listRepos();
    const repos = response.data
    return repos.filter(repo => repo.fork === false && repo.full_name === `${user}/${repo.name}`);
}

const mirror = async(user, gitUrl, dry) => {
    let tmpDir;
    try {
        tmpDir = await tmp.dir();
        console.info(`User: ${user}`);
        console.info(`Git url: ${gitUrl}`);
        console.info(`Generate tmp file: ${tmpDir.path}`);
        const repos = await list(user);

        await repos.forEachAsync(async(repo) => {
            await utils.childProcess.exec(`
git clone https://github.com/${user}/${repo.name} ${tmpDir.path}/github/${repo.name}
git clone ${gitUrl}/${repo.name}.git ${tmpDir.path}/git/${repo.name}
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
rm -rf ${tmpDir.path}/github/
mv ${tmpDir.path}/git/ ${tmpDir.path}/github/
`, true)

        console.info('Move submodules to GitHub');
        await git.replaceGitSubmodules(`${tmpDir.path}/github`, user);



    } catch(e ) {
        throw e;
    } finally {
        if (tmpDir) {
            console.info(`Cleanup tmp file ${tmpDir.path}`);
            if (!dry) {
                tmpDir.cleanup();
            }
        }
    }
}

module.exports.list = list;
module.exports.mirror = mirror;