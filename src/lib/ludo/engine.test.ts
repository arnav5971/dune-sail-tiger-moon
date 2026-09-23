import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  HOME_STRETCH,
  LAST_PATH_STEP,
  PATH,
  PATH_LENGTH,
  SAFE_INDICES,
  START_INDEX,
  cellOf,
  globalIndex,
} from "./board.ts";
import {
  applyMove,
  applyRoll,
  cloneGame,
  createGame,
  defaultSeats,
  getLegalMoves,
} from "./engine.ts";
import { chooseAiMove } from "./ai.ts";
import type { GameState, Seat } from "./types.ts";

function seats(kinds: Seat["kind"][]): Seat[] {
  const colors = ["red", "green", "yellow", "blue"] as const;
  return colors.map((color, i) => ({ color, kind: kinds[i] ?? "off" }));
}

function withDice(state: GameState, face: number): GameState {
  const s = cloneGame(state);
  s.phase = "rolling";
  s.dice = null;
  applyRoll(s, face);
  return s;
}

describe("board geometry", () => {
  it("has 52 unique path cells", () => {
    assert.equal(PATH.length, PATH_LENGTH);
    const keys = new Set(PATH.map(([x, y]) => `${x},${y}`));
    assert.equal(keys.size, 52);
  });

  it("keeps every path cell on the 15×15 board", () => {
    for (const [x, y] of PATH) {
      assert.ok(x >= 0 && x <= 14 && y >= 0 && y <= 14);
    }
  });

  it("connects the last path step to the first home cell", () => {
    for (const color of ["red", "green", "yellow", "blue"] as const) {
      const last = cellOf(color, LAST_PATH_STEP);
      const home0 = HOME_STRETCH[color][0]!;
      const dist = Math.abs(last[0] - home0[0]) + Math.abs(last[1] - home0[1]);
      assert.equal(dist, 1, `${color} home is not adjacent to the path`);
    }
  });

  it("marks eight safe squares including all starts", () => {
    assert.equal(SAFE_INDICES.size, 8);
    for (const color of ["red", "green", "yellow", "blue"] as const) {
      assert.ok(SAFE_INDICES.has(START_INDEX[color]));
    }
  });
});

