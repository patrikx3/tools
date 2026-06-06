module.exports.command = {

    publish: (options = {all: true}) => {
        const otp = process.env.NPM_OTP
        const otpFlag = otp ? ` --otp=${otp}` : ''

        console.log('OTP: ' + (otp || '(none — using auth token)'))

        return `grunt cory-npm cory-replace
grunt cory-raw-npm-angular || true
(grunt publish -v && sleep 3)|| true
__PUBLISH_LOCATION_START__
#npm publish
yarn publish --registry https://registry.npmjs.org${otpFlag}
__PUBLISH_LOCATION_END__`
    }
}
