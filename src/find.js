const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');

const multi = async (options) => {
    await options.find.forEachAsync(async (findable) => {
        const resolved = path.resolve(options.root, findable);
        const finds = await mz.fs.exists(resolved);

        if (finds ) {
            const stat = await mz.fs.stat(resolved);
            if (stat.isDirectory()) {
                options.results.push(resolved);
            }
        }
        const foundHit= await mz.fs.readdir(options.root)

        const foundHitPromises = [];
        await foundHit.forEachAsync(async (foundDir) => {
            const resolvedFoundDir = path.resolve(options.root, foundDir);
            const stat = await mz.fs.stat(resolvedFoundDir);
            if (!stat.isDirectory()) {
                return;
            }
            if (options.find.includes(foundDir)) {
                return;
            }
            foundHitPromises.push(multi({
                find: options.find,
                root: resolvedFoundDir,
                results: options.results,
            }))
        })
        await Promise.all(foundHitPromises);

    })
    return options.results;
}

module.exports = async (options) => {
    options.root = options.root || process.cwd();
    options.results = options.results || [];


    if (!Array.isArray(options.find)) {
        options.find = [options.find];
    }
    options.find = options.find.map(findable => {
        findable= findable.trim();
        if (findable.startsWith('./')) {
            findable = findable.substr(2);
        }
        if (findable.endsWith('/')) {
            findable = findable.substr(0, findable.length - 1);
        }
        return findable;
    })
    return await multi(options);
};

