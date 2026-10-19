const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../index');

async function withServer(app, callback) {
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    return await callback(`http://127.0.0.1:${server.address().port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('GET /update-cobj renders the required game form', async () => {
  const app = createApp({ token: 'test-token', objectType: '2-123', client: {} });
  await withServer(app, async (base) => {
    const response = await fetch(`${base}/update-cobj`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /Update Custom Object Form \| Integrating With HubSpot I Practicum/);
    for (const field of ['name', 'genre', 'platform']) {
      assert.match(html, new RegExp(`name="${field}"`));
    }
    assert.match(html, /Return to the homepage/);
    assert.match(html, /href="\/"/);
  });
});

test('POST /update-cobj creates a HubSpot game and redirects home', async () => {
  const calls = [];
  const client = {
    post: async (...args) => {
      calls.push(args);
      return { data: { id: '42' } };
    }
  };
  const app = createApp({ token: 'test-token', objectType: '2-123', client });
  await withServer(app, async (base) => {
    const response = await fetch(`${base}/update-cobj`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name: ' Celeste ', genre: 'Platformer', platform: 'PC' }),
      redirect: 'manual'
    });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), '/');
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'https://api.hubapi.com/crm/v3/objects/2-123');
  assert.deepEqual(calls[0][1], { properties: { name: 'Celeste', genre: 'Platformer', platform: 'PC' } });
  assert.equal(calls[0][2].headers.Authorization, 'Bearer test-token');
});

test('POST /update-cobj rejects blank fields without calling HubSpot', async () => {
  let called = false;
  const app = createApp({
    token: 'test-token', objectType: '2-123',
    client: { post: async () => { called = true; } }
  });
  await withServer(app, async (base) => {
    const response = await fetch(`${base}/update-cobj`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ name: 'Celeste', genre: '', platform: 'PC' })
    });
    assert.equal(response.status, 400);
    assert.match(await response.text(), /All three fields are required/);
  });
  assert.equal(called, false);
});

test('GET / lists all three game properties and links to the form', async () => {
  const calls = [];
  const client = {
    get: async (...args) => {
      calls.push(args);
      return { data: { results: [
        { id: '42', properties: { name: 'Celeste', genre: 'Platformer', platform: 'PC' } }
      ] } };
    }
  };
  const app = createApp({ token: 'test-token', objectType: '2-123', client });
  await withServer(app, async (base) => {
    const response = await fetch(base);
    const html = await response.text();
    assert.equal(response.status, 200);
    for (const text of ['Name', 'Genre', 'Platform', 'Celeste', 'Platformer', 'PC', 'Add to this table']) {
      assert.ok(html.includes(text), `missing ${text}`);
    }
    assert.match(html, /href="\/update-cobj"/);
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'https://api.hubapi.com/crm/v3/objects/2-123');
  assert.equal(calls[0][1].params.properties, 'name,genre,platform');
  assert.equal(calls[0][1].headers.Authorization, 'Bearer test-token');
});
