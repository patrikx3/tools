module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
grunt publish || true
sleep 3
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}