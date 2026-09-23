"use client";

import { useEffect, useMemo } from "react";
import { BookOpen, Bot, RotateCcw, Trophy, User, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Board } from "@/components/ludo/Board";
import { Dice } from "@/components/ludo/Dice";
import { chooseAiMove } from "@/lib/ludo/ai";
import { PLAYER_META } from "@/lib/ludo/board";
import { houseName, progress } from "@/lib/ludo/engine";
import { canHumanAct, currentKind, useLudo } from "@/lib/ludo/store";
import { unlockAudio } from "@/lib/ludo/audio";
import type { GameState, PlayerColor, SeatKind } from "@/lib/ludo/types";
import { cn } from "@/lib/utils";

const SEAT_OPTIONS: { kind: SeatKind; label: string }[] = [
  { kind: "off", label: "Out" },
  { kind: "human", label: "You" },
  { kind: "ai-easy", label: "Easy" },
  { kind: "ai-medium", label: "Medium" },
  { kind: "ai-hard", label: "Hard" },
];

function promptText(args: {
  spinning: boolean;
  anim: boolean;
  phase: string;
  kind: SeatKind;
  name: string;
  winner: string | null;
}): string {
  if (args.winner) return `${args.winner} takes the court`;
  if (args.spinning) return "The die is rolling";
  if (args.anim) return "Tokens in motion";
  if (args.kind !== "human" && args.kind !== "off") return `${args.name} is reading the board`;
  if (args.phase === "rolling") return "Roll the die";
  if (args.phase === "picking") return "Tap a glowing token";
  return "Your move";
}

