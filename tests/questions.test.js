const test = require("node:test");
const assert = require("node:assert/strict");

const questions = require("../src/questions");

test("advanced question bank is structurally valid", () => {
  assert.equal(questions.length, 24);
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);

  for (const question of questions) {
    const optionIds = question.options.map((option) => option.id);
    const correctIds = Array.isArray(question.correct) ? question.correct : [question.correct];

    assert.equal(new Set(optionIds).size, optionIds.length, `${question.id} has duplicate option IDs`);
    assert.ok(correctIds.length > 0, `${question.id} has no correct answer`);
    assert.ok(correctIds.every((id) => optionIds.includes(id)), `${question.id} references a missing answer`);
    assert.ok(question.prompt.length >= 40, `${question.id} prompt is not sufficiently specific`);
    assert.ok(question.explanation.length >= 80, `${question.id} explanation is too short`);
    assert.match(question.source, /PDF tr\./, `${question.id} is missing a textbook PDF reference`);
    assert.equal(question.durationMs, question.type === "single" ? 35_000 : 50_000);
  }
});
