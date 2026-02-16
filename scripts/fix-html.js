import fs from 'fs';
import path from 'path';

function fixDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            fixDir(filePath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let newContent = content.replace(/\\\"/g, '"');
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Fixed: ${filePath}`);
            }
        }
    });
}

fixDir('./src/pages');
fixDir('./'); // Also check root index.html