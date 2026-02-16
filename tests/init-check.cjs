const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'package.json',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js'
];

const dirsToCheck = [
    'src/core',
    'src/components/base',
    'src/components/ai',
    'src/pages',
    'src/config'
];

console.log('--- Running Project Structure Check ---');

let allPassed = true;

filesToCheck.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    if (exists) {
        console.log(`[PASS] File ${file} exists.`);
    } else {
        console.error(`[FAIL] File ${file} is missing.`);
        allPassed = false;
    }
});

dirsToCheck.forEach(dir => {
    const exists = fs.existsSync(path.join(process.cwd(), dir)) && fs.lstatSync(path.join(process.cwd(), dir)).isDirectory();
    if (exists) {
        console.log(`[PASS] Directory ${dir} exists.`);
    } else {
        console.error(`[FAIL] Directory ${dir} is missing.`);
        allPassed = false;
    }
});

if (!allPassed) {
    process.exit(1);
}

console.log('--- All Structure Checks Passed ---');