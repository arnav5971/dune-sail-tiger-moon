import { create } from "zustand";
import {
  applyMove,
  applyRoll,
  cloneGame,
  createGame,
  defaultSeats,
  getLegalMoves,
  rollDie,
} from "./engine.ts";
import {
  sfxCapture,
  sfxClick,
  sfxDice,
  sfxEnter,
  sfxFinish,
  sfxForfeit,
  sfxMove,
  sfxSix,
  sfxWin,
  setMuted as setAudioMuted,
  unlockAudio,
} from "./audio.ts";
import type { GameState, Move, PendingAnim, PlayerColor, Seat, SeatKind, TurnEvents } from "./types.ts";

const SAVE_KEY = "ludo-court-v1";
const SAVE_VERSION = 1;

export type Screen = "setup" | "play";

export interface Toast {
  id: number;
  text: string;
  tone: "neutral" | "six" | "capture" | "home" | "warn";
}

interface PersistV1 {
  version: 1;
  screen: Screen;
  seats: Seat[];
  muted: boolean;
  game: GameState | null;
}

interface LudoStore {
  screen: Screen;
  seats: Seat[];
  game: GameState | null;
  resolved: GameState | null;
  muted: boolean;
  spinning: boolean;
  anim: PendingAnim | null;
  toasts: Toast[];
  rulesOpen: boolean;
  hydrated: boolean;
  hydrate: () => void;
  setSeat: (color: PlayerColor, kind: SeatKind) => void;
  setMuted: (muted: boolean) => void;
  setRulesOpen: (open: boolean) => void;
  startGame: (seats?: Seat[]) => void;
  returnToSetup: () => void;
  roll: () => void;
  pickToken: (color: PlayerColor, token: number) => void;
  completeAnim: () => void;
  legalMoves: () => Move[];
}

let toastSeq = 1;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
let rollTimer: ReturnType<typeof setTimeout> | null = null;
let animTimer: ReturnType<typeof setTimeout> | null = null;

function persistNow(slice: PersistV1) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(slice));
  } catch {
    /* private mode */
  }
}

function schedulePersist(get: () => LudoStore) {
  if (typeof window === "undefined") return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const s = get();
    persistNow({
      version: SAVE_VERSION,
      screen: s.screen,
      seats: s.seats,
      muted: s.muted,
      game: s.game?.phase === "over" ? null : s.resolved ?? s.game,
    });
  }, 180);
}

function loadPersist(): PersistV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistV1;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function pushToast(
  set: (fn: (s: LudoStore) => Partial<LudoStore>) => void,
  text: string,
  tone: Toast["tone"],
) {
  const id = toastSeq++;
  set((s) => ({ toasts: [...s.toasts.slice(-3), { id, text, tone }] }));
  setTimeout(() => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  }, 2200);
}

function kindOf(move: Move): PendingAnim["kind"] {
  if (move.from < 0) return "enter";
  if (move.to >= 56) return "finish";
  return "move";
}

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitMs(from: number, to: number): number {
  if (reducedMotion()) return 70;
  if (from < 0) return 300;
  const steps = Math.max(1, to - from);
  return Math.min(1100, 88 * steps + 70);
}

function playMoveSfx(move: Move, events: TurnEvents) {
  if (events.captured.length) sfxCapture();
  else if (events.finished) sfxFinish();
  else if (move.from < 0) sfxEnter();
  else sfxMove();
}

