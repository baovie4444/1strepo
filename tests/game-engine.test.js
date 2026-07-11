const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createRoomCode,
  isAnswerCorrect,
  isValidAnswerPayload,
  normalizeCode,
  normalizeName,
  scoreAnswer,
  sortLeaderboard
} = require("../src/game-engine");

test("room code is five characters and avoids collisions", () => {
  const existing = new Set();
  for (let i = 0; i < 40; i += 1) {
    const code = createRoomCode(existing);
    assert.match(code, /^[A-HJ-NP-Z2-9]{5}$/);
    assert.equal(existing.has(code), false);
    existing.add(code);
  }
});

test("normalizes user input", () => {
  assert.equal(normalizeCode(" a-19 z "), "A19Z");
  assert.equal(normalizeName("  Nguyễn   <Văn> A  "), "Nguyễn Văn A");
});

test("validates supported answer types", () => {
  assert.equal(isAnswerCorrect({ type: "single", correct: "b" }, "b"), true);
  assert.equal(isAnswerCorrect({ type: "multi", correct: ["a", "c"] }, ["c", "a"]), true);
  assert.equal(isAnswerCorrect({ type: "order", correct: ["a", "b"] }, ["b", "a"]), false);
});

test("rejects malformed or unknown answer values", () => {
  const single = { type: "single", options: [{ id: "a" }, { id: "b" }] };
  const multi = { type: "multi", options: [{ id: "a" }, { id: "b" }] };
  assert.equal(isValidAnswerPayload(single, "a"), true);
  assert.equal(isValidAnswerPayload(single, "z"), false);
  assert.equal(isValidAnswerPayload(multi, ["a", "b"]), true);
  assert.equal(isValidAnswerPayload(multi, ["a", "a"]), false);
});

test("awards more points for a faster correct answer", () => {
  const question = { type: "single", correct: "a" };
  const fast = scoreAnswer({ question, answer: "a", elapsedMs: 1000, durationMs: 20000 });
  const slow = scoreAnswer({ question, answer: "a", elapsedMs: 18000, durationMs: 20000 });
  assert.equal(fast.correct, true);
  assert.ok(fast.points > slow.points);
});

test("leaderboard uses score, correctness, and total time tie breakers", () => {
  const board = sortLeaderboard([
    { id: "a", name: "An", score: 1000, correctCount: 1, totalAnswerMs: 4000, streak: 1, connected: true },
    { id: "b", name: "Bình", score: 1000, correctCount: 2, totalAnswerMs: 8000, streak: 1, connected: true },
    { id: "c", name: "Chi", score: 900, correctCount: 2, totalAnswerMs: 2000, streak: 1, connected: true }
  ]);
  assert.deepEqual(board.map((row) => row.name), ["Bình", "An", "Chi"]);
});
