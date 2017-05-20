const utils = require('corifeus-utils');

const executeCommandByPath = async (options) => {
    const {
        findData, command, errors
    } = options;

    try {
        await utils.childProcess.exec(`
bash -c '
pushd ${findData.dir}            
set -e
export FOUND_DIR=${findData.dir}                
export FOUND=${findData.path}                
${command}
popd
'
`, true)

    } catch (e) {
        if (errors !== undefined) {
            errors.push(e);
        }
        throw e;
    }
}

module.exports.executeCommandByPath = executeCommandByPath;