const { program } = require('commander');
const utils = require('corifeus-utils');
const yaml = require('yamljs')
const mz = require('mz');
const path = require('path')
const _ = require('lodash');

program
    .command('travis [commands...]')
    .description(`
    It is imporant, that before you do anything, install the travis Ruby gem.
    You need the ruby-dev environment as well, so
        apt install ruby-dev
        gem install travis (gem search travis - specific version)
        travis login

        Based on: http://blog.code4hire.com/2016/06/Adding-GitHub-token-to-Travis-CI-configuration/

    Commands:
        github-token: Adds a github token to all .travis files, recursively
          arguments: token or repo token, if you use 1 arguments, it is patrikx3
          make sure you are logged in travis.
`)
    .option('-s, --serial', 'Serial ')
    .option('-o, --org', 'Use the ORG environment')
    .action(async function (commands, options) {

        switch (commands[0]) {
            case 'github-token':

                let repo = commands[1]
                let githubToken = commands[2]

                if (repo === undefined) {
                    console.error('2nd repo or token is required')
                    return;
                }

                if (githubToken === undefined) {
                    githubToken = repo;
                    repo = 'patrikx3';
                }

                console.log(`found to execute repo ${repo} with token ${githubToken}`)

                let paths = await utils.fs.find({
                    find: '.travis.yml',
                });

                await paths.forEachAsync(async (findInfo) => {
                    try {
                        const dir = findInfo.dir
                        const file = findInfo.path;
                        const repoName = path.basename(dir);
//                        if (repoName !== 'corifeus') {
//                            return;
//                        }
                        const travisYml = (await mz.fs.readFile(file)).toString();
                        const travisJson = yaml.parse(travisYml);

//                        console.log('travisJson');
//                        console.log(JSON.stringify(travisJson,null,4))

                        if (_.hasIn(travisJson, 'env.global.secure')) {
                            delete travisJson.env.global.secure
                            if (Object.keys(travisJson.env.global).length === 0) {
                                delete travisJson.env.global;
                            }
                            if (Object.keys(travisJson.env).length === 0) {
                                delete travisJson.env;
                            }

//                            console.log('new travisJson')
//                            console.log( JSON.stringify(travisJson,null,4))

                            const newTravisYml = yaml.stringify(travisJson, 4)

//                            console.log('new travis yml')
//                            console.log(newTravisYml)

                            await mz.fs.writeFile(file, newTravisYml)
                        }
// https://github.com/travis-ci/travis.rb/issues/738#issuecomment-620075358 <- GITHUB_TOKEN vs GH_TOKEN
                        const travisSecureCommand = `bash -c 'pushd ${dir}
travis encrypt 'GH_TOKEN=${githubToken}' -r ${repo}/${repoName} --add ${options.org ? '--org' : '--pro'} --no-interactive
cat .travis.yml
popd
'
`
                        console.log(`Executing:
${travisSecureCommand}

`)
                        await utils.childProcess.exec(travisSecureCommand, true)
                    } catch (e) {
                        console.error(e);
                        throw e;
                    }
                }, options.serial)

                break;

            default:
                commander.outputHelp();
                console.error(`Unknown command: ${commands[0]}`)
                process.exit(1)
                break;
        }

    })
;

