const path = require("node:path");
const crypto = require("node:crypto");
const express = require("express");
const http = require("node:http");
const { Server } = require("socket.io");

const questions = require("./src/questions");
const {
  createRoomCode,
  isValidAnswerPayload,
  normalizeCode,
  normalizeName,
  publicQuestion,
  scoreAnswer,
  sortLeaderboard
} = require("./src/game-engine");

const PORT = Number(process.env.PORT || 3000);
const ROOM_TTL_MS = 4 * 60 * 60 * 1000;
const REVEAL_DELAY_MS = 450;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: false },
  maxHttpBufferSize: 100_000,
  pingTimeout: 20_000,
  pingInterval: 15_000
});

const rooms = new Map();

app.disable("x-powered-by");
app.get("/health", (_req, res) => {
  res.json({ ok: true, rooms: rooms.size, questions: questions.length });
});
app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));

function newPlayer(name, socket) {
  return {
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    name,
    socketId: socket.id,
    connected: true,
    score: 0,
    streak: 0,
    correctCount: 0,
    totalAnswerMs: 0,
    answered: false,
    answer: null,
    pendingResult: null,
    lastPoints: 0
  };
}

function connectedPlayers(room) {
  return [...room.players.values()].filter((player) => player.connected);
}

function findPlayerByToken(room, token) {
  return [...room.players.values()].find((player) => player.token === token);
}

function currentQuestion(room) {
  return questions[room.questionIndex] || null;
}

function roomState(room, viewer = null) {
  const question = currentQuestion(room);
  const reveal = room.status === "reveal" || room.status === "finished";
  const players = [...room.players.values()];

  return {
    code: room.code,
    hostName: room.hostName,
    hostOnline: Boolean(room.hostSocketId),
    status: room.status,
    questionIndex: room.questionIndex,
    totalQuestions: questions.length,
    answeredCount: players.filter((player) => player.answered).length,
    playerCount: players.length,
    connectedCount: connectedPlayers(room).length,
    endsAt: room.endsAt || null,
    question: publicQuestion(question, room.questionIndex + 1, questions.length),
    reveal: reveal && question ? {
      correct: question.correct,
      explanation: question.explanation,
      source: question.source,
      answerLabel: question.answerLabel || ""
    } : null,
    players: players.map((player) => ({
      id: player.id,
      name: player.name,
      connected: player.connected,
      answered: player.answered
    })),
    leaderboard: sortLeaderboard(players),
    me: viewer ? {
      id: viewer.id,
      name: viewer.name,
      score: viewer.score,
      streak: viewer.streak,
      answered: viewer.answered,
      answer: viewer.answer,
      lastResult: reveal && viewer.pendingResult ? {
        correct: viewer.pendingResult.correct,
        points: viewer.lastPoints
      } : null
    } : null
  };
}

function emitRoom(room) {
  if (room.hostSocketId) {
    io.to(room.hostSocketId).emit("room:state", roomState(room));
  }
  for (const player of room.players.values()) {
    if (player.socketId && player.connected) {
      io.to(player.socketId).emit("room:state", roomState(room, player));
    }
  }
}

function hostOwnsRoom(socket, room) {
  return room && room.hostSocketId === socket.id && socket.data.hostToken === room.hostToken;
}

function resetQuestionPlayers(room) {
  for (const player of room.players.values()) {
    player.answered = false;
    player.answer = null;
    player.pendingResult = null;
    player.lastPoints = 0;
  }
}

function beginQuestion(room, index) {
  const question = questions[index];
  if (!question) return finishGame(room);

  if (room.timer) clearTimeout(room.timer);
  if (room.revealTimer) clearTimeout(room.revealTimer);
  room.status = "question";
  room.questionIndex = index;
  room.questionInstanceId = crypto.randomUUID();
  room.startedAt = Date.now();
  room.endsAt = room.startedAt + question.durationMs;
  room.updatedAt = Date.now();
  resetQuestionPlayers(room);
  const expectedInstanceId = room.questionInstanceId;
  room.timer = setTimeout(() => revealQuestion(room, expectedInstanceId), question.durationMs + 80);
  emitRoom(room);
}

function revealQuestion(room, expectedInstanceId = null) {
  if (!room || room.status !== "question") return;
  if (expectedInstanceId && room.questionInstanceId !== expectedInstanceId) return;
  if (room.timer) clearTimeout(room.timer);
  if (room.revealTimer) clearTimeout(room.revealTimer);
  room.timer = null;
  room.revealTimer = null;
  room.status = "reveal";
  room.endsAt = null;
  room.updatedAt = Date.now();

  for (const player of room.players.values()) {
    const result = player.pendingResult || { correct: false, points: 0, streak: 0 };
    player.pendingResult = result;
    player.lastPoints = result.points;
    player.score += result.points;
    player.streak = result.streak;
    if (result.correct) player.correctCount += 1;
  }
  emitRoom(room);
}

