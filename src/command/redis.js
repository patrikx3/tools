const commander = require('commander');
const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');
const lib = require('../lib');

commander
    .command('redis [command] [param]')
    .description(`This is for redis`)
    .action(async function (command, param, options) {
        switch (command) {
            case 'del':
                if (param === undefined) {
                    throw new Error('DEL require a parameter')
                }
                const commandExec = `/usr/bin/redis-cli KEYS ${param} | xargs redis-cli DEL`;
//                console.info(commandExec);
                await utils.childProcess.exec(commandExec, true)
                break;
        }
    })
;

