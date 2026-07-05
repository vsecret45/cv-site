const http = require('http');
const fs = require('fs');
const path = require('path');
const contactHandler = require('./api/contact');
const accountDeleteHandler = require('./api/account-delete');
const cvAuthConfigHandler = require('./api/cv-auth-config');
const kirbyHandler = require('./api/kirby');

const root = __dirname;
const port = Number.parseInt(process.env.PORT || '8000', 10);
const host = process.env.HOST || '127.0.0.1';

const loadEnvFile = (filename) => {
    const envPath = path.join(root, filename);

    if (!fs.existsSync(envPath)) {
        return;
    }

    const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

    envLines.forEach((line) => {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }

        const separatorIndex = trimmed.indexOf('=');

        if (separatorIndex === -1) {
            return;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        let value = trimmed.slice(separatorIndex + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (key) {
            process.env[key] = value;
        }
    });
};

const loadEnv = () => {
    ['.env', '.env.local'].forEach(loadEnvFile);
};

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
};

const sendStaticFile = (request, response) => {
    const parsedUrl = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);

    // Supabase confirmation/reset links hit /auth/callback directly.
    // Serve the dedicated entrypoint explicitly so local preview never falls through to 404.
    if (pathname === '/auth/callback' || pathname === '/auth/callback/') {
        const callbackFilePath = path.join(root, 'auth', 'callback', 'index.html');
        response.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });
        fs.createReadStream(callbackFilePath).pipe(response);
        return;
    }

    const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const filePath = path.normalize(path.join(root, relativePath));
    const fileRelativePath = path.relative(root, filePath);

    if (fileRelativePath.startsWith('..') || path.isAbsolute(fileRelativePath) || fileRelativePath.startsWith('.git') || fileRelativePath.startsWith('.env')) {
        response.writeHead(403);
        response.end('Forbidden');
        return;
    }

    const streamResolvedFile = (resolvedPath) => {
        response.writeHead(200, {
            'Content-Type': mimeTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream',
        });
        fs.createReadStream(resolvedPath).pipe(response);
    };

    fs.stat(filePath, (statError, stats) => {
        if (!statError && stats.isFile()) {
            streamResolvedFile(filePath);
            return;
        }

        if (!statError && stats.isDirectory()) {
            const indexFilePath = path.join(filePath, 'index.html');

            fs.stat(indexFilePath, (indexError, indexStats) => {
                if (indexError || !indexStats.isFile()) {
                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    response.end('Not found');
                    return;
                }

                streamResolvedFile(indexFilePath);
            });
            return;
        }

        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
    });
};

loadEnv();

const server = http.createServer((request, response) => {
    if (request.url && request.url.startsWith('/api/contact')) {
        loadEnv();
        contactHandler(request, response);
        return;
    }

    if (request.url && request.url.startsWith('/api/account-delete')) {
        loadEnv();
        accountDeleteHandler(request, response);
        return;
    }

    if (request.url && request.url.startsWith('/api/kirby')) {
        loadEnv();
        kirbyHandler(request, response);
        return;
    }

    if (request.url && request.url.startsWith('/api/cv-auth-config')) {
        loadEnv();
        cvAuthConfigHandler(request, response);
        return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD, POST' });
        response.end('Method not allowed');
        return;
    }

    sendStaticFile(request, response);
});

server.listen(port, host, () => {
    console.log(`SA Création Web local server: http://${host}:${port}/`);
});