function finishGame(room) {
  if (room.timer) clearTimeout(room.timer);
  if (room.revealTimer) clearTimeout(room.revealTimer);
  room.timer = null;
  room.revealTimer = null;
  room.status = "finished";
  room.endsAt = null;
  room.updatedAt = Date.now();
  emitRoom(room);
}

function allConnectedAnswered(room) {
  const active = connectedPlayers(room);
  return active.length > 0 && active.every((player) => player.answered);
}

io.on("connection", (socket) => {
  socket.on("host:create", (payload = {}, ack = () => {}) => {
    const hostName = normalizeName(payload.hostName);
    if (hostName.length < 2) return ack({ ok: false, error: "Tên người tổ chức cần ít nhất 2 ký tự." });

    const code = createRoomCode(new Set(rooms.keys()));
    const hostToken = crypto.randomUUID();
    const room = {
      code,
      hostName,
      hostToken,
      hostSocketId: socket.id,
      status: "lobby",
      questionIndex: -1,
      startedAt: null,
      endsAt: null,
      timer: null,
      revealTimer: null,
      questionInstanceId: null,
      players: new Map(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    rooms.set(code, room);
    socket.join(code);
    socket.data.role = "host";
    socket.data.roomCode = code;
    socket.data.hostToken = hostToken;
    ack({ ok: true, code, hostToken });
    emitRoom(room);
  });

  socket.on("player:join", (payload = {}, ack = () => {}) => {
    const code = normalizeCode(payload.code);
    const name = normalizeName(payload.name);
    const room = rooms.get(code);

    if (!room) return ack({ ok: false, error: "Không tìm thấy phòng với mã này." });
    if (room.status !== "lobby") return ack({ ok: false, error: "Trận đấu đã bắt đầu. Chỉ có thể kết nối lại bằng phiên cũ." });
    if (name.length < 2) return ack({ ok: false, error: "Tên người chơi cần ít nhất 2 ký tự." });
    if (room.players.size >= 60) return ack({ ok: false, error: "Phòng đã đủ 60 người chơi." });
    if ([...room.players.values()].some((player) => player.name.toLocaleLowerCase("vi") === name.toLocaleLowerCase("vi"))) {
      return ack({ ok: false, error: "Tên này đã được sử dụng trong phòng." });
    }

    const player = newPlayer(name, socket);
    room.players.set(player.id, player);
    room.updatedAt = Date.now();
    socket.join(code);
    socket.data.role = "player";
    socket.data.roomCode = code;
    socket.data.playerId = player.id;
    socket.data.playerToken = player.token;
    ack({ ok: true, code, playerId: player.id, playerToken: player.token });
    emitRoom(room);
  });

  socket.on("session:resume", (payload = {}, ack = () => {}) => {
    const code = normalizeCode(payload.code);
    const room = rooms.get(code);
    if (!room) return ack({ ok: false, error: "Phiên chơi không còn tồn tại." });

    if (payload.role === "host" && payload.token === room.hostToken) {
      room.hostSocketId = socket.id;
      room.updatedAt = Date.now();
      socket.join(code);
      socket.data.role = "host";
      socket.data.roomCode = code;
      socket.data.hostToken = room.hostToken;
      ack({ ok: true, role: "host" });
      emitRoom(room);
      return;
    }

    if (payload.role === "player") {
      const player = findPlayerByToken(room, payload.token);
      if (player) {
        const previousSocketId = player.socketId;
        if (previousSocketId && previousSocketId !== socket.id) {
          io.to(previousSocketId).emit("session:replaced");
          const previousSocket = io.sockets.sockets.get(previousSocketId);
          if (previousSocket) {
            previousSocket.leave(code);
            previousSocket.data.role = null;
            previousSocket.data.roomCode = null;
            previousSocket.data.playerId = null;
            previousSocket.data.playerToken = null;
          }
        }
        player.socketId = socket.id;
        player.connected = true;
        room.updatedAt = Date.now();
        socket.join(code);
        socket.data.role = "player";
        socket.data.roomCode = code;
        socket.data.playerId = player.id;
        socket.data.playerToken = player.token;
        ack({ ok: true, role: "player", playerId: player.id });
        emitRoom(room);
        return;
      }
    }

    ack({ ok: false, error: "Không thể khôi phục phiên chơi." });
  });

  socket.on("host:start", (_payload = {}, ack = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    if (!hostOwnsRoom(socket, room)) return ack({ ok: false, error: "Bạn không có quyền điều khiển phòng." });
    if (room.status !== "lobby") return ack({ ok: false, error: "Trận đấu đã bắt đầu." });
    if (connectedPlayers(room).length < 1) return ack({ ok: false, error: "Cần ít nhất một người chơi đang kết nối." });
    beginQuestion(room, 0);
    ack({ ok: true });
  });

  socket.on("host:reveal", (_payload = {}, ack = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    if (!hostOwnsRoom(socket, room)) return ack({ ok: false, error: "Bạn không có quyền điều khiển phòng." });
    if (room.status !== "question") return ack({ ok: false, error: "Không có câu hỏi đang mở." });
    revealQuestion(room);
    ack({ ok: true });
  });

  socket.on("host:next", (_payload = {}, ack = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    if (!hostOwnsRoom(socket, room)) return ack({ ok: false, error: "Bạn không có quyền điều khiển phòng." });
    if (room.status !== "reveal") return ack({ ok: false, error: "Hãy khóa đáp án trước khi chuyển câu." });
    if (room.questionIndex + 1 >= questions.length) finishGame(room);
    else beginQuestion(room, room.questionIndex + 1);
    ack({ ok: true });
  });

  socket.on("host:remove-player", (payload = {}, ack = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    if (!hostOwnsRoom(socket, room)) return ack({ ok: false, error: "Bạn không có quyền điều khiển phòng." });
    if (room.status !== "lobby") return ack({ ok: false, error: "Chỉ có thể xóa người chơi trong phòng chờ." });
    const player = room.players.get(String(payload.playerId || ""));
    if (!player) return ack({ ok: false, error: "Không tìm thấy người chơi." });
    if (player.socketId) io.to(player.socketId).emit("session:removed");
    room.players.delete(player.id);
    room.updatedAt = Date.now();
    ack({ ok: true });
    emitRoom(room);
  });

  socket.on("player:answer", (payload = {}, ack = () => {}) => {
    const room = rooms.get(socket.data.roomCode);
    const player = room?.players.get(socket.data.playerId);
    const question = room && currentQuestion(room);

    if (!room || !player || player.token !== socket.data.playerToken || player.socketId !== socket.id) {
      return ack({ ok: false, error: "Phiên người chơi không còn hiệu lực trên cửa sổ này." });
    }
    if (room.status !== "question" || !question) return ack({ ok: false, error: "Câu hỏi đã khóa." });
    if (player.answered) return ack({ ok: false, error: "Bạn đã gửi đáp án." });
    if (Date.now() > room.endsAt) {
      revealQuestion(room);
      return ack({ ok: false, error: "Đã hết thời gian trả lời." });
    }
    if (!isValidAnswerPayload(question, payload.answer)) return ack({ ok: false, error: "Đáp án không hợp lệ." });

    const elapsedMs = Math.max(0, Math.min(question.durationMs, Date.now() - room.startedAt));
    player.answer = payload.answer;
    player.answered = true;
    player.totalAnswerMs += elapsedMs;
    player.pendingResult = scoreAnswer({
      question,
      answer: payload.answer,
      elapsedMs,
      durationMs: question.durationMs,
      currentStreak: player.streak
    });
    room.updatedAt = Date.now();
    ack({ ok: true });
    emitRoom(room);

    if (allConnectedAnswered(room)) {
      if (room.revealTimer) clearTimeout(room.revealTimer);
      const expectedInstanceId = room.questionInstanceId;
      room.revealTimer = setTimeout(() => revealQuestion(room, expectedInstanceId), REVEAL_DELAY_MS);
    }
  });

  socket.on("disconnect", () => {
    const room = rooms.get(socket.data.roomCode);
    if (!room) return;
    if (socket.data.role === "host" && room.hostSocketId === socket.id) room.hostSocketId = null;
    if (socket.data.role === "player") {
      const player = room.players.get(socket.data.playerId);
      if (player && player.socketId === socket.id) {
        player.connected = false;
        player.socketId = null;
      }
    }
    room.updatedAt = Date.now();
    emitRoom(room);
  });
});

setInterval(() => {
  const cutoff = Date.now() - ROOM_TTL_MS;
  for (const [code, room] of rooms) {
    if (room.updatedAt < cutoff) {
      if (room.timer) clearTimeout(room.timer);
      if (room.revealTimer) clearTimeout(room.revealTimer);
      rooms.delete(code);
    }
  }
}, 15 * 60 * 1000).unref();

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Mật lệnh Thống nhất đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = { app, server, rooms };
