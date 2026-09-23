import {
  FINISH_STEP,
  HOME_START,
  LAST_PATH_STEP,
  PLAYER_META,
  TOKENS_PER_PLAYER,
  YARD,
  globalIndex,
  isSafeIndex,
  nextActive,
} from "./board.ts";
import type {
  Capture,
  GameState,
  Move,
  PlayerColor,
  Seat,
  TurnEvents,
} from "./types.ts";

export const MAX_LOG = 12;

function emptyTokens(): GameState["tokens"] {
  return {
    red: [YARD, YARD, YARD, YARD],
    green: [YARD, YARD, YARD, YARD],
    yellow: [YARD, YARD, YARD, YARD],
    blue: [YARD, YARD, YARD, YARD],
  };
}

export function defaultSeats(): Seat[] {
  return [
    { color: "red", kind: "human" },
    { color: "green", kind: "ai-medium" },
    { color: "yellow", kind: "ai-medium" },
    { color: "blue", kind: "ai-medium" },
  ];
}

export function activeFromSeats(seats: Seat[]): PlayerColor[] {
  return seats.filter((s) => s.kind !== "off").map((s) => s.color);
}

export function createGame(seats: Seat[]): GameState {
  const active = activeFromSeats(seats);
  if (active.length < 2) {
    throw new Error("Ludo needs at least two houses in play.");
  }
  const current = active[0]!;
  const name = houseName(seats, current);
  return {
    seats: seats.map((s) => ({ ...s })),
    active: [...active],
    tokens: emptyTokens(),
    current,
    phase: "rolling",
    dice: null,
    consecutiveSixes: 0,
    winner: null,
    log: [`${name} opens the court. Roll to begin.`],
    turnCount: 1,
  };
}

export function houseName(seats: Seat[], color: PlayerColor): string {
  const seat = seats.find((s) => s.color === color);
  if (seat?.kind === "human") {
    const humans = seats.filter((s) => s.kind === "human").length;
    return humans <= 1 ? "You" : PLAYER_META[color].label;
  }
  return PLAYER_META[color].label;
}

export function cloneGame(state: GameState): GameState {
  return {
    seats: state.seats.map((s) => ({ ...s })),
    active: [...state.active],
    tokens: {
      red: [...state.tokens.red],
      green: [...state.tokens.green],
      yellow: [...state.tokens.yellow],
      blue: [...state.tokens.blue],
    },
    current: state.current,
    phase: state.phase,
    dice: state.dice,
    consecutiveSixes: state.consecutiveSixes,
    winner: state.winner,
    log: [...state.log],
    turnCount: state.turnCount,
  };
}

function pushLog(state: GameState, line: string) {
  state.log = [...state.log, line].slice(-MAX_LOG);
}

export function getLegalMoves(state: GameState, color: PlayerColor, dice: number): Move[] {
  const moves: Move[] = [];
  const steps = state.tokens[color];
  for (let token = 0; token < TOKENS_PER_PLAYER; token++) {
    const from = steps[token] ?? YARD;
    if (from >= FINISH_STEP) continue;
    if (from === YARD) {
      if (dice === 6) moves.push({ token, from, to: 0 });
      continue;
    }
    const to = from + dice;
    if (to > FINISH_STEP) continue;
    moves.push({ token, from, to });
  }
  return moves;
}

export function occupantsOnPath(
  state: GameState,
  global: number,
): { color: PlayerColor; token: number }[] {
  const found: { color: PlayerColor; token: number }[] = [];
  for (const color of state.active) {
    const steps = state.tokens[color];
    for (let token = 0; token < TOKENS_PER_PLAYER; token++) {
      const s = steps[token] ?? YARD;
      if (s < 0 || s > LAST_PATH_STEP) continue;
      if (globalIndex(color, s) === global) found.push({ color, token });
    }
  }
  return found;
}

function capturesAt(state: GameState, mover: PlayerColor, to: number): Capture[] {
  if (to < 0 || to > LAST_PATH_STEP) return [];
  const global = globalIndex(mover, to);
  if (global == null || isSafeIndex(global)) return [];
  return occupantsOnPath(state, global)
    .filter((o) => o.color !== mover)
    .map((o) => ({
      color: o.color,
      token: o.token,
      from: state.tokens[o.color][o.token] ?? YARD,
    }));
}

