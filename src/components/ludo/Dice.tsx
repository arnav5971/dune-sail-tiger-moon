"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PIP_LAYOUT: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 26],
    [28, 50],
    [28, 74],
    [72, 26],
    [72, 50],
    [72, 74],
  ],
};

function Face({ value }: { value: number }) {
  const pips = PIP_LAYOUT[value] ?? PIP_LAYOUT[1]!;
  return (
    <div className="relative size-full rounded-[22%] bg-dice text-dice-fg shadow-[inset_0_-6px_10px_rgba(40,28,16,0.12),inset_0_6px_8px_rgba(255,255,255,0.55)]">
      {pips.map(([x, y], i) => (
        <span
          key={i}
          className="absolute size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dice-fg"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  );
}

export function Dice({
  value,
  spinning,
  disabled,
  onRoll,
  label,
}: {
  value: number | null;
  spinning: boolean;
  disabled: boolean;
  onRoll: () => void;
  label: string;
}) {
  const [shown, setShown] = useState(value ?? 1);

  useEffect(() => {
    if (!spinning) {
      setShown(value ?? 1);
      return;
    }
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 70) {
        setShown(1 + Math.floor(Math.random() * 6));
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [spinning, value]);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={onRoll}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "relative size-[5.5rem] sm:size-24 rounded-[1.35rem] p-[0.35rem]",
          "bg-surface-2 border border-border shadow-[0_10px_24px_rgba(12,10,8,0.35)]",
          "transition-[transform,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)]",
          "disabled:opacity-70",
          !disabled && "hover:brightness-110 active:scale-[0.97]",
          spinning && "animate-[ludo-roll_0.72s_ease-in-out]",
        )}
      >
        <Face value={shown} />
      </button>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
    </div>
  );
}
