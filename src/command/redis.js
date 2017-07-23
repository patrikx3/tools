const commander = require('commander');
const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');
const lib = require('../lib');

commander
    .command('redis [command] [param]')
    .option('-u, --url <url>', 'REDIS url')
    .description(`This is for redis:   
DEL    
    `)
    .action(async function (command, param, options) {
        let addon = '';
        if (options.url) {
            console.log(options.url)
            const url = new (require('url').URL)(options.url)
            if (url.hostname) {
                addon += `-h ${url.hostname} `
            }
            if (url.password) {
                addon += `-a ${url.password} `
            }
            const pathname = url.pathname.substr(1);
            if (pathname != '') {
                addon += `-n ${pathname} `
            }
        }
        switch (command.toLowerCase()) {
            case 'del':
                if (param === undefined) {
                    throw new Error('DEL require a parameter')
                }
                const commandExec = `/usr/bin/redis-cli ${addon}KEYS ${param} | xargs redis-cli ${addon}DEL`;
                //console.info(commandExec);
                await utils.childProcess.exec(commandExec, true)
                break;
        }
    })
;

