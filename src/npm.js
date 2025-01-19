module.exports.command = {

    publish: (options = {all: true}) => {
        const otp = process.env.NPM_OTP

        console.log('OTP: ' + otp)

        return `grunt cory-npm cory-replace
grunt cory-raw-npm-angular || true
(grunt publish -v && sleep 3)|| true
__PUBLISH_LOCATION_START__
#npm publish
npm publish --registry https://registry.npmjs.org --otp=${otp}
__PUBLISH_LOCATION_END__`
    }
}
