import fs from 'fs-extra';
import path from 'path';

const __dirname = path.resolve();

async function finalizeBuild() {
    const distDir = path.join(__dirname, 'dist');
    const pagesDir = path.join(distDir, 'src/pages');
    const componentsDir = path.join(__dirname, 'src/components');
    const destComponentsDir = path.join(distDir, 'src/components');

    try {
        // 1. Copy Components
        await fs.copy(componentsDir, destComponentsDir);
        console.log('--- Components copied ---');

        // 2. Flatten and Fix
        async function processFile(src, dest, depth) {
            let content = await fs.readFile(src, 'utf8');
            
            // Generate the correct relative prefix based on depth
            // Depth 0 (root): assets/
            // Depth 1 (subfolder): ../assets/
            const prefix = depth === 0 ? '' : '../'.repeat(depth);
            
            // Replace any variant of relative paths created by Vite (../../ or ../../../ etc)
            // with our desired relative prefix
            content = content.replace(/src="(?:\.\.\/)+assets\//g, `src="${prefix}assets/`);
            content = content.replace(/href="(?:\.\.\/)+assets\//g, `href="${prefix}assets/`);
            content = content.replace(/src="(?:\.\.\/)+src\//g, `src="${prefix}src/`);
            content = content.replace(/href="(?:\.\.\/)+src\//g, `href="${prefix}src/`);
            
            await fs.writeFile(dest, content);
            console.log(`Processed [Depth ${depth}]: ${path.basename(dest)}`);
        }

        // Process root index.html (Already in dist root from Vite)
        const rootIndex = path.join(distDir, 'index.html');
        if (fs.existsSync(rootIndex)) {
            await processFile(rootIndex, rootIndex, 0);
        }

        // Flatten Pages
        if (fs.existsSync(pagesDir)) {
            const files = await fs.readdir(pagesDir);
            for (const file of files) {
                const filePath = path.join(pagesDir, file);
                if ((await fs.stat(filePath)).isFile() && file.endsWith('.html')) {
                    await processFile(filePath, path.join(distDir, file), 0);
                }
            }
            
            // Subdirs
            const subdirs = ['auth', 'dashboard'];
            for (const sub of subdirs) {
                const srcSub = path.join(pagesDir, sub);
                const destSub = path.join(distDir, sub);
                if (fs.existsSync(srcSub)) {
                    await fs.ensureDir(destSub);
                    const subFiles = await fs.readdir(srcSub);
                    for (const file of subFiles) {
                        const s = path.join(srcSub, file);
                        const d = path.join(destSub, file);
                        if ((await fs.stat(s)).isFile() && file.endsWith('.html')) {
                            await processFile(s, d, 1);
                        }
                    }
                }
            }
        }

        console.log('--- Build finalized and paths corrected ---');
    } catch (err) {
        console.error('Error finalising build:', err);
    }
}

finalizeBuild();
