module.exports.command = {

    publish: (options = {all: true}) => `grunt cory-npm cory-replace
grunt cory-raw-npm-angular || true
(grunt publish -v && sleep 3)|| true
__PUBLISH_LOCATION_START__
npm publish
${options.all ? 'npm publish --registry https://registry.npmjs.org' : ''}
__PUBLISH_LOCATION_END__`
}
