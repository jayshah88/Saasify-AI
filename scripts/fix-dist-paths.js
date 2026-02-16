import fs from 'fs';

const filePath = './dist/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// The file has " characters instead of "
content = content.replace(/\\"/g, '"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Final cleanup of dist/index.html completed.');