const http = require('http');
const fs = require('fs');
const net = require('net');
const path = require('path');
const contactHandler = require('./api/contact');
const accountDeleteHandler = require('./api/account-delete');
const cvAuthConfigHandler = require('./api/cv-auth-config');
const kirbyHandler = require('./api/kirby');
const kirbySiteHandler = require('./api/kirby-site');
const kirbyCvHandler = require('./api/kirby-cv');
const flyersHandler = require('./api/flyers');
const authObservabilityHandler = require('./api/auth-observability');

const root = __dirname;
let port = 8000;
let host = '127.0.0.1';

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

const canListenOnPort = (candidatePort, bindHost) => new Promise((resolve) => {
    const tester = net.createServer();

    tester.once('error', () => {
        resolve(false);
    });

    tester.once('listening', () => {
        tester.close(() => resolve(true));
    });

    tester.listen(candidatePort, bindHost);
});

const findAvailablePort = async (startPort, bindHost, maxAttempts) => {
    for (let attempt = 0; attempt <= maxAttempts; attempt += 1) {
        const candidatePort = startPort + attempt;
        const isAvailable = await canListenOnPort(candidatePort, bindHost);

        if (isAvailable) {
            return candidatePort;
        }
    }

    throw new Error(`No free port found between ${startPort} and ${startPort + maxAttempts}.`);
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
            'Cache-Control': 'no-store',
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

host = process.env.SITE_JOURNEY_PROTOTYPE === '1' ? '127.0.0.1' : (process.env.HOST || '127.0.0.1');
{
    const parsedPort = Number.parseInt(process.env.PORT || '8000', 10);
    port = Number.isNaN(parsedPort) ? 8000 : parsedPort;
}

const server = http.createServer((request, response) => {
    const requestPathname = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`).pathname;

    if (process.env.SITE_JOURNEY_PROTOTYPE === '1' && ['/api/site-selection', '/api/contact'].includes(requestPathname)) {
        require('./lib/site-journey-local')(request, response);
        return;
    }

    if (requestPathname === '/api/site-selection') {
        require('./api/site-selection')(request, response);
        return;
    }

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

    if (requestPathname === '/api/kirby-cv' || requestPathname === '/api/kirby-cv/') {
        loadEnv();
        kirbyCvHandler(request, response);
        return;
    }

    if (requestPathname === '/api/flyers' || requestPathname === '/api/flyers/') {
        loadEnv();
        flyersHandler(request, response);
        return;
    }

    if (requestPathname === '/api/kirby-site' || requestPathname === '/api/kirby-site/') {
        loadEnv();
        kirbySiteHandler(request, response);
        return;
    }

    if (requestPathname === '/api/kirby' || requestPathname === '/api/kirby/') {
        loadEnv();
        kirbyHandler(request, response);
        return;
    }

    if (request.url && request.url.startsWith('/api/auth-observability')) {
        authObservabilityHandler(request, response);
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

server.on('error', (error) => {
    if (error && error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Set another port with PORT=8001 npm run dev.`);
        process.exit(1);
        return;
    }

    console.error(error);
    process.exit(1);
});

const startServer = async () => {
    const hasExplicitPort = typeof process.env.PORT === 'string' && process.env.PORT.trim().length > 0 && !Number.isNaN(Number.parseInt(process.env.PORT, 10));

    if (!hasExplicitPort) {
        const parsedScanLimit = Number.parseInt(process.env.PORT_SCAN_LIMIT || '20', 10);
        const portScanLimit = Number.isNaN(parsedScanLimit) ? 20 : Math.max(parsedScanLimit, 0);
        const preferredPort = port;

        try {
            const availablePort = await findAvailablePort(preferredPort, host, portScanLimit);

            if (availablePort !== preferredPort) {
                console.warn(`Port ${preferredPort} is busy, using ${availablePort} instead.`);
            }

            port = availablePort;
        } catch (error) {
            console.error(error.message);
            process.exit(1);
            return;
        }
    }

    server.listen(port, host, () => {
        console.log(`SA Création Web local server: http://${host}:${port}/`);
    });
};

startServer();
