#!/usr/bin/env node
const path = '/tmp/tmp-6503ODo7z962XubX/github';
const git = require('../../src/git');

const start = async() => {
    console.log(await git.findModules(path));
}
start();