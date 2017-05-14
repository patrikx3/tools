#!/usr/bin/env node
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