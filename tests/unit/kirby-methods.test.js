const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const test = require('node:test');

const handler = require('../../api/kirby.js');

class MockRequest extends EventEmitter {
    constructor(method) {
        super();
        this.method = method;
        this.headers = {};
    }

    destroy() {}
}

class MockResponse extends EventEmitter {
    constructor() {
        super();
        this.headers = {};
        this.statusCode = 0;
        this.body = '';
    }

    setHeader(key, value) {
        this.headers[key] = value;
    }

    end(chunk = '') {
        this.body += chunk;
        this.emit('finish');
    }
}

const callKirby = async (method) => {
    const request = new MockRequest(method);
    const response = new MockResponse();
    const finished = new Promise((resolve) => response.once('finish', resolve));

    await handler(request, response);
    await finished;

    return response;
};

test('kirby answers GET health checks without returning method_not_allowed', async () => {
    const response = await callKirby('GET');

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers.Allow, 'GET, HEAD, POST');
    assert.deepEqual(JSON.parse(response.body), {
        ok: true,
        service: 'kirby',
        message: 'Kirby est disponible. Utilisez POST /api/kirby pour lancer une analyse.',
    });
});

test('kirby answers HEAD health checks without a body', async () => {
    const response = await callKirby('HEAD');

    assert.equal(response.statusCode, 200);
    assert.equal(response.headers.Allow, 'GET, HEAD, POST');
    assert.equal(response.body, '');
});
