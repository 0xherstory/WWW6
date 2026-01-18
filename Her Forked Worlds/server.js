const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 移除URL中的查询参数
    let urlPath = req.url.split('?')[0];

    let filePath = '.' + urlPath;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 服务器已启动！`);
    console.log(`📍 访问地址: http://localhost:${PORT}`);
    console.log(`========================================\n`);
    console.log(`页面导航:`);
    console.log(`  主页: http://localhost:${PORT}`);
    console.log(`  宇宙故事树: http://localhost:${PORT}/universe-hub/universe-hub.html`);
    console.log(`  关注页面: http://localhost:${PORT}/www6demo-4/following-page.html`);
    console.log(`\n按 Ctrl+C 停止服务器\n`);
});
