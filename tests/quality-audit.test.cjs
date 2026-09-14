/**
 * Comprehensive Quality & Production-Readiness Audit Suite
 * Verifies open-source documentation, viewport tags, link resolution,
 * absence of obsolete artifacts, and production build integrity.
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('       SAASIFY AI - FINAL PRODUCTION AUDIT & QUALITY TEST       ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  [PASS] ${message}`);
    } else {
        failedTests++;
        console.error(`  [FAIL] ${message}`);
    }
}

// 1. Open Source Suite Verification
console.log('1. Verifying Open-Source Governance & Documentation Suite:');
const requiredDocFiles = [
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'CODE_OF_CONDUCT.md',
    'SECURITY.md',
    'ARCHITECTURE.md',
    '.env.example'
];

requiredDocFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    assert(fs.existsSync(filePath), `Required open-source document '${file}' exists.`);
});

// Check LICENSE content for MIT and author Jay Shah
const licenseContent = fs.readFileSync(path.join(process.cwd(), 'LICENSE'), 'utf8');
assert(licenseContent.includes('MIT License') && licenseContent.includes('Jay Shah'), 'LICENSE contains MIT License and Jay Shah attribution.');

// Check README content
const readmeContent = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
assert(readmeContent.includes('Saasify AI') && readmeContent.includes('Deployment'), 'README.md contains project title and deployment instructions.');

// 2. Absence of Obsolete Artifacts
console.log('\n2. Verifying Absence of Obsolete Files & Temp Caches:');
const forbiddenFiles = [
    '.ai-ide-cache-fallback.json',
    '.context-memory.md',
    'README.txt',
    'documentation/sales_copy.txt',
    'public/css/style.css',
    'src/js/main.js'
];

forbiddenFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    assert(!fs.existsSync(filePath), `Obsolete file '${file}' is successfully eradicated.`);
});

// 3. HTML Viewport Verification
console.log('\n3. Verifying Viewport Meta Tags Across All HTML Pages:');
function getHtmlFiles(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== 'node_modules' && f !== 'dist' && f !== '_bmad' && f !== '_bmad-output' && f !== '.git' && f !== '.gemini') {
                files.push(...getHtmlFiles(p));
            }
        } else if (f.endsWith('.html') && !p.includes('components')) {
            files.push(p);
        }
    });
    return files;
}

const allPages = getHtmlFiles(process.cwd());
let allHaveViewport = true;
allPages.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const hasViewport = /<meta\s+name=["']viewport["']/i.test(content);
    if (!hasViewport) {
        allHaveViewport = false;
        console.error(`    Missing viewport in: ${path.relative(process.cwd(), file)}`);
    }
});
assert(allHaveViewport, `All ${allPages.length} primary HTML pages contain '<meta name="viewport">' tag.`);

// 4. Production Build & Relative Links Integrity in dist/
console.log('\n4. Verifying Production Build Integrity in dist/:');
const distDir = path.join(process.cwd(), 'dist');
assert(fs.existsSync(distDir), `'dist/' directory exists.`);

const distIndex = path.join(distDir, 'index.html');
assert(fs.existsSync(distIndex), `'dist/index.html' exists.`);

if (fs.existsSync(distIndex)) {
    const distIndexContent = fs.readFileSync(distIndex, 'utf8');
    // Ensure primary CTA is an active anchor, not an inert button
    const hasActiveCta = distIndexContent.includes('href="auth/register.html"') && distIndexContent.includes('Get Started Now');
    assert(hasActiveCta, `'dist/index.html' contains active anchor link for 'Get Started Now'.`);

    // Ensure components CTA is active
    const hasComponentsCta = distIndexContent.includes('href="components.html"') && distIndexContent.includes('View Components');
    assert(hasComponentsCta, `'dist/index.html' contains active anchor link for 'View Components'.`);
}

// 5. Link Resolution Check Across All Pages in dist/
console.log('\n5. Verifying Relative Link Resolution in dist/:');
function getDistHtml(dir) {
    const files = [];
    if (!fs.existsSync(dir)) return files;
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            if (f !== 'node_modules' && !p.includes('src' + path.sep + 'components')) {
                files.push(...getDistHtml(p));
            }
        } else if (f.endsWith('.html')) {
            files.push(p);
        }
    });
    return files;
}

const distPages = getDistHtml(distDir);
let brokenLinksCount = 0;
distPages.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const dir = path.dirname(file);
    const regex = /href=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const href = match[1].trim();
        if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:') || href === '') continue;
        const clean = href.split('#')[0].split('?')[0];
        if (!clean) continue;
        const resolved = path.resolve(dir, clean);
        if (!fs.existsSync(resolved)) {
            brokenLinksCount++;
            console.error(`    Broken link in ${path.relative(distDir, file)}: href="${href}" (Resolved: ${resolved})`);
        }
    }
});

assert(brokenLinksCount === 0, `Zero broken relative links in dist/ across all ${distPages.length} pages.`);

// Summary
console.log('\n================================================================');
console.log(`TOTAL AUDIT CHECKS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log('>>> ALL PRODUCTION QUALITY AUDIT CHECKS PASSED (10/10) <<<\n');
    process.exit(0);
}

