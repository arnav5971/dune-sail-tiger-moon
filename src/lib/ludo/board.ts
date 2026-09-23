import { PLAYER_COLORS, type PlayerColor } from "./types.ts";

export const PATH_LENGTH = 52;
export const LAST_PATH_STEP = 50;
export const HOME_START = 51;
export const FINISH_STEP = 56;
export const YARD = -1;
export const HOME_LENGTH = 5;
export const TOKENS_PER_PLAYER = 4;

function buildPath(): [number, number][] {
  const p: [number, number][] = [];
  for (let x = 1; x <= 5; x++) p.push([x, 6]);
  for (let y = 5; y >= 0; y--) p.push([6, y]);
  p.push([7, 0]);
  for (let y = 0; y <= 5; y++) p.push([8, y]);
  for (let x = 9; x <= 14; x++) p.push([x, 6]);
  p.push([14, 7]);
  for (let x = 14; x >= 9; x--) p.push([x, 8]);
  for (let y = 9; y <= 14; y++) p.push([8, y]);
  p.push([7, 14]);
  for (let y = 14; y >= 9; y--) p.push([6, y]);
  for (let x = 5; x >= 0; x--) p.push([x, 8]);
  p.push([0, 7]);
  p.push([0, 6]);
  return p;
}

export const PATH: readonly [number, number][] = buildPath();

export const START_INDEX: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

export const HOME_STRETCH: Record<PlayerColor, readonly [number, number][]> = {
  red: [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
  ],
  green: [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
  ],
  yellow: [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
  ],
  blue: [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
  ],
};

export const FINISH_CELL: Record<PlayerColor, [number, number]> = {
  red: [6, 7],
  green: [7, 6],
  yellow: [8, 7],
  blue: [7, 8],
};

export const YARD_CELLS: Record<PlayerColor, readonly [number, number][]> = {
  red: [
    [1, 10],
    [4, 10],
    [1, 13],
    [4, 13],
  ],
  green: [
    [1, 1],
    [4, 1],
    [1, 4],
    [4, 4],
  ],
  yellow: [
    [10, 1],
    [13, 1],
    [10, 4],
    [13, 4],
  ],
  blue: [
    [10, 10],
    [13, 10],
    [10, 13],
    [13, 13],
  ],
};

export const YARD_ORIGIN: Record<PlayerColor, [number, number]> = {
  green: [0, 0],
  yellow: [9, 0],
  red: [0, 9],
  blue: [9, 9],
};

/** Starts plus starred safe squares (8 after each start). */
export const SAFE_INDICES = new Set<number>([0, 8, 13, 21, 26, 34, 39, 47]);

export const PLAYER_META: Record<
  PlayerColor,
  { label: string; house: string; fill: string; ink: string }
> = {
  red: { label: "Scarlet", house: "House of Scarlet", fill: "var(--color-ludo-red)", ink: "var(--color-ludo-red-ink)" },
  green: { label: "Sage", house: "House of Sage", fill: "var(--color-ludo-green)", ink: "var(--color-ludo-green-ink)" },
  yellow: { label: "Saffron", house: "House of Saffron", fill: "var(--color-ludo-yellow)", ink: "var(--color-ludo-yellow-ink)" },
  blue: { label: "Indigo", house: "House of Indigo", fill: "var(--color-ludo-blue)", ink: "var(--color-ludo-blue-ink)" },
};

export const TURN_ORDER: PlayerColor[] = ["red", "green", "yellow", "blue"];

export function isSafeIndex(index: number): boolean {
  return SAFE_INDICES.has(index);
}

export function globalIndex(color: PlayerColor, steps: number): number | null {
  if (steps < 0 || steps > LAST_PATH_STEP) return null;
  return (START_INDEX[color] + steps) % PATH_LENGTH;
}

export function cellOf(color: PlayerColor, steps: number, token = 0): [number, number] {
  if (steps === YARD) return YARD_CELLS[color][token] ?? YARD_CELLS[color][0];
  if (steps >= FINISH_STEP) return FINISH_CELL[color];
  if (steps >= HOME_START) {
    return HOME_STRETCH[color][steps - HOME_START] ?? FINISH_CELL[color];
  }
  const idx = globalIndex(color, steps);
  if (idx == null) return YARD_CELLS[color][token] ?? YARD_CELLS[color][0];
  return PATH[idx] ?? YARD_CELLS[color][0];
}

export function pathCellsBetween(color: PlayerColor, from: number, to: number): [number, number][] {
  const cells: [number, number][] = [];
  if (from < 0 || to <= from) return cells;
  for (let s = from + 1; s <= to; s++) {
    cells.push(cellOf(color, s));
  }
  return cells;
}

export function nextActive(active: PlayerColor[], current: PlayerColor): PlayerColor {
  const i = active.indexOf(current);
  if (i < 0) return active[0] ?? current;
  return active[(i + 1) % active.length] ?? current;
}

export function isActiveColor(active: PlayerColor[], color: PlayerColor): boolean {
  return active.includes(color);
}

export { PLAYER_COLORS };
