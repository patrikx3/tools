#!/usr/bin/env node
const commander = require('commander');
const utils = require('corifeus-utils');
const pkg = require('../package.json');
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

    require('../src/command/rmdirr')
    require('../src/command/unpublish')
    require('../src/command/forr')


    const isInModule = await mz.fs.exists(`${__dirname}/../../node_modules`);
    if (!isInModule) {
        require('../src/command/pdf')
    }

    commander.parse(process.argv);

    if (!process.argv.slice(2).length) {
        commander.outputHelp();
    }

}

start();