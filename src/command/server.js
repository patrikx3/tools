const commander = require('commander');
const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');
const lib = require('../lib');

commander
    .command('server [command] [param]')
    .description(`This is for global update`)
    .option(`-p, --password <password>`)
    .action(async function (command, param, options) {
        let url;
        switch (command) {
            case 'scale':
            case 'worker':
                if (param === undefined) {
                    param = 'auto';
                }
                url = `http://localhost:23502/worker/${param}`;
                break;

            default:
                url  = `http://localhost:23502/status`;
                break;
        }
        const response = await utils.http.request({
            url: url,
            headers: {
                'Authorization': options.password || ''
            }
        });
        console.log(JSON.stringify(response.body, null, 2));

    })
;