function finishedCount(state: GameState, color: PlayerColor): number {
  return state.tokens[color].filter((s) => s >= FINISH_STEP).length;
}

function passTurn(state: GameState) {
  state.current = nextActive(state.active, state.current);
  state.phase = "rolling";
  state.dice = null;
  state.consecutiveSixes = 0;
  state.turnCount += 1;
}

function grantExtra(state: GameState) {
  state.phase = "rolling";
  state.dice = null;
}

export function rollDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

/** Apply a rolled face. Mutates a clone — pass a cloned state or expect mutation. */
export function applyRoll(state: GameState, face: number): TurnEvents {
  const events: TurnEvents = {
    six: face === 6,
    captured: [],
    finished: false,
    extraTurn: false,
    forfeitedSixes: false,
    winner: null,
    skipped: false,
  };
  if (state.phase !== "rolling" || state.winner) return events;

  const name = houseName(state.seats, state.current);
  state.dice = face;

  if (face === 6 && state.consecutiveSixes >= 2) {
    events.forfeitedSixes = true;
    events.skipped = true;
    pushLog(state, `${name} rolled a third six — the turn is forfeit.`);
    passTurn(state);
    return events;
  }

  const moves = getLegalMoves(state, state.current, face);
  if (moves.length === 0) {
    events.skipped = true;
    if (face === 6) {
      state.consecutiveSixes += 1;
      pushLog(state, `${name} rolled 6 but has no move. Extra roll.`);
      events.extraTurn = true;
      grantExtra(state);
    } else {
      pushLog(state, `${name} rolled ${face} — no legal move.`);
      passTurn(state);
    }
    return events;
  }

  state.phase = "picking";
  return events;
}

export function applyMove(state: GameState, token: number): TurnEvents {
  const events: TurnEvents = {
    six: state.dice === 6,
    captured: [],
    finished: false,
    extraTurn: false,
    forfeitedSixes: false,
    winner: null,
    skipped: false,
  };
  if (state.phase !== "picking" || state.dice == null || state.winner) return events;

  const color = state.current;
  const dice = state.dice;
  const moves = getLegalMoves(state, color, dice);
  const move = moves.find((m) => m.token === token);
  if (!move) return events;

  const name = houseName(state.seats, color);
  const caps = capturesAt(state, color, move.to);
  for (const cap of caps) {
    state.tokens[cap.color][cap.token] = YARD;
  }
  events.captured = caps;

  state.tokens[color][token] = move.to;
  events.finished = move.to >= FINISH_STEP;

  if (events.finished && finishedCount(state, color) >= TOKENS_PER_PLAYER) {
    state.winner = color;
    state.phase = "over";
    events.winner = color;
    pushLog(state, `${name} seats all four in the palace.`);
    return events;
  }

  if (caps.length) {
    const victims = [...new Set(caps.map((c) => houseName(state.seats, c.color)))];
    pushLog(state, `${name} sent ${victims.join(", ")} home.`);
  } else if (events.finished) {
    pushLog(state, `${name} reached the palace (${finishedCount(state, color)}/4).`);
  } else if (move.from === YARD) {
    pushLog(state, `${name} entered the path.`);
  } else {
    pushLog(state, `${name} advanced ${dice}.`);
  }

  const extra = dice === 6 || caps.length > 0 || events.finished;
  events.extraTurn = extra;
  if (dice === 6) state.consecutiveSixes += 1;
  else state.consecutiveSixes = 0;

  if (extra) {
    grantExtra(state);
  } else {
    passTurn(state);
  }
  return events;
}

export function seatKind(state: GameState, color: PlayerColor): Seat["kind"] {
  return state.seats.find((s) => s.color === color)?.kind ?? "off";
}

export function isHumanTurn(state: GameState): boolean {
  return seatKind(state, state.current) === "human" && state.phase !== "over";
}

export function progress(state: GameState, color: PlayerColor): number {
  return state.tokens[color].filter((s) => s >= FINISH_STEP).length;
}
