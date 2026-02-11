import fs from 'fs';

if (fs.existsSync('dist/index.html')) {
    fs.copyFileSync('dist/index.html', 'dist/404.html');
    console.log('Copied index.html to 404.html for GitHub Pages SPA support');
} else {
    console.error('dist/index.html not found');
    process.exit(1);
}