function SetupScreen() {
  const seats = useLudo((s) => s.seats);
  const setSeat = useLudo((s) => s.setSeat);
  const startGame = useLudo((s) => s.startGame);
  const setRulesOpen = useLudo((s) => s.setRulesOpen);
  const active = seats.filter((s) => s.kind !== "off").length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:py-14">
      <header className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted">A four-house race</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-[-0.03em] text-balance text-foreground sm:text-5xl">
          Ludo Court
        </h1>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted">
          Bring four tokens home along a clockwise path. Six to enter, exact to finish, and no mercy on an open square.
        </p>
      </header>

      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-medium text-foreground">Arrange the houses</h2>
          <span className="text-xs tabular-nums text-subtle">{active} in play</span>
        </div>
        <ul className="divide-y divide-border">
          {seats.map((seat) => {
            const meta = PLAYER_META[seat.color];
            return (
              <li key={seat.color} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="size-3.5 rounded-full"
                    style={{ background: meta.fill }}
                    aria-hidden
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{meta.house}</p>
                    <p className="text-xs text-subtle">{meta.label}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SEAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.kind}
                      type="button"
                      disabled={opt.kind === "off" && active <= 2 && seat.kind !== "off"}
                      onClick={() => setSeat(seat.color, opt.kind)}
                      className={cn(
                        "h-9 rounded-full px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
                        seat.kind === opt.kind
                          ? "bg-accent text-accent-foreground"
                          : "bg-surface-2 text-muted hover:text-foreground",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="xl" onClick={() => startGame()} className="min-h-12 w-full sm:w-auto">
          Begin match
        </Button>
        <Button size="lg" variant="ghost" onClick={() => setRulesOpen(true)} className="w-full sm:w-auto">
          <BookOpen />
          How to play
        </Button>
      </div>
    </div>
  );
}

function PlayerRail({ game }: { game: GameState }) {
  return (
    <ul className="flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
      {game.seats
        .filter((s) => s.kind !== "off")
        .map((seat) => {
          const meta = PLAYER_META[seat.color];
          const done = progress(game, seat.color);
          const on = game.current === seat.color && game.phase !== "over";
          const isHuman = seat.kind === "human";
          return (
            <li
              key={seat.color}
              className={cn(
                "flex min-w-[9.5rem] flex-1 items-center gap-3 rounded-[var(--radius-lg)] border px-3 py-2.5 sm:min-w-0",
                on ? "border-accent/50 bg-surface-2" : "border-border bg-surface",
              )}
            >
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full"
                style={{ background: meta.fill, color: meta.ink }}
              >
                {isHuman ? <User className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {houseName(game.seats, seat.color)}
                </p>
                <p className="text-xs tabular-nums text-subtle">
                  {done}/4 home
                  {on ? " · to play" : ""}
                </p>
              </div>
            </li>
          );
        })}
    </ul>
  );
}

function RulesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-overlay" aria-label="Close rules" onClick={onClose} />
      <div
        role="dialog"
        aria-labelledby="rules-title"
        className="relative z-10 w-full max-w-md rounded-t-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:rounded-[var(--radius-xl)]"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="rules-title" className="font-display text-2xl tracking-[-0.02em] text-foreground">
            How to play
          </h2>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        <ol className="space-y-3 text-sm leading-relaxed text-muted">
          <li>Roll a six to bring a token from the yard onto your coloured start square.</li>
          <li>Tokens travel clockwise, then up your coloured column into the palace.</li>
          <li>Landing on an opponent on an open square sends them home — stars and starts are safe.</li>
          <li>A six, a capture, or seating a token in the palace earns another roll.</li>
          <li>Three sixes in a row forfeits the third roll.</li>
          <li>You must land exactly on the palace. First house to seat all four wins.</li>
        </ol>
      </div>
    </div>
  );
}

function WinBanner({
  color,
  onAgain,
  onSetup,
}: {
  color: PlayerColor;
  onAgain: () => void;
  onSetup: () => void;
}) {
  const meta = PLAYER_META[color];
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <Trophy className="mx-auto size-8 text-accent" />
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">Palace claimed</p>
        <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-foreground">{meta.house}</h2>
        <p className="mt-2 text-sm text-muted">All four tokens seated. The court is theirs.</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={onAgain}>Play again</Button>
          <Button variant="secondary" onClick={onSetup}>
            Rearrange
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlayScreen() {
  const game = useLudo((s) => s.game);
  const anim = useLudo((s) => s.anim);
  const spinning = useLudo((s) => s.spinning);
  const toasts = useLudo((s) => s.toasts);
  const muted = useLudo((s) => s.muted);
  const roll = useLudo((s) => s.roll);
  const pickToken = useLudo((s) => s.pickToken);
  const legalMoves = useLudo((s) => s.legalMoves);
  const setMuted = useLudo((s) => s.setMuted);
  const returnToSetup = useLudo((s) => s.returnToSetup);
  const startGame = useLudo((s) => s.startGame);
  const setRulesOpen = useLudo((s) => s.setRulesOpen);
  const seats = useLudo((s) => s.seats);

  const human = canHumanAct(game, spinning, anim);
  const kind = currentKind(game);
  const legal = useMemo(() => (game && !anim && !spinning ? legalMoves() : []), [game, anim, spinning, legalMoves]);
  const legalTokens = useMemo(() => new Set(legal.map((m) => m.token)), [legal]);

  useEffect(() => {
    if (!game || game.phase === "over" || spinning || anim) return;
    if (kind === "human" || kind === "off") return;
    if (game.phase === "rolling") {
      const t = window.setTimeout(() => roll(), 560);
      return () => clearTimeout(t);
    }
    if (game.phase === "picking") {
      const t = window.setTimeout(() => {
        const move = chooseAiMove(game, kind);
        if (move) pickToken(game.current, move.token);
      }, kind === "ai-hard" ? 700 : 480);
      return () => clearTimeout(t);
    }
  }, [game, spinning, anim, kind, roll, pickToken]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        if (human && game?.phase === "rolling") {
          e.preventDefault();
          roll();
        }
      }
      if (e.key >= "1" && e.key <= "4" && human && game?.phase === "picking") {
        pickToken(game.current, Number(e.key) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [human, game, roll, pickToken]);

  if (!game) return null;
  const name = houseName(game.seats, game.current);
  const winnerName = game.winner ? houseName(game.seats, game.winner) : null;
  const prompt = promptText({
    spinning,
    anim: Boolean(anim),
    phase: game.phase,
    kind,
    name,
    winner: winnerName,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)_11.5rem] lg:items-start">
      <header className="flex items-center justify-between gap-3 lg:col-span-3">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted">Ludo Court</p>
          <h1 className="font-display text-xl tracking-[-0.03em] text-foreground sm:text-2xl">{prompt}</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={() => setRulesOpen(true)} aria-label="How to play">
            <BookOpen />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              unlockAudio();
              setMuted(!muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button size="icon" variant="ghost" onClick={returnToSetup} aria-label="New match">
            <RotateCcw />
          </Button>
        </div>
      </header>

      <PlayerRail game={game} />

      <div className="relative mx-auto w-full max-w-[min(100%,72dvh)]">
        <Board
          game={game}
          anim={anim}
          legalTokens={game.current && kind === "human" ? legalTokens : new Set()}
          interactive={human && game.phase === "picking"}
          onToken={pickToken}
        />
        {game.winner && (
          <WinBanner
            color={game.winner}
            onAgain={() => startGame(seats)}
            onSetup={returnToSetup}
          />
        )}
        <div className="pointer-events-none absolute left-1/2 top-3 z-20 flex -translate-x-1/2 flex-col items-center gap-1">
          {toasts.map((t) => (
            <span
              key={t.id}
              className="rounded-full border border-border bg-surface/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm"
            >
              {t.text}
            </span>
          ))}
        </div>
      </div>

      <aside className="flex flex-col items-center gap-5 pb-[env(safe-area-inset-bottom)] lg:items-stretch lg:pt-2">
        <Dice
          value={game.dice}
          spinning={spinning}
          disabled={!human || game.phase !== "rolling"}
          onRoll={roll}
          label={human && game.phase === "rolling" ? "Tap to roll" : spinning ? "Rolling" : "Die"}
        />
        <p className="hidden text-xs leading-relaxed text-subtle lg:block">
          Space rolls. Keys 1–4 move a token when more than one can travel.
        </p>
      </aside>
    </div>
  );
}

export function LudoApp() {
  const screen = useLudo((s) => s.screen);
  const hydrated = useLudo((s) => s.hydrated);
  const hydrate = useLudo((s) => s.hydrate);
  const rulesOpen = useLudo((s) => s.rulesOpen);
  const setRulesOpen = useLudo((s) => s.setRulesOpen);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const w = window as Window & { __ludo?: () => unknown };
    w.__ludo = () => {
      const s = useLudo.getState();
      return {
        screen: s.screen,
        phase: s.game?.phase,
        current: s.game?.current,
        dice: s.game?.dice,
        tokens: s.game?.tokens,
        spinning: s.spinning,
        winner: s.game?.winner,
      };
    };
    return () => {
      delete w.__ludo;
    };
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-surface-2)_80%,transparent),transparent_55%)]" />
      <div className="relative flex min-h-dvh flex-1 flex-col">
        {!hydrated ? <div className="min-h-dvh bg-background" /> : screen === "setup" ? <SetupScreen /> : <PlayScreen />}
      </div>
      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}
