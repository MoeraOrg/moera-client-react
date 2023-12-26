const path = require('path');
const fs = require('fs/promises');
const execSync = require('child_process').execSync;
const paths = require('../config/paths');

// Create src/build-number.js
function writeBuildRevision() {
    const run = cmd => execSync(cmd).toString().trim();

    let revision = run('git rev-parse --short HEAD');
    const buildNumber = path.resolve(paths.appSrc, 'build-number.js');
    const localChanges = !!run('git status -s');
    if (localChanges) {
        const local = run('git diff HEAD|sha1sum|cut -b 1-4');
        revision += `+${local}`;
    }
    console.log(`Build number is ${revision}`);
    return fs.writeFile(buildNumber, `export const BUILD_NUMBER="${revision}";\n`, {mode: 0o644});
}

module.exports = {
    writeBuildRevision
};
