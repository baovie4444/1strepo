const socket = io({ transports: ["websocket", "polling"] });
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const connectionStatus = document.querySelector("#connection-status");
const canvas = document.querySelector("#atmosphere");
const ctx = canvas.getContext("2d");

window.__gameSocketTest = {
  disconnect: () => socket.disconnect(),
  reconnect: () => socket.connect()
};

const SESSION_KEY = "mat-lenh-session-v1";
let lastRenderIdentity = null;

const state = {
  role: null,
  room: null,
  selection: [],
  isSubmitting: false,
  connected: false,
  canvasTime: 0,
  lastQuestionId: null
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  state.role = null;
  state.room = null;
  state.selection = [];
  state.lastQuestionId = null;
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function emitWithAck(event, payload = {}) {
  return new Promise((resolve) => {
    socket.timeout(7000).emit(event, payload, (error, response) => {
      if (error) resolve({ ok: false, error: "Máy chủ chưa phản hồi. Vui lòng thử lại." });
      else resolve(response || { ok: false, error: "Phản hồi không hợp lệ." });
    });
  });
}

socket.on("connect", async () => {
  state.connected = true;
  updateConnectionStatus();
  const session = getSession();
  if (!session) return;
  const response = await emitWithAck("session:resume", {
    role: session.role,
    code: session.code,
    token: session.token
  });
  if (!response.ok) {
    clearSession();
    render();
    showToast(response.error || "Phiên chơi đã kết thúc.");
  } else {
    state.role = session.role;
  }
});

socket.on("disconnect", () => {
  state.connected = false;
  updateConnectionStatus();
});

socket.on("room:state", (room) => {
  const previousRoom = state.room;
  const nextQuestionId = room.question?.id || null;
  if (nextQuestionId !== state.lastQuestionId) {
    state.selection = [];
    state.lastQuestionId = nextQuestionId;
  }
  if (room.me?.answered && state.selection.length === 0) {
    state.selection = Array.isArray(room.me.answer) ? [...room.me.answer] : room.me.answer ? [room.me.answer] : [];
  }
  state.room = room;
  state.isSubmitting = false;
  const canPatchCurrentQuestion = previousRoom?.status === "question"
    && room.status === "question"
    && previousRoom.question?.id === room.question?.id
    && app.querySelector('[data-testid="game-view"]');
  if (canPatchCurrentQuestion) updateLiveQuestionUI();
  else render();
});

socket.on("session:removed", () => {
  clearSession();
  render();
  showToast("Người tổ chức đã xóa bạn khỏi phòng.");
});

socket.on("session:replaced", () => {
  clearSession();
  render();
  showToast("Phiên chơi đã được mở ở một cửa sổ khác.");
});

function updateConnectionStatus() {
  connectionStatus.classList.toggle("online", state.connected);
  connectionStatus.classList.toggle("offline", !state.connected);
  connectionStatus.innerHTML = `<i></i>${state.connected ? "Đã kết nối" : "Mất kết nối"}`;
}

function commitView(markup, identity) {
  const sameView = identity === lastRenderIdentity;
  const scrollPositions = sameView ? {
    question: app.querySelector(".question-stage")?.scrollTop || 0,
    leaderboard: app.querySelector(".leaderboard")?.scrollTop || 0,
    players: app.querySelector(".player-list")?.scrollTop || 0
  } : null;
  const focusedOptionId = sameView ? document.activeElement?.dataset?.optionId || null : null;

  app.innerHTML = markup;
  lastRenderIdentity = identity;

  if (!sameView) return;
  app.querySelector(".view")?.classList.add("view-stable");
  const questionStage = app.querySelector(".question-stage");
  const leaderboard = app.querySelector(".leaderboard");
  const playerList = app.querySelector(".player-list");
  if (questionStage) questionStage.scrollTop = scrollPositions.question;
  if (leaderboard) leaderboard.scrollTop = scrollPositions.leaderboard;
  if (playerList) playerList.scrollTop = scrollPositions.players;
  if (focusedOptionId) {
    const focusedOption = [...app.querySelectorAll("[data-option-id]")]
      .find((option) => option.dataset.optionId === focusedOptionId);
    focusedOption?.focus({ preventScroll: true });
  }
}

function render() {
  if (!state.room || !state.role) {
    renderHome();
    return;
  }

  if (state.room.status === "finished") {
    renderFinal();
    return;
  }

  if (state.room.status === "lobby") {
    if (state.role === "host") renderHostLobby();
    else renderPlayerLobby();
    return;
  }

  renderGame();
}

function renderHome() {
  commitView(`
    <section class="view home-view" data-testid="home-view">
      <div class="hero-copy">
        <div class="eyebrow">Trò chơi lịch sử thời gian thực</div>
        <h1 class="hero-title">Đọc tình thế.<em>Chọn quyết sách.</em></h1>
        <p class="hero-summary">Cùng khôi phục dòng thời gian, phân tích sự lãnh đạo của Đảng và dùng bằng chứng giáo trình để bảo vệ lập luận.</p>
        <div class="feature-line"><span>24 thử thách</span><span>Chơi cá nhân</span><span>Bảng điểm trực tiếp</span></div>
      </div>
      <div class="entry-panel">
        <h2>Bắt đầu một phiên chơi</h2>
        <p>Một người tạo phòng; những người còn lại nhập mã năm ký tự.</p>

        <form id="create-form" class="form-stack" autocomplete="off">
          <div class="entry-divider"></div>
          <h3 class="entry-section-title">Người tổ chức</h3>
          <div class="form-row">
            <div class="field">
              <label for="host-name">Tên người tổ chức</label>
              <input id="host-name" name="hostName" minlength="2" maxlength="24" placeholder="Ví dụ: Cô Lan" required />
            </div>
            <button class="primary-button" type="submit" data-testid="create-room">Tạo phòng</button>
          </div>
        </form>

        <form id="join-form" class="form-stack" autocomplete="off">
          <div class="entry-divider"></div>
          <h3 class="entry-section-title">Người chơi</h3>
          <div class="join-fields">
            <div class="field">
              <label for="room-code">Mã phòng</label>
              <input id="room-code" class="code-input" name="code" minlength="5" maxlength="5" placeholder="1975A" required />
            </div>
            <div class="field">
              <label for="player-name">Tên hiển thị</label>
              <input id="player-name" name="name" minlength="2" maxlength="24" placeholder="Ví dụ: Minh Anh" required />
            </div>
          </div>
          <button class="secondary-button wide-button" type="submit" data-testid="join-room">Vào phòng</button>
        </form>
      </div>
    </section>`, "home");
}

function renderRoomBanner(title, subtitle) {
  return `
    <div class="room-banner">
      <div>
        <div class="eyebrow">${escapeHtml(subtitle)}</div>
        <h1>${escapeHtml(title)}</h1>
      </div>
      <div class="room-meta">
        <button class="text-button" type="button" data-action="copy-code">Sao chép mã</button>
        <div class="room-code-block"><small>Mã phòng</small><div class="room-code" data-testid="room-code">${escapeHtml(state.room.code)}</div></div>
      </div>
    </div>`;
}

function renderHostLobby() {
  const rows = state.room.players.map((player, index) => `
    <div class="player-row">
      <span class="player-index">${index + 1}</span>
      <span class="player-name">${escapeHtml(player.name)}</span>
      <span class="player-status"><i class="status-dot ${player.connected ? "" : "offline"}"></i>${player.connected ? "Đã vào" : "Mất kết nối"}</span>
      <button class="remove-player" type="button" data-action="remove-player" data-player-id="${escapeHtml(player.id)}" title="Xóa người chơi">Xóa</button>
    </div>`).join("");

  commitView(`
    <section class="view shell-view" data-testid="host-lobby">
      ${renderRoomBanner("Phòng đã sẵn sàng", "Bàn điều phối của người tổ chức")}
      <div class="lobby-layout">
        <div class="workspace">
          <div class="section-heading"><h2>Người chơi</h2><span>${state.room.connectedCount}/${state.room.playerCount} đang kết nối</span></div>
          <div class="player-list">${rows || `<div class="empty-state"><div><strong>Đang chờ người chơi</strong>Chia sẻ mã ${escapeHtml(state.room.code)} để mọi người tham gia.</div></div>`}</div>
        </div>
        <aside class="side-rail">
          <div class="section-heading"><h2>Trận đấu</h2><span>Phiên bản cá nhân</span></div>
          <div class="summary-list">
            <div class="summary-row"><span>Thử thách</span><b>24 câu</b></div>
            <div class="summary-row"><span>Vòng chơi</span><b>5 vòng</b></div>
            <div class="summary-row"><span>Thời lượng</span><b>25-35 phút</b></div>
            <div class="summary-row"><span>Giải thích nguồn</span><b>Bật</b></div>
          </div>
          <p class="side-note">Điểm của câu hiện tại chỉ được cộng sau khi khóa đáp án; bảng xếp hạng không làm lộ kết quả khi người khác còn đang trả lời.</p>
          <button class="primary-button wide-button" type="button" data-action="host-start" data-testid="start-game" ${state.room.connectedCount < 1 ? "disabled" : ""}>Bắt đầu nhiệm vụ</button>
        </aside>
      </div>
    </section>`, "host-lobby");
}

function renderPlayerLobby() {
  commitView(`
    <section class="view waiting-view" data-testid="player-lobby">
      <div class="waiting-panel">
        <div class="eyebrow" style="justify-content:center">Đã vào phòng</div>
        <h1>Chờ người tổ chức bắt đầu</h1>
        <p>Bạn đang tham gia với tên <strong>${escapeHtml(state.room.me?.name)}</strong>. Khi câu hỏi mở, hãy chọn đáp án và gửi trước khi hết giờ.</p>
        <div class="waiting-code">${escapeHtml(state.room.code)}</div>
        <div class="waiting-count">${state.room.playerCount} người chơi đã tham gia</div>
        <p style="font-size:14px">${state.room.hostOnline ? "Người tổ chức đang trực tuyến." : "Người tổ chức mất kết nối; phòng sẽ tiếp tục khi họ quay lại."}</p>
      </div>
    </section>`, "player-lobby");
}

function selectedAnswerIds() {
  if (state.room?.me?.answered && state.room.me.answer) {
    return Array.isArray(state.room.me.answer) ? state.room.me.answer : [state.room.me.answer];
  }
  return state.selection;
}

function isOptionCorrect(id) {
  const correct = state.room?.reveal?.correct;
  if (!correct) return false;
  return (Array.isArray(correct) ? correct : [correct]).includes(id);
}

function renderOptions(interactive) {
  const question = state.room.question;
  const selected = selectedAnswerIds();
  const isReveal = state.room.status === "reveal";
  return question.options.map((option) => {
    const selectedIndex = selected.indexOf(option.id);
    const classes = ["option"];
    if (selectedIndex >= 0) classes.push("selected");
    if (isReveal && question.type === "order") {
      const correctIndex = state.room.reveal.correct.indexOf(option.id);
      const evaluateMyOrder = state.role === "player" && state.room.me?.answered;
      if (!evaluateMyOrder || selectedIndex === correctIndex) classes.push("correct");
      else classes.push("misplaced");
    } else {
      if (isReveal && isOptionCorrect(option.id)) classes.push("correct");
      if (isReveal && !isOptionCorrect(option.id)) classes.push("incorrect");
    }
    let key = option.id;
    if (question.type === "order") {
      const correctOrder = state.room?.reveal?.correct || [];
      key = isReveal ? correctOrder.indexOf(option.id) + 1 : selectedIndex >= 0 ? selectedIndex + 1 : "•";
    }
    return `
      <button class="${classes.join(" ")}" type="button" data-option-id="${escapeHtml(option.id)}" ${interactive && !isReveal ? "" : "disabled"}>
        <span class="option-key">${escapeHtml(key)}</span>
        <span class="option-label">${escapeHtml(option.label)}</span>
      </button>`;
  }).join("");
}

function renderLeaderboard(dark = true) {
  const myId = state.room.me?.id;
  if (!state.room.leaderboard.length) return `<div class="empty-state" style="color:#aaa">Chưa có điểm xếp hạng.</div>`;
  return state.room.leaderboard.map((row) => `
    <div class="leaderboard-row ${row.id === myId ? "me" : ""}">
      <span class="rank">#${row.rank}</span>
      <span class="leaderboard-name">${escapeHtml(row.name)}${row.connected ? "" : " · offline"}</span>
      <span class="leaderboard-score">${row.score.toLocaleString("vi-VN")}${row.lastPoints ? `<small class="point-pop">+${row.lastPoints}</small>` : ""}</span>
    </div>`).join("");
}

function canSubmitAnswer() {
  const question = state.room.question;
  if (!question || state.room.me?.answered || state.isSubmitting) return false;
  if (question.type === "order") return state.selection.length === question.options.length;
  return state.selection.length > 0;
}

function renderQuestionActions() {
  if (state.role === "host") {
    if (state.room.status === "question") return `<button class="primary-button" type="button" data-action="host-reveal" data-testid="reveal-answer">Khóa đáp án</button>`;
    const finalQuestion = state.room.questionIndex + 1 >= state.room.totalQuestions;
    return `<button class="primary-button" type="button" data-action="host-next" data-testid="next-question">${finalQuestion ? "Xem kết quả cuối" : "Câu tiếp theo"}</button>`;
  }

  if (state.room.status === "reveal") return `<span class="selection-hint">Đang chờ người tổ chức chuyển câu.</span>`;
  const answered = Boolean(state.room.me?.answered);
  const questionType = state.room.question.type;
  const hint = questionType === "order"
    ? "Bấm theo đúng thứ tự; bấm lại để bỏ."
    : questionType === "multi"
      ? "Có thể có nhiều đáp án đúng."
      : "Chọn một đáp án.";
  return `
    <span class="action-message ${answered ? "locked-answer" : "selection-hint"}">${answered ? "Đáp án đã được khóa" : hint}</span>
    <div class="answer-controls ${answered ? "is-hidden" : ""}">
      ${questionType === "order" ? `<button class="secondary-button clear-order-button ${state.selection.length ? "" : "is-invisible"}" type="button" data-action="clear-order" tabindex="${state.selection.length ? "0" : "-1"}">Xóa thứ tự</button>` : ""}
      <button class="primary-button" type="button" data-action="submit-answer" data-testid="submit-answer" ${canSubmitAnswer() ? "" : "disabled"}>Gửi đáp án</button>
    </div>`;
}

function updateAnswerSelectionUI() {
  if (!state.room?.question || state.room.status !== "question") return render();
  const type = state.room.question.type;
  for (const option of app.querySelectorAll("[data-option-id]")) {
    const selectedIndex = state.selection.indexOf(option.dataset.optionId);
    option.classList.toggle("selected", selectedIndex >= 0);
    option.disabled = state.role !== "player" || state.room.me?.answered || state.isSubmitting;
    if (type === "order") {
      const key = option.querySelector(".option-key");
      if (key) key.textContent = selectedIndex >= 0 ? String(selectedIndex + 1) : "•";
    }
  }
  const actions = app.querySelector(".answer-actions");
  if (!actions || state.role !== "player") return;

  const answered = Boolean(state.room.me?.answered);
  const message = actions.querySelector(".action-message");
  const controls = actions.querySelector(".answer-controls");
  const clearOrderButton = actions.querySelector(".clear-order-button");
  const submitButton = actions.querySelector('[data-action="submit-answer"]');

  if (message) {
    message.classList.toggle("selection-hint", !answered);
    message.classList.toggle("locked-answer", answered);
    if (answered) message.textContent = "Đáp án đã được khóa";
  }
  controls?.classList.toggle("is-hidden", answered);
  if (clearOrderButton) {
    const showClear = !answered && state.selection.length > 0;
    clearOrderButton.classList.toggle("is-invisible", !showClear);
    clearOrderButton.tabIndex = showClear ? 0 : -1;
  }
  if (submitButton) submitButton.disabled = !canSubmitAnswer();
}

function updateLiveQuestionUI() {
  if (!state.room?.question || state.room.status !== "question") return render();
  const progress = state.room.playerCount
    ? Math.round((state.room.answeredCount / state.room.playerCount) * 100)
    : 0;
  const progressNumber = app.querySelector(".answer-progress strong");
  const progressBar = app.querySelector(".progress-track i");
  const leaderboard = app.querySelector(".leaderboard");
  if (progressNumber) {
    progressNumber.innerHTML = `${state.room.answeredCount}<small style="font-size:20px;color:#aaa">/${state.room.playerCount}</small>`;
  }
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (leaderboard) leaderboard.innerHTML = renderLeaderboard();
  updateAnswerSelectionUI();
  updateTimer();
}

function renderReveal() {
  if (state.room.status !== "reveal" || !state.room.reveal) return "";
  const result = state.room.me?.lastResult;
  return `
    ${result ? `<div class="result-badge ${result.correct ? "" : "wrong"}">${result.correct ? "Chính xác" : "Chưa chính xác"} · +${result.points.toLocaleString("vi-VN")} điểm</div>` : ""}
    <div class="reveal-box">
      <div class="verdict">Đáp án</div>
      <h3>${escapeHtml(state.room.reveal.answerLabel)}</h3>
      <p>${escapeHtml(state.room.reveal.explanation)}</p>
      <p class="source-line">${escapeHtml(state.room.reveal.source)}</p>
    </div>`;
}

function renderGame() {
  const room = state.room;
  const question = room.question;
  const interactive = state.role === "player" && room.status === "question" && !room.me?.answered;
  const progress = room.playerCount ? Math.round((room.answeredCount / room.playerCount) * 100) : 0;

  commitView(`
    <section class="view shell-view" data-testid="game-view">
      ${renderRoomBanner(question.roundTitle, `Vòng ${question.round} · Câu ${question.index}/${question.total}`)}
      <div class="game-layout">
        <div class="question-stage ${room.status === "reveal" ? "reveal-mode" : ""}">
          <div class="question-topline"><span class="round-label">${escapeHtml(question.type === "single" ? "Chọn một đáp án" : question.type === "multi" ? "Chọn nhiều đáp án" : "Sắp xếp trình tự")}</span><span class="question-count">${room.status === "reveal" ? "Đã khóa đáp án" : "Đang nhận đáp án"}</span></div>
          <h2 class="question-prompt">${escapeHtml(question.prompt)}</h2>
          ${question.context ? `<p class="question-context">${escapeHtml(question.context)}</p>` : ""}
          ${room.status === "question" ? `<div class="timer-wrap"><div class="timer-line"><div id="timer-bar" class="timer-bar"></div></div><div id="timer-text" class="timer-text">--</div></div>` : ""}
          <div class="option-grid ${question.options.length > 4 ? "dense" : ""}">${renderOptions(interactive)}</div>
          ${renderReveal()}
          <div class="answer-actions">${renderQuestionActions()}</div>
        </div>
        <aside class="live-rail">
          <h2>${room.status === "question" ? "Tiến độ trực tiếp" : "Bảng xếp hạng"}</h2>
          <div class="answer-progress"><strong>${room.answeredCount}<small style="font-size:20px;color:#aaa">/${room.playerCount}</small></strong><span>người đã gửi đáp án</span><div class="progress-track"><i style="width:${progress}%"></i></div></div>
          <div class="rail-divider"></div>
          <div class="leaderboard">${renderLeaderboard()}</div>
        </aside>
      </div>
    </section>`, `game:${question.id}`);
  updateTimer();
}

function renderFinal() {
  const board = state.room.leaderboard;
  const top = [board[1], board[0], board[2]];
  commitView(`
    <section class="view shell-view" data-testid="final-view">
      ${renderRoomBanner("Nhiệm vụ hoàn tất", "Kết quả chung cuộc")}
      <div class="final-layout">
        <div class="final-panel">
          <div class="eyebrow">Tổng kết</div>
          <h1>Thắng lợi đến từ một quá trình lãnh đạo liên tục</h1>
          <div class="podium">
            ${top.map((row, index) => row ? `<div class="podium-place ${index === 1 ? "first" : ""}"><span class="medal">#${row.rank}</span><b>${escapeHtml(row.name)}</b><span>${row.score.toLocaleString("vi-VN")} điểm</span></div>` : `<div></div>`).join("")}
          </div>
          <p class="final-message">Mục tiêu nhất quán, sức mạnh toàn dân, sự phối hợp giữa hai miền, kết hợp quân sự - chính trị - ngoại giao, khả năng tự điều chỉnh và nghệ thuật nắm thời cơ là những trục nội dung xuyên suốt trận đấu.</p>
        </div>
        <aside class="side-rail" style="overflow:auto">
          <div class="section-heading"><h2>Xếp hạng đầy đủ</h2><span>${board.length} người</span></div>
          <div class="leaderboard" style="color:var(--ink)">${renderLeaderboard(false)}</div>
          <button class="primary-button wide-button" style="margin-top:22px" type="button" data-action="new-session">${state.role === "host" ? "Tạo phòng mới" : "Rời phòng"}</button>
        </aside>
      </div>
    </section>`, "final");
}

app.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === "create-form") {
    const hostName = new FormData(form).get("hostName");
    const response = await emitWithAck("host:create", { hostName });
    if (!response.ok) return showToast(response.error);
    state.role = "host";
    saveSession({ role: "host", code: response.code, token: response.hostToken });
    showToast(`Đã tạo phòng ${response.code}`);
  }
  if (form.id === "join-form") {
    const data = new FormData(form);
    const response = await emitWithAck("player:join", { code: data.get("code"), name: data.get("name") });
    if (!response.ok) return showToast(response.error);
    state.role = "player";
    saveSession({ role: "player", code: response.code, token: response.playerToken });
  }
});

app.addEventListener("click", async (event) => {
  const option = event.target.closest("[data-option-id]");
  if (option && state.role === "player" && state.room?.status === "question" && !state.room.me?.answered) {
    const id = option.dataset.optionId;
    const type = state.room.question.type;
    if (type === "single") state.selection = [id];
    else if (type === "multi") state.selection = state.selection.includes(id) ? state.selection.filter((value) => value !== id) : [...state.selection, id];
    else if (type === "order") state.selection = state.selection.includes(id) ? state.selection.filter((value) => value !== id) : [...state.selection, id];
    updateAnswerSelectionUI();
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === "fullscreen") return toggleFullscreen();
  if (action === "home") {
    if (state.room && !confirm("Rời phiên chơi hiện tại?")) return;
    clearSession();
    location.reload();
  }
  if (action === "copy-code") {
    try { await navigator.clipboard.writeText(state.room.code); showToast("Đã sao chép mã phòng."); }
    catch { showToast(`Mã phòng: ${state.room.code}`); }
  }
  if (action === "host-start") handleHostAction("host:start");
  if (action === "host-reveal") handleHostAction("host:reveal");
  if (action === "host-next") handleHostAction("host:next");
  if (action === "remove-player") {
    const response = await emitWithAck("host:remove-player", { playerId: actionTarget.dataset.playerId });
    if (!response.ok) showToast(response.error);
  }
  if (action === "clear-order") { state.selection = []; updateAnswerSelectionUI(); }
  if (action === "submit-answer") submitAnswer();
  if (action === "new-session") { clearSession(); location.reload(); }
});

async function handleHostAction(event) {
  const response = await emitWithAck(event);
  if (!response.ok) showToast(response.error);
}

async function submitAnswer() {
  if (!canSubmitAnswer()) return;
  const question = state.room.question;
  const answer = question.type === "single" ? state.selection[0] : [...state.selection];
  state.isSubmitting = true;
  updateAnswerSelectionUI();
  const response = await emitWithAck("player:answer", { answer });
  if (!response.ok) {
    state.isSubmitting = false;
    updateAnswerSelectionUI();
    showToast(response.error);
  }
}

function updateTimer() {
  const bar = document.querySelector("#timer-bar");
  const text = document.querySelector("#timer-text");
  if (!bar || !text || !state.room?.endsAt || !state.room.question) return;
  const remaining = Math.max(0, state.room.endsAt - Date.now());
  const ratio = Math.max(0, Math.min(1, remaining / state.room.question.durationMs));
  bar.style.transform = `scaleX(${ratio})`;
  text.textContent = `${Math.ceil(remaining / 1000)} giây`;
}

setInterval(updateTimer, 100);

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

document.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  if (event.key.toLowerCase() === "f" && tag !== "INPUT" && tag !== "TEXTAREA") toggleFullscreen();
});

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * dpr);
  canvas.height = Math.round(innerHeight * dpr);
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawAtmosphere();
}

function drawAtmosphere() {
  const width = innerWidth;
  const height = innerHeight;
  ctx.clearRect(0, 0, width, height);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8f3ea");
  gradient.addColorStop(.64, "#eee4d7");
  gradient.addColorStop(1, "#ddcfc0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(76,61,47,.055)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 46) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 46) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }

  const pulse = (Math.sin(state.canvasTime / 900) + 1) / 2;
  ctx.save();
  ctx.translate(width * .84, height * .54);
  ctx.rotate(-.13);
  ctx.strokeStyle = "rgba(160,31,43,.20)";
  ctx.lineWidth = 120;
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(width, height) * .48, -1.5, 1.5);
  ctx.stroke();
  ctx.strokeStyle = "rgba(214,168,63,.70)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.bezierCurveTo(-130, -330, -250, -80, -160, 250);
  ctx.stroke();
  for (const [x, y] of [[-128,-262],[-204,-60],[-162,185]]) {
    ctx.fillStyle = "#a01f2b";
    ctx.beginPath(); ctx.arc(x, y, 7 + pulse * 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#d6a83f"; ctx.lineWidth = 3; ctx.stroke();
  }
  ctx.restore();
}

function animateCanvas(time) {
  state.canvasTime = time;
  drawAtmosphere();
  requestAnimationFrame(animateCanvas);
}

window.advanceTime = (ms) => {
  state.canvasTime += Number(ms) || 0;
  drawAtmosphere();
};

window.render_game_to_text = () => JSON.stringify({
  coordinateSystem: "DOM interface; origin is top-left, x right, y down",
  view: !state.room ? "home" : state.room.status,
  role: state.role,
  connected: state.connected,
  roomCode: state.room?.code || null,
  hostOnline: state.room?.hostOnline ?? null,
  players: state.room?.playerCount ?? 0,
  answered: state.room?.answeredCount ?? 0,
  question: state.room?.question ? {
    id: state.room.question.id,
    index: state.room.question.index,
    total: state.room.question.total,
    type: state.room.question.type,
    prompt: state.room.question.prompt,
    options: state.room.question.options.map((option) => ({ id: option.id, label: option.label })),
    remainingMs: state.room.endsAt ? Math.max(0, state.room.endsAt - Date.now()) : null
  } : null,
  selectedAnswer: [...state.selection],
  me: state.room?.me ? { name: state.room.me.name, score: state.room.me.score, answered: state.room.me.answered } : null,
  leaderboard: state.room?.leaderboard?.slice(0, 8) || [],
  controls: state.role === "host" ? ["start", "reveal", "next", "remove player", "F fullscreen"] : ["select option", "submit answer", "F fullscreen"]
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(animateCanvas);
updateConnectionStatus();
render();

