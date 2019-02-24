module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
sleep 2    
grunt cory-npm-angular || true    
sleep 2
grunt publish -v || true
sleep 2
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}