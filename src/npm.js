module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
grunt cory-npm-angular || true    
(grunt publish -v && sleep 3)|| true
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}`
}
