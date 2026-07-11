import { chromium } from 'playwright';
import fs from 'node:fs';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
context.setDefaultTimeout(10_000);
const host = await context.newPage();

try {
  await host.goto('http://localhost:3000');
  await host.locator('#host-name').fill('Cô Lan QA');
  await host.getByTestId('create-room').click();
  const code = (await host.getByTestId('room-code').textContent()).trim();

  const joinPlayer = async (name) => {
    const page = await context.newPage();
    await page.goto('http://localhost:3000');
    await page.locator('#room-code').fill(code);
    await page.locator('#player-name').fill(name);
    await page.getByTestId('join-room').click();
    await page.getByTestId('player-lobby').waitFor();
    return page;
  };

  const playerOne = await joinPlayer('Minh Anh QA');
  const playerTwo = await joinPlayer('Hoàng QA');
  await host.getByTestId('start-game').click();

  for (let index = 0; index < 3; index += 1) {
    await host.getByTestId('reveal-answer').click();
    await host.getByTestId('next-question').click();
  }

  const clickOption = async (page, label) => {
    await page.locator('button.option').filter({ hasText: label }).click();
  };

  const correctOrder = [
    'Chiến thắng Núi Thành',
    'Chiến thắng Vạn Tường',
    'Chiến thắng Plâyme',
    'Trung ương 13 mở mặt trận ngoại giao',
    'Tổng tiến công và nổi dậy Tết Mậu Thân',
  ];
  await playerOne.waitForTimeout(500);
  await playerOne.evaluate(() => {
    window.__qaStableGameView = document.querySelector('[data-testid="game-view"]');
  });
  for (const label of correctOrder) await clickOption(playerOne, label);
  const selectionStability = await playerOne.evaluate(() => ({
    sameNode: window.__qaStableGameView === document.querySelector('[data-testid="game-view"]'),
    viewAnimations: document.querySelector('.view')?.getAnimations()
      .filter((animation) => animation.playState === 'running').length || 0,
  }));
  if (!selectionStability.sameNode || selectionStability.viewAnimations !== 0) {
    throw new Error('Selecting answers recreated or reanimated the entire game view.');
  }
  await playerOne.screenshot({ path: 'output/web-game/qa-order-selection.png' });
  await playerOne.getByTestId('submit-answer').click();
  await playerOne.getByText('Đáp án đã được khóa', { exact: true }).waitFor();
  const submitStability = await playerOne.evaluate(() => ({
    stableClass: document.querySelector('.view')?.classList.contains('view-stable') || false,
    viewAnimations: document.querySelector('.view')?.getAnimations()
      .filter((animation) => animation.playState === 'running').length || 0,
  }));
  if (!submitStability.stableClass || submitStability.viewAnimations !== 0) {
    throw new Error('Submitting an answer reanimated the entire game view.');
  }

  const wrongOrder = [correctOrder[1], correctOrder[0], ...correctOrder.slice(2)];
  for (const label of wrongOrder) await clickOption(playerTwo, label);
  await playerTwo.getByTestId('submit-answer').click();
  await host.getByTestId('next-question').waitFor();
  await host.screenshot({ path: 'output/web-game/qa-order-reveal-host.png' });
  await playerTwo.screenshot({ path: 'output/web-game/qa-order-wrong-reveal-player.png' });

  const beforeReload = JSON.parse(await playerOne.evaluate(() => window.render_game_to_text()));
  await Promise.all([host, playerOne, playerTwo].map((page) => page.evaluate(() => window.__gameSocketTest.disconnect())));
  await Promise.all([host, playerOne, playerTwo].map((page) => page.waitForFunction(
    () => JSON.parse(window.render_game_to_text()).connected === false,
  )));
  await Promise.all([host, playerOne, playerTwo].map((page) => page.evaluate(() => window.__gameSocketTest.reconnect())));
  await Promise.all([
    host.waitForFunction(() => {
      const game = JSON.parse(window.render_game_to_text());
      return game.connected && game.role === 'host' && game.hostOnline;
    }),
    playerOne.waitForFunction(() => {
      const game = JSON.parse(window.render_game_to_text());
      return game.connected && game.role === 'player' && game.hostOnline;
    }),
    playerTwo.waitForFunction(() => JSON.parse(window.render_game_to_text()).connected === true),
  ]);
  const afterNetworkReconnect = JSON.parse(await playerOne.evaluate(() => window.render_game_to_text()));
  if (afterNetworkReconnect.me.score !== beforeReload.me.score) {
    throw new Error('Network reconnect did not preserve the player score.');
  }

  await playerOne.reload();
  await playerOne.getByTestId('game-view').waitFor();
  const afterReload = JSON.parse(await playerOne.evaluate(() => window.render_game_to_text()));
  if (afterReload.me.score !== beforeReload.me.score || afterReload.me.score <= 0) {
    throw new Error('Reconnect did not preserve the player score.');
  }

  await host.getByTestId('next-question').click();
  for (const label of [
    'Làm phá sản chiến lược',
    'Đánh mạnh vào ý chí xâm lược',
    'Buộc Mỹ chấp nhận đàm phán',
  ]) await clickOption(playerOne, label);
  await playerOne.screenshot({ path: 'output/web-game/qa-multi-selection.png' });
  await playerOne.getByTestId('submit-answer').click();

  for (const label of ['Làm phá sản chiến lược', 'Buộc Mỹ chấp nhận đàm phán']) {
    await clickOption(playerTwo, label);
  }
  await playerTwo.getByTestId('submit-answer').click();
  await host.getByTestId('next-question').waitFor();
  await playerOne.screenshot({ path: 'output/web-game/qa-multi-reveal-player.png' });

  const finalState = JSON.parse(await playerOne.evaluate(() => window.render_game_to_text()));
  if (finalState.view !== 'reveal' || finalState.leaderboard[0].name !== 'Minh Anh QA') {
    throw new Error('Realtime leaderboard did not converge after multi-answer scoring.');
  }

  const result = {
    roomCode: code,
    networkReconnectScore: afterNetworkReconnect.me.score,
    reconnectScore: afterReload.me.score,
    finalScore: finalState.me.score,
    leaderboard: finalState.leaderboard,
  };
  fs.writeFileSync('output/web-game/qa-e2e-result.json', JSON.stringify(result, null, 2));
  process.stdout.write(`${JSON.stringify(result)}\n`);
} finally {
  await browser.close();
}
