#!/usr/bin/env node
//const os = require('os');
//const process = require('process');
//const cores = os.cpus().length < 4 ? 4 : os.cpus().length;
//process.env.UV_THREADPOOL_SIZE = cores;
//console.debug(`P3X sets UV_THREADPOOL_SIZE to ${cores} thread pool`)

if (!require('fs').existsSync(`${__dirname}/../node_modules`)) {
    require('child_process').execSync(`cd ${__dirname}/..; npm install --only=prod`, {
        stdio: 'inherit'
    });
}

const commander = require('commander');
const utils = require('corifeus-utils');
const pkg = require(`../package.json`);
const mz = require('mz');
const start = async() => {
// command
// <command> required
// [command] optional
// [command ...] variable options
    commander
        .version(pkg.version)
        .usage('[options]')
    ;


    require('../src/command/rm')
    require('../src/command/npm')
    require('../src/command/for')
    require('../src/command/git')
    require('../src/command/github')
    require('../src/command/each')
    require('../src/command/ncu')
    require('../src/command/docker')
    require('../src/command/server')
    require('../src/command/redis')

// redis-cli KEYS chrome:* | xargs redis-cli DEL
    /*
    const isInModule = await mz.fs.exists(`${__dirname}/../../node_modules`);
    if (!isInModule) {
        require('../src/command/pdf')
    }
    */

    commander.parse(process.argv);

    if (!process.argv.slice(2).length) {
        commander.outputHelp();
    }


}

start();