"use client";

import { useEffect, useMemo, useState } from "react";
import {
  HOME_STRETCH,
  PATH,
  PLAYER_META,
  SAFE_INDICES,
  START_INDEX,
  YARD_ORIGIN,
  cellOf,
} from "@/lib/ludo/board";
import type { GameState, PendingAnim, PlayerColor } from "@/lib/ludo/types";
import { cn } from "@/lib/utils";

const COLORS: PlayerColor[] = ["red", "green", "yellow", "blue"];

function cellKey(x: number, y: number) {
  return `${x},${y}`;
}

function Star({ x, y }: { x: number; y: number }) {
  const cx = x + 0.5;
  const cy = y + 0.5;
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 0.22 : 0.1;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");
  return <polygon points={pts} fill="var(--color-board-star)" opacity="0.9" />;
}

function BoardArt({ current }: { current: PlayerColor | null }) {
  return (
    <svg viewBox="-0.55 -0.55 16.1 16.1" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="ludo-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-board-wood-1)" />
          <stop offset="50%" stopColor="var(--color-board-wood-2)" />
          <stop offset="100%" stopColor="var(--color-board-wood-3)" />
        </linearGradient>
      </defs>

      <rect x="-0.5" y="-0.5" width="16" height="16" rx="0.55" fill="url(#ludo-wood)" />
      <rect x="-0.18" y="-0.18" width="15.36" height="15.36" rx="0.38" fill="var(--color-board-inlay)" />
      <rect x="0" y="0" width="15" height="15" rx="0.22" fill="var(--color-board-felt)" />

      {COLORS.map((c) => {
        const [ox, oy] = YARD_ORIGIN[c];
        const on = current === c;
        return (
          <g key={c}>
            <rect
              x={ox + 0.18}
              y={oy + 0.18}
              width="5.64"
              height="5.64"
              rx="0.42"
              fill={PLAYER_META[c].fill}
              opacity={on ? 1 : 0.92}
            />
            <rect
              x={ox + 0.46}
              y={oy + 0.46}
              width="5.08"
              height="5.08"
              rx="0.3"
              fill="none"
              stroke={PLAYER_META[c].ink}
              strokeOpacity="0.28"
              strokeWidth="0.08"
            />
            {[0, 1].flatMap((r) =>
              [0, 1].map((col) => {
                const cx = ox + 1.5 + col * 3;
                const cy = oy + 1.5 + r * 3;
                return (
                  <circle
                    key={`${c}-${r}-${col}`}
                    cx={cx}
                    cy={cy}
                    r="0.72"
                    fill={PLAYER_META[c].ink}
                    fillOpacity="0.16"
                    stroke={PLAYER_META[c].ink}
                    strokeOpacity="0.35"
                    strokeWidth="0.06"
                  />
                );
              }),
            )}
          </g>
        );
      })}

      {PATH.map(([x, y], i) => {
        const owner = (Object.entries(START_INDEX) as [PlayerColor, number][]).find(([, idx]) => idx === i)?.[0];
        const fill = owner ? PLAYER_META[owner].fill : "var(--color-board-cell)";
        return (
          <rect
            key={`p-${i}`}
            x={x + 0.09}
            y={y + 0.09}
            width="0.82"
            height="0.82"
            rx="0.12"
            fill={fill}
            stroke="var(--color-board-line)"
            strokeWidth="0.03"
          />
        );
      })}

      {COLORS.flatMap((c) =>
        HOME_STRETCH[c].map(([x, y], i) => (
          <rect
            key={`h-${c}-${i}`}
            x={x + 0.09}
            y={y + 0.09}
            width="0.82"
            height="0.82"
            rx="0.12"
            fill={PLAYER_META[c].fill}
            opacity={0.55 + i * 0.08}
          />
        )),
      )}

      {[...SAFE_INDICES]
        .filter((i) => !Object.values(START_INDEX).includes(i))
        .map((i) => {
          const cell = PATH[i];
          if (!cell) return null;
          return <Star key={`s-${i}`} x={cell[0]} y={cell[1]} />;
        })}

      <polygon points="6,6 9,6 7.5,7.5" fill={PLAYER_META.green.fill} />
      <polygon points="9,6 9,9 7.5,7.5" fill={PLAYER_META.yellow.fill} />
      <polygon points="9,9 6,9 7.5,7.5" fill={PLAYER_META.blue.fill} />
      <polygon points="6,9 6,6 7.5,7.5" fill={PLAYER_META.red.fill} />
      <circle cx="7.5" cy="7.5" r="0.28" fill="var(--color-board-inlay)" />
    </svg>
  );
}

