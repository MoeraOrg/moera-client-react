const path = require('path');
const fs = require('fs/promises');
const execSync = require('child_process').execSync;
const paths = require('../config/paths');

function getBuildRevision() {
    const run = cmd => execSync(cmd).toString().trim();

    let revision = run('git rev-parse --short HEAD');
    const localChanges = !!run('git status -s');
    if (localChanges) {
        const local = run('git diff HEAD|sha1sum|cut -b 1-4');
        revision += `+${local}`;
    }

    return revision;
}

// Create src/build-number.js
function writeBuildRevision() {
    const revision = getBuildRevision();
    console.log(`Build number is ${revision}`);
    const buildNumber = path.resolve(paths.appSrc, 'build-number.js');
    return fs.writeFile(buildNumber, `export const BUILD_NUMBER="${revision}";\n`, {mode: 0o644});
}

// Create build/BUILD.txt
function writeBuildMark() {
    const revision = getBuildRevision();
    const buildMark = path.resolve(paths.appBuild, 'BUILD.txt');
    return fs.writeFile(buildMark, revision, {mode: 0o644});
}

module.exports = {
    writeBuildRevision,
    writeBuildMark
};
