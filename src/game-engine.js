const crypto = require("node:crypto");

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createRoomCode(existingCodes = new Set(), length = 5) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let code = "";
    for (let i = 0; i < length; i += 1) {
      code += ROOM_ALPHABET[crypto.randomInt(0, ROOM_ALPHABET.length)];
    }
    if (!existingCodes.has(code)) return code;
  }
  throw new Error("Không thể tạo mã phòng duy nhất.");
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 24);
}

function isValidAnswerPayload(question, answer) {
  if (!question) return false;
  const allowed = new Set(question.options.map((option) => String(option.id)));
  if (question.type === "single") return typeof answer === "string" && allowed.has(answer);
  if (question.type === "multi" || question.type === "order") {
    if (!Array.isArray(answer) || answer.length < 1 || answer.length > allowed.size) return false;
    const values = answer.map(String);
    return new Set(values).size === values.length && values.every((value) => allowed.has(value));
  }
  return false;
}

function normalizeCode(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5);
}

function arraysEqualAsSets(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const left = [...a].map(String).sort();
  const right = [...b].map(String).sort();
  return left.every((value, index) => value === right[index]);
}

function isAnswerCorrect(question, answer) {
  if (!question) return false;
  if (question.type === "single") return String(answer) === String(question.correct);
  if (question.type === "multi") return arraysEqualAsSets(answer, question.correct);
  if (question.type === "order") {
    if (!Array.isArray(answer) || answer.length !== question.correct.length) return false;
    return question.correct.every((value, index) => String(value) === String(answer[index]));
  }
  return false;
}

function scoreAnswer({ question, answer, elapsedMs, durationMs, currentStreak = 0 }) {
  const correct = isAnswerCorrect(question, answer);
  if (!correct) return { correct: false, points: 0, streak: 0 };

  const safeDuration = Math.max(1, durationMs);
  const remainingRatio = Math.max(0, Math.min(1, 1 - elapsedMs / safeDuration));
  const base = question.type === "single" ? 700 : 850;
  const speed = Math.round(300 * remainingRatio);
  const streak = currentStreak + 1;
  const streakBonus = Math.min(150, Math.max(0, streak - 1) * 40);

  return { correct: true, points: base + speed + streakBonus, streak };
}

function sortLeaderboard(players) {
  return [...players]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
      if (a.totalAnswerMs !== b.totalAnswerMs) return a.totalAnswerMs - b.totalAnswerMs;
      return a.name.localeCompare(b.name, "vi");
    })
    .map((player, index) => ({
      rank: index + 1,
      id: player.id,
      name: player.name,
      score: player.score,
      streak: player.streak,
      correctCount: player.correctCount,
      connected: player.connected,
      lastPoints: player.lastPoints || 0
    }));
}

function publicQuestion(question, index, total) {
  if (!question) return null;
  return {
    id: question.id,
    round: question.round,
    roundTitle: question.roundTitle,
    index,
    total,
    type: question.type,
    prompt: question.prompt,
    context: question.context || "",
    options: question.options,
    durationMs: question.durationMs
  };
}

module.exports = {
  createRoomCode,
  isAnswerCorrect,
  isValidAnswerPayload,
  normalizeCode,
  normalizeName,
  publicQuestion,
  scoreAnswer,
  sortLeaderboard
};
