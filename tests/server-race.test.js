const test = require('node:test');
const assert = require('node:assert/strict');
const { io: createClient } = require('socket.io-client');

const { server, rooms } = require('../server');

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = createClient(url, { transports: ['websocket'], forceNew: true });
    socket.once('connect', () => resolve(socket));
    socket.once('connect_error', reject);
  });
}

function emitAck(socket, event, payload = {}) {
  return new Promise((resolve) => socket.emit(event, payload, resolve));
}

test('a delayed auto-reveal from the previous question cannot lock the next question', async (t) => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}`;
  const host = await connect(url);
  const player = await connect(url);
  let replacement = null;

  t.after(async () => {
    host.disconnect();
    player.disconnect();
    replacement?.disconnect();
    for (const room of rooms.values()) {
      if (room.timer) clearTimeout(room.timer);
      if (room.revealTimer) clearTimeout(room.revealTimer);
    }
    rooms.clear();
    await new Promise((resolve) => server.close(resolve));
  });

  const created = await emitAck(host, 'host:create', { hostName: 'Cô Lan' });
  assert.equal(created.ok, true);
  const joined = await emitAck(player, 'player:join', { code: created.code, name: 'Minh Anh' });
  assert.equal(joined.ok, true);
  assert.equal((await emitAck(host, 'host:start')).ok, true);
  assert.equal((await emitAck(player, 'player:answer', { answer: 'B' })).ok, true);

  assert.equal((await emitAck(host, 'host:reveal')).ok, true);
  assert.equal((await emitAck(host, 'host:next')).ok, true);

  await new Promise((resolve) => setTimeout(resolve, 650));
  const room = rooms.get(created.code);
  assert.equal(room.questionIndex, 1);
  assert.equal(room.status, 'question');

  replacement = await connect(url);
  const replacedEvent = new Promise((resolve) => player.once('session:replaced', resolve));
  const resumed = await emitAck(replacement, 'session:resume', {
    code: created.code,
    role: 'player',
    token: joined.playerToken,
  });
  assert.equal(resumed.ok, true);
  await replacedEvent;

  const oldAnswer = await emitAck(player, 'player:answer', { answer: 'C' });
  assert.equal(oldAnswer.ok, false);
  const currentAnswer = await emitAck(replacement, 'player:answer', { answer: 'C' });
  assert.equal(currentAnswer.ok, true);
});
