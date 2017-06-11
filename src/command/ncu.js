const commander = require('commander');
const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');
const lib = require('../lib');

commander
    .command('ncu')
    .description(`This is for global update`)
    .action(async function (options) {
        const ncu = require('npm-check-updates');

        const result = await ncu.run({
            global: true,
        })
        console.log(result);
    })
;