function useDisplayedSteps(logical: number, dest: number | null, captured: boolean): number {
  const [shown, setShown] = useState(logical);

  useEffect(() => {
    if (captured) {
      const t = window.setTimeout(() => setShown(-1), 220);
      return () => clearTimeout(t);
    }
    if (dest == null || dest === logical) {
      setShown(logical);
      return;
    }
    if (logical < 0 || dest < logical) {
      setShown(dest);
      return;
    }
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(dest);
      return;
    }
    let current = logical;
    setShown(current);
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= 88) {
        current = Math.min(current + 1, dest);
        setShown(current);
        last = now;
      }
      if (current < dest) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [logical, dest, captured]);

  return shown;
}

function TokenPiece({
  color,
  index,
  steps,
  dest,
  captured,
  canMove,
  stacked,
  stackTotal,
  onClick,
  disabled,
}: {
  color: PlayerColor;
  index: number;
  steps: number;
  dest: number | null;
  captured: boolean;
  canMove: boolean;
  stacked: number;
  stackTotal: number;
  onClick: () => void;
  disabled: boolean;
}) {
  const shown = useDisplayedSteps(steps, dest, captured);
  const [x, y] = cellOf(color, shown, index);
  let ox = 0;
  let oy = 0;
  if (stackTotal > 1 && shown >= 0) {
    const a = (stacked / stackTotal) * Math.PI * 2 - Math.PI / 2;
    ox = Math.cos(a) * 0.16;
    oy = Math.sin(a) * 0.16;
  }
  const left = ((x + 0.5 + ox) / 15) * 100;
  const top = ((y + 0.5 + oy) / 15) * 100;
  const meta = PLAYER_META[color];

  return (
    <button
      type="button"
      aria-label={`${meta.label} token ${index + 1}`}
      disabled={disabled || !canMove}
      onClick={onClick}
      className={cn(
        "absolute z-10 flex size-[6.4%] items-center justify-center rounded-full border-[1.5px] border-ivory/35 shadow-[0_2px_6px_rgba(20,14,8,0.45)] transition-[left,top] duration-100 ease-out",
        canMove && "z-20 cursor-pointer ring-2 ring-ivory/90 ring-offset-2 ring-offset-transparent",
        canMove && "animate-[ludo-pulse_1.4s_ease-in-out_infinite]",
        !canMove && "cursor-default",
      )}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${meta.fill} 55%, white), ${meta.fill} 55%, color-mix(in oklab, ${meta.fill} 70%, var(--color-token-shade)))`,
      }}
    >
      <span
        className="size-[38%] rounded-full opacity-70"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)" }}
      />
    </button>
  );
}

export function Board({
  game,
  anim,
  legalTokens,
  onToken,
  interactive,
}: {
  game: GameState;
  anim: PendingAnim | null;
  legalTokens: Set<number>;
  onToken: (color: PlayerColor, token: number) => void;
  interactive: boolean;
}) {
  const occupancy = useMemo(() => {
    const map = new Map<string, { color: PlayerColor; token: number }[]>();
    for (const color of game.active) {
      game.tokens[color].forEach((steps, token) => {
        const cap = anim?.captures.find((c) => c.color === color && c.token === token);
        const shown = anim && anim.color === color && anim.token === token ? anim.from : cap ? cap.from : steps;
        const [x, y] = cellOf(color, shown, token);
        const k = cellKey(x, y);
        const list = map.get(k) ?? [];
        list.push({ color, token });
        map.set(k, list);
      });
    }
    return map;
  }, [game, anim]);

  return (
    <div className="relative aspect-square w-full select-none">
      <BoardArt current={game.phase === "over" ? game.winner : game.current} />
      {COLORS.filter((c) => game.active.includes(c)).flatMap((color) =>
        game.tokens[color].map((steps, token) => {
          const moving = Boolean(anim && anim.color === color && anim.token === token);
          const cap = anim?.captures.find((c) => c.color === color && c.token === token);
          const base = cap ? cap.from : moving ? anim!.from : steps;
          const [sx, sy] = cellOf(color, base, token);
          const stackList = occupancy.get(cellKey(sx, sy)) ?? [];
          const stacked = stackList.findIndex((t) => t.color === color && t.token === token);
          return (
            <TokenPiece
              key={`${color}-${token}`}
              color={color}
              index={token}
              steps={base}
              dest={moving ? anim!.to : null}
              captured={Boolean(cap)}
              canMove={interactive && game.current === color && legalTokens.has(token)}
              stacked={Math.max(0, stacked)}
              stackTotal={stackList.length}
              disabled={!interactive}
              onClick={() => onToken(color, token)}
            />
          );
        }),
      )}
    </div>
  );
}
