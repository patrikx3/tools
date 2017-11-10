module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
grunt cory-npm-angular || true    
grunt publish -v || true
sleep 5
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}