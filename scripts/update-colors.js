import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
};

const mappings = [
    ['primary-', 'indigo-'],
    ['neutral-', 'slate-'],
    ['bg-primary-600', 'bg-indigo-600'],
    ['text-primary-500', 'text-indigo-500'],
    ['from-primary-500', 'from-indigo-500'],
    ['to-secondary-600', 'to-slate-600']
];

walk('./src/pages', (filePath) => {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;
        
        mappings.forEach(([oldVal, newVal]) => {
            content = content.split(oldVal).join(newVal);
        });

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated colors in: ${filePath}`);
        }
    }
});
