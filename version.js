#!/usr/bin/env node

const fs = require('fs');
const pkg = require('./package.json');

let action = "show"; // Show version by default
if (process.argv.length > 2) {
    action = process.argv[2].toLowerCase();
}

let section = "patch"; // Update patch by default
if (process.argv.length > 3) {
    section = process.argv[3].toLowerCase();
}

const help = () => {
    return `Usage:
    version.js help
    version.js show
    version.js up [major|minor|patch]`
};

const upVersion = {
    'major': (sections) => {
        return `${sections[0] + 1}.0.0`;
    },
    'minor': (sections) => {
        return `${sections[0]}.${sections[1] + 1}.0`;
    },
    'patch': (sections) => {
        return `${sections[0]}.${sections[1]}.${sections[2] + 1}`;
    }
};

const saveVersion = (packageJson, version) => {
    packageJson.version = version;
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2)+"\n", 'utf8');
};

if (!Object.keys(upVersion).includes(section)) {
    throw new Error(`Invalid version section: ${section}. Please choose "major", "minor" or "patch".`)
}

switch (action) {
    case "show":
        console.log(pkg.version);
        process.exit(0);
    case "up":
        const newVersion = upVersion[section](pkg.version
            .split('.')
            .map(n => Number(n)));
        console.log(newVersion);
        saveVersion(pkg, newVersion);
        process.exit(0);
    case "down":
        console.error("You can't change versions back! >:|");
        process.exit(1);
    case "help":
        console.log(help());
        process.exit(0);
    default:
        console.error(`Unknown option ${action}`);
        console.log(help());
        process.exit(1);
}
