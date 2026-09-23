import { FINISH_STEP, HOME_START, LAST_PATH_STEP, YARD, globalIndex, isSafeIndex } from "./board.ts";
import { cloneGame, applyMove, getLegalMoves } from "./engine.ts";
import type { GameState, Move, PlayerColor, SeatKind } from "./types.ts";

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function dangerOn(state: GameState, color: PlayerColor, steps: number): number {
  if (steps < 0 || steps > LAST_PATH_STEP) return 0;
  const g = globalIndex(color, steps);
  if (g == null || isSafeIndex(g)) return 0;
  let threat = 0;
  for (const other of state.active) {
    if (other === color) continue;
    for (const s of state.tokens[other]) {
      if (s < 0 || s > LAST_PATH_STEP) continue;
      const og = globalIndex(other, s);
      if (og == null) continue;
      const dist = (g - og + 52) % 52;
      if (dist >= 1 && dist <= 6) {
        const weight = s >= 40 ? 2.4 : 1;
        threat += weight * ((7 - dist) / 6);
      }
    }
  }
  return threat;
}

function tokenValue(steps: number): number {
  if (steps >= FINISH_STEP) return 120;
  if (steps >= HOME_START) return 70 + (steps - HOME_START) * 8;
  if (steps < 0) return 0;
  return steps * 1.15;
}

function evaluate(state: GameState, me: PlayerColor): number {
  let score = 0;
  for (const color of state.active) {
    const sign = color === me ? 1 : -1;
    for (const s of state.tokens[color]) {
      score += sign * tokenValue(s);
      if (color === me && s >= 0 && s <= LAST_PATH_STEP) {
        score -= dangerOn(state, color, s) * 9;
      }
    }
  }
  return score;
}

function scoreMove(state: GameState, move: Move, difficulty: Exclude<SeatKind, "off" | "human">): number {
  const next = cloneGame(state);
  const events = applyMove(next, move.token);
  const me = state.current;
  let score = 0;

  if (move.from === YARD) score += 48;
  if (move.to >= FINISH_STEP) score += 90;
  if (move.from < HOME_START && move.to >= HOME_START) score += 36;
  if (events.captured.length) {
    for (const cap of events.captured) {
      const victim = cap.from;
      score += 70 + Math.max(0, victim) * 1.4;
    }
  }
  if (move.to >= 0 && move.to <= LAST_PATH_STEP) {
    const g = globalIndex(me, move.to);
    if (g != null && isSafeIndex(g)) score += 18;
  }

  score -= dangerOn(state, me, move.from) * 2;
  score -= dangerOn(next, me, move.to) * 8;
  score += move.to * 0.4;

  if (difficulty === "ai-hard") {
    score += evaluate(next, me) * 0.35;
    if (events.extraTurn && move.to < FINISH_STEP) score += 8;
  }

  score += Math.random() * (difficulty === "ai-easy" ? 40 : difficulty === "ai-medium" ? 8 : 2);
  return score;
}

export function chooseAiMove(state: GameState, kind: SeatKind): Move | null {
  if (state.dice == null) return null;
  const moves = getLegalMoves(state, state.current, state.dice);
  if (moves.length === 0) return null;
  if (kind === "ai-easy" || kind === "human" || kind === "off") {
    if (kind === "ai-easy") return pick(moves);
    return moves[0] ?? null;
  }
  let best = moves[0]!;
  let bestScore = -Infinity;
  for (const move of moves) {
    const s = scoreMove(state, move, kind);
    if (s > bestScore) {
      bestScore = s;
      best = move;
    }
  }
  return best;
}
