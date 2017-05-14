/*
const commander = require('commander');

// unpublish
commander
    .command('pdf [file]')
    .description(`
Parse a pdf file    
`)
    .option('-d, --dry', 'Do not actually remove packages, just show what it does')
    .action(async function (file, options) {
        const pdf = require('../pdf');
        await pdf(file);
    })
;

*/