export const useLudo = create<LudoStore>((set, get) => ({
  screen: "setup",
  seats: defaultSeats(),
  game: null,
  resolved: null,
  muted: false,
  spinning: false,
  anim: null,
  toasts: [],
  rulesOpen: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const saved = loadPersist();
    if (!saved) {
      set({ hydrated: true });
      return;
    }
    setAudioMuted(saved.muted);
    set({
      hydrated: true,
      seats: saved.seats?.length === 4 ? saved.seats : defaultSeats(),
      muted: saved.muted,
      screen: saved.game ? "play" : "setup",
      game: saved.game,
      resolved: saved.game,
    });
  },

  setSeat: (color, kind) => {
    set((s) => {
      const next = s.seats.map((seat) => (seat.color === color ? { ...seat, kind } : seat));
      const active = next.filter((x) => x.kind !== "off").length;
      if (active < 2) return s;
      return { seats: next };
    });
    schedulePersist(get);
  },

  setMuted: (muted) => {
    setAudioMuted(muted);
    set({ muted });
    schedulePersist(get);
  },

  setRulesOpen: (open) => set({ rulesOpen: open }),

  startGame: (seats) => {
    unlockAudio();
    sfxClick();
    const used = seats ?? get().seats;
    const game = createGame(used);
    if (rollTimer) clearTimeout(rollTimer);
    if (animTimer) clearTimeout(animTimer);
    set({
      screen: "play",
      seats: used,
      game,
      resolved: game,
      spinning: false,
      anim: null,
      toasts: [],
    });
    schedulePersist(get);
  },

  returnToSetup: () => {
    if (rollTimer) clearTimeout(rollTimer);
    if (animTimer) clearTimeout(animTimer);
    set({
      screen: "setup",
      game: null,
      resolved: null,
      spinning: false,
      anim: null,
      toasts: [],
    });
    schedulePersist(get);
  },

  legalMoves: () => {
    const { game, anim } = get();
    if (!game || anim || game.dice == null || game.phase !== "picking") return [];
    return getLegalMoves(game, game.current, game.dice);
  },

  roll: () => {
    const { game, spinning, anim } = get();
    if (!game || spinning || anim || game.phase !== "rolling" || game.winner) return;
    unlockAudio();
    sfxDice();
    const face = rollDie();
    set({ spinning: true });
    if (rollTimer) clearTimeout(rollTimer);
    rollTimer = setTimeout(() => {
      const latest = get().game;
      if (!latest || latest.phase !== "rolling") {
        set({ spinning: false });
        return;
      }
      const cloned = cloneGame(latest);
      const events = applyRoll(cloned, face);
      set({ spinning: false, game: cloned, resolved: cloned });

      if (events.forfeitedSixes) {
        sfxForfeit();
        pushToast(set, "Three sixes — turn lost", "warn");
      } else if (events.six && !events.skipped) {
        sfxSix();
        pushToast(set, "Six", "six");
      } else if (events.skipped && events.six) {
        pushToast(set, "Six — rolling again", "six");
      } else if (events.skipped) {
        pushToast(set, "No legal move", "neutral");
      }

      const kind = cloned.seats.find((s) => s.color === cloned.current)?.kind;
      if (cloned.phase === "picking" && kind === "human") {
        const auto = getLegalMoves(cloned, cloned.current, face);
        if (auto.length === 1) {
          window.setTimeout(() => get().pickToken(cloned.current, auto[0]!.token), 260);
        }
      }
      schedulePersist(get);
    }, reducedMotion() ? 160 : 720);
  },

  pickToken: (color, token) => {
    const { game, anim, spinning } = get();
    if (!game || anim || spinning || game.phase !== "picking" || game.current !== color) return;
    const moves = getLegalMoves(game, color, game.dice ?? 0);
    const move = moves.find((m) => m.token === token);
    if (!move) return;
    unlockAudio();

    const cloned = cloneGame(game);
    const events = applyMove(cloned, token);

    playMoveSfx(move, events);
    if (events.captured.length) pushToast(set, "Sent home", "capture");
    else if (events.finished) pushToast(set, "Seated in the palace", "home");
    if (events.winner) {
      setTimeout(() => sfxWin(), waitMs(move.from, move.to) + 80);
    }

    const pending: PendingAnim = {
      color,
      token,
      from: move.from,
      to: move.to,
      kind: kindOf(move),
      captures: events.captured,
    };

    set({
      anim: pending,
      resolved: cloned,
    });

    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(() => get().completeAnim(), waitMs(move.from, move.to));
  },

  completeAnim: () => {
    const { resolved, anim } = get();
    if (!anim) return;
    if (resolved) set({ game: resolved, anim: null });
    else set({ anim: null });
    schedulePersist(get);
  },
}));

export function currentKind(game: GameState | null): SeatKind {
  if (!game) return "off";
  return game.seats.find((s) => s.color === game.current)?.kind ?? "off";
}

export function canHumanAct(game: GameState | null, spinning: boolean, anim: PendingAnim | null): boolean {
  if (!game || spinning || anim || game.phase === "over") return false;
  return currentKind(game) === "human";
}


