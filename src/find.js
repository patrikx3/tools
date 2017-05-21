const utils = require('corifeus-utils');
const path = require('path');
const mz = require('mz');

const multi = async (options) => {
    await options.find.forEachAsync(async (findable) => {
        const resolved = path.resolve(options.root, findable);
        const finds = await mz.fs.exists(resolved);
        if (finds) {
            const stat = await mz.fs.stat(resolved);

            if (
                (options.type.hasOwnProperty('d') && stat.isDirectory())
                ||
                (options.type.hasOwnProperty('f') && stat.isFile())
            ) {
                options.results.push({
                    path: resolved,
                    dir: stat.isFile() ? path.dirname(resolved) : resolved,
//                    stat: stat
                });
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
            if (options.find.includes(foundDir) || options.exclude.includes(foundDir)) {
                return;
            }

            const newOptions = Object.assign({}, options)
            newOptions.root = resolvedFoundDir;
            foundHitPromises.push(multi(newOptions))
        })
        await Promise.all(foundHitPromises);

    })
    return options.results;
}

module.exports = async (options) => {
    if (typeof options === 'string') {
        options = {
            find: options
        }
    }
    options.root = options.root || process.cwd();
    options.results = options.results || [];

    options.type = options.type || {
        d: true,
        f: true,
    };

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
    if (!options.exclude) {
        options.exclude = [];
        const excluder = (path) => {
            if (!options.find.includes(path)) {
                options.exclude.push(path);
            }
        }
        excluder('node_modules')
        excluder('bower_components')
    }
    console.log(`Options: ${JSON.stringify(options, null, 2)}`)


    return await multi(options);
};

