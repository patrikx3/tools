module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
sleep 5    
grunt cory-npm-angular || true    
sleep 5
grunt publish -v || true
sleep 5
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}