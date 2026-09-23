export const PLAYER_COLORS = ["red", "green", "yellow", "blue"] as const;
export type PlayerColor = (typeof PLAYER_COLORS)[number];

export type SeatKind = "off" | "human" | "ai-easy" | "ai-medium" | "ai-hard";

export type GamePhase = "rolling" | "picking" | "over";

export interface Seat {
  color: PlayerColor;
  kind: SeatKind;
}

export interface Move {
  token: number;
  from: number;
  to: number;
}

export interface Capture {
  color: PlayerColor;
  token: number;
  from: number;
}

export interface TurnEvents {
  six: boolean;
  captured: Capture[];
  finished: boolean;
  extraTurn: boolean;
  forfeitedSixes: boolean;
  winner: PlayerColor | null;
  skipped: boolean;
}

export interface GameState {
  seats: Seat[];
  active: PlayerColor[];
  tokens: Record<PlayerColor, [number, number, number, number]>;
  current: PlayerColor;
  phase: GamePhase;
  dice: number | null;
  consecutiveSixes: number;
  winner: PlayerColor | null;
  log: string[];
  turnCount: number;
}

export type AnimKind = "move" | "enter" | "capture-return" | "finish";

export interface PendingAnim {
  color: PlayerColor;
  token: number;
  from: number;
  to: number;
  kind: AnimKind;
  captures: Capture[];
}