describe("rules", () => {
  it("requires a six to leave the yard", () => {
    const game = createGame(defaultSeats());
    const after3 = withDice(game, 3);
    assert.equal(after3.phase, "rolling");
    assert.equal(after3.current, "green");

    const g2 = createGame(defaultSeats());
    const after6 = withDice(g2, 6);
    assert.equal(after6.phase, "picking");
    const moves = getLegalMoves(after6, "red", 6);
    assert.equal(moves.length, 4);
    assert.ok(moves.every((m) => m.from === -1 && m.to === 0));
  });

  it("enters the path on a six and grants an extra roll", () => {
    let g = withDice(createGame(defaultSeats()), 6);
    const events = applyMove(g, 0);
    assert.equal(g.tokens.red[0], 0);
    assert.equal(events.extraTurn, true);
    assert.equal(g.phase, "rolling");
    assert.equal(g.current, "red");
  });

  it("cannot overshoot the palace", () => {
    const g = createGame(seats(["human", "ai-easy", "off", "off"]));
    g.tokens.red = [55, -1, -1, -1];
    g.phase = "rolling";
    applyRoll(g, 2);
    assert.equal(g.phase, "rolling");
    assert.equal(g.current, "green");
  });

  it("finishes on an exact roll and extra-turns", () => {
    const g = createGame(seats(["human", "ai-easy", "off", "off"]));
    g.tokens.red = [54, -1, -1, -1];
    g.phase = "rolling";
    applyRoll(g, 2);
    const events = applyMove(g, 0);
    assert.equal(g.tokens.red[0], 56);
    assert.equal(events.finished, true);
    assert.equal(events.extraTurn, true);
    assert.equal(g.current, "red");
  });

  it("captures an opponent on a non-safe square", () => {
    const g = createGame(defaultSeats());
    g.tokens.red = [4, -1, -1, -1];
    g.tokens.green = [0, -1, -1, -1];
    // red global 4, green start is 13, green steps 0 → 13. Need same global.
    // red steps 13 → global 13, which is GREEN START (safe) — no capture.
    // Place green at steps that land on red's upcoming square.
    // red at 3, roll 2 → to 5, global 5.
    // green global 5: (13 + s) % 52 = 5 => s = 44.
    g.tokens.red = [3, -1, -1, -1];
    g.tokens.green = [44, -1, -1, -1];
    assert.equal(globalIndex("red", 5), globalIndex("green", 44));
    assert.equal(SAFE_INDICES.has(globalIndex("red", 5)!), false);
    g.phase = "rolling";
    applyRoll(g, 2);
    const events = applyMove(g, 0);
    assert.equal(g.tokens.green[0], -1);
    assert.equal(events.captured.length, 1);
    assert.equal(events.extraTurn, true);
  });

  it("does not capture on a safe start square", () => {
    const g = createGame(defaultSeats());
    // green start global 13 is safe. red steps 13 → global 13.
    g.tokens.red = [12, -1, -1, -1];
    g.tokens.green = [0, -1, -1, -1];
    g.phase = "rolling";
    applyRoll(g, 1);
    const events = applyMove(g, 0);
    assert.equal(g.tokens.red[0], 13);
    assert.equal(g.tokens.green[0], 0);
    assert.equal(events.captured.length, 0);
  });

  it("forfeits a third consecutive six", () => {
    const g = createGame(defaultSeats());
    g.consecutiveSixes = 2;
    g.tokens.red = [0, -1, -1, -1];
    applyRoll(g, 6);
    assert.equal(g.current, "green");
    assert.equal(g.phase, "rolling");
    assert.equal(g.tokens.red[0], 0);
  });

  it("wins when all four tokens finish", () => {
    const g = createGame(seats(["human", "ai-easy", "off", "off"]));
    g.tokens.red = [56, 56, 56, 55];
    g.phase = "rolling";
    applyRoll(g, 1);
    const events = applyMove(g, 3);
    assert.equal(events.winner, "red");
    assert.equal(g.phase, "over");
    assert.equal(g.winner, "red");
  });

  it("skips inactive colours in turn order", () => {
    const g = createGame(seats(["human", "off", "ai-easy", "off"]));
    assert.deepEqual(g.active, ["red", "yellow"]);
    applyRoll(g, 2);
    assert.equal(g.current, "yellow");
  });
});

describe("ai", () => {
  it("always returns a legal move", () => {
    const g = createGame(defaultSeats());
    g.tokens.red = [4, 10, -1, 20];
    g.phase = "rolling";
    applyRoll(g, 3);
    const move = chooseAiMove(g, "ai-hard");
    assert.ok(move);
    const legal = getLegalMoves(g, "red", 3);
    assert.ok(legal.some((m) => m.token === move!.token && m.to === move!.to));
  });

  it("prefers a capture on medium", () => {
    const g = createGame(defaultSeats());
    g.tokens.red = [3, 0, -1, -1];
    g.tokens.green = [44, -1, -1, -1];
    g.phase = "rolling";
    applyRoll(g, 2);
    const move = chooseAiMove(g, "ai-medium");
    assert.equal(move?.token, 0);
    assert.equal(move?.to, 5);
  });
});

describe("simulation smoke", () => {
  it("random games always terminate", () => {
    for (let n = 0; n < 40; n++) {
      const g = createGame(
        seats(["ai-easy", "ai-easy", n % 2 === 0 ? "ai-easy" : "off", n % 3 === 0 ? "ai-easy" : "off"]),
      );
      let guard = 0;
      while (g.phase !== "over" && guard++ < 8000) {
        if (g.phase === "rolling") {
          applyRoll(g, 1 + (guard % 6));
          continue;
        }
        const moves = getLegalMoves(g, g.current, g.dice ?? 1);
        if (!moves.length) break;
        applyMove(g, moves[guard % moves.length]!.token);
      }
      assert.ok(guard < 8000, "game stalled");
    }
  });
});
