module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
sleep 1    
grunt cory-npm-angular || true    
sleep 1
grunt publish -v || true
sleep 1
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}
