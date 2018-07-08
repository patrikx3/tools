const utils = require('corifeus-utils')

const path = require('path')

//  npm deprecate ${repo}@${version} "It is deprecated"
const exec = require('child_process').exec;
const repo = process.argv[2];

const removeVersion = (repo, version, keptVersions, dry, all)  => {
    const semVersion = version.split('.');

    if (!all) {
        const keptVersion = `${semVersion[0]}.${semVersion[1]}`

        if (!keptVersions.hasOwnProperty(keptVersion)) {
            console.info(`Kept version ${version}`);
            keptVersions[keptVersion] = version;
            return;
        }
    }

    const command = `npm unpublish ${repo}@${version} --registry https://registry.npmjs.org`;
    if (dry) {
        console.info(`[DRY] Removed version ${version}`);
        console.info(command)
        return;
    }
    return new Promise((resolve, reject) => {
        const run = exec(command, (e, stdout, stderr) => {
            if (e) {
                return reject(e);
            }
            if (stderr !== '') {
                return reject(new Error(stderr));
            }
            console.info(`Removed version ${version}`);
            return resolve(stdout);
        })
        run.stdout.on('data', (data) => {
            console.info(data);
        });
        run.stderr.on('data', (data) => {
            console.error(data);
        });
    })
}


const findVersions = async (repo) => {
    return new Promise((resolve, reject) => {
        exec(`npm show ${repo} --json`,  async(e, stdout, stderr) => {
            if (e) {
                console.error(e);
                reject(e);
                return;
            }
            const info = JSON.parse(stdout);
            const versions = info.versions.reverse();
            console.info(`Versions:`, `${versions.length} versions`, versions);
            resolve(versions)
        });
    })

}

const removePackage = async (repo, dry, all) => {
    console.info(`Remove repo ${repo}`);
    const versions = await findVersions(repo);
    const keptVersions = {}
    if (Object.keys(versions).length > 1) {
        for(let version of versions) {
            await removeVersion(repo, version, keptVersions, dry, all);
        }
    }
    const keptVersionsArray = Object.values(keptVersions);
    const log = `${repo} 
Total: ${versions.length} Kept Versions: ${keptVersionsArray.length} 
Remained versions, ${keptVersionsArray.join(' , ')}
`;
    console.info(log);
    return {
        versions: versions,
        kept: keptVersionsArray,
        log: log
    };
}


module.exports = async (usernames, search, packages, dry, all) => {
    const isAll = packages.length === 0;
    console.info(`
----------------------------------------------
Unpublish    
----------------------------------------------
Usernames: ${usernames.join(', ')}
Search: ${search.join(', ')}
Packages: ${isAll   ? 'all' : packages.join(', ')}
Dry: ${dry}
`)

    const logs = [];
    const errorLogs = [];
    const promises = [];

    const createLog = (repo, dry) => {
        return new Promise(async(resolve, reject) => {
            try {
                const log = await removePackage(repo, dry, all);
                logs.push(log);
                resolve();
            } catch(e) {
                reject(e);
            }
        })
    }
    //https://registry.npmjs.org/-/v1/search?text=p3x
    if (isAll) {
        const searchPromises = [];

        search.forEach((term) => {
            searchPromises.push(
                utils.http.request(`https://registry.npmjs.org/-/v1/search?text=${term}`)
            )
        })
        const results = await Promise.all(searchPromises);

        // find
        let objects = [];
        results.forEach(result => {
            objects = objects.concat(result.body.objects)
        })
        objects = objects .filter((obj) => {
            if (!obj.package.hasOwnProperty('author')) {
                errorLogs.push({
                    pkg: obj.package,
                    log: `000-This package is invalid: ${obj.package.name} ${obj.package.version}

${JSON.stringify(obj.package, null, 4)}
`
                })
                return false;
            }
            return usernames.includes(obj.package.author.username);
        })

        objects.forEach((object) => {
            promises.push(createLog(object.package.name, dry))
        });
    } else {
        packages.forEach((pkg) => {
            promises.push(createLog(pkg, dry))
        })
    }

    await Promise.all(promises);
    logs.forEach((log) => {
        console.info(log.log);
    })
    errorLogs.forEach((log) => {
        console.info(log.log);
    })
    console.info(`
Total: ${logs.length}
Errors: ${errorLogs.length}
`)
    return logs;
}

