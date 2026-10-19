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
