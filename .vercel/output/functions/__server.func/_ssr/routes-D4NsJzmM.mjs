import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trophy, c as Bot, i as User, l as BookOpen, n as VolumeX, r as Volume2, s as RotateCcw, t as X } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4NsJzmM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:opacity-90 active:scale-[0.98]",
			secondary: "bg-surface-2 text-foreground border border-border hover:bg-surface-3 active:scale-[0.98]",
			outline: "border border-border bg-transparent text-foreground hover:bg-surface-2 active:scale-[0.98]",
			ghost: "text-muted hover:text-foreground hover:bg-surface-2",
			house: "text-house-ink active:scale-[0.98]"
		},
		size: {
			default: "h-11 rounded-[var(--radius-md)] px-4 text-sm",
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-sm",
			lg: "h-12 rounded-[var(--radius-md)] px-5 text-base",
			xl: "h-14 rounded-[var(--radius-lg)] px-6 text-base",
			icon: "size-11 rounded-[var(--radius-md)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function buildPath() {
	const p = [];
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
var PATH = buildPath();
var START_INDEX = {
	red: 0,
	green: 13,
	yellow: 26,
	blue: 39
};
var HOME_STRETCH = {
	red: [
		[1, 7],
		[2, 7],
		[3, 7],
		[4, 7],
		[5, 7]
	],
	green: [
		[7, 1],
		[7, 2],
		[7, 3],
		[7, 4],
		[7, 5]
	],
	yellow: [
		[13, 7],
		[12, 7],
		[11, 7],
		[10, 7],
		[9, 7]
	],
	blue: [
		[7, 13],
		[7, 12],
		[7, 11],
		[7, 10],
		[7, 9]
	]
};
var FINISH_CELL = {
	red: [6, 7],
	green: [7, 6],
	yellow: [8, 7],
	blue: [7, 8]
};
var YARD_CELLS = {
	red: [
		[1, 10],
		[4, 10],
		[1, 13],
		[4, 13]
	],
	green: [
		[1, 1],
		[4, 1],
		[1, 4],
		[4, 4]
	],
	yellow: [
		[10, 1],
		[13, 1],
		[10, 4],
		[13, 4]
	],
	blue: [
		[10, 10],
		[13, 10],
		[10, 13],
		[13, 13]
	]
};
var YARD_ORIGIN = {
	green: [0, 0],
	yellow: [9, 0],
	red: [0, 9],
	blue: [9, 9]
};
/** Starts plus starred safe squares (8 after each start). */
var SAFE_INDICES = /* @__PURE__ */ new Set([
	0,
	8,
	13,
	21,
	26,
	34,
	39,
	47
]);
var PLAYER_META = {
	red: {
		label: "Scarlet",
		house: "House of Scarlet",
		fill: "var(--color-ludo-red)",
		ink: "var(--color-ludo-red-ink)"
	},
	green: {
		label: "Sage",
		house: "House of Sage",
		fill: "var(--color-ludo-green)",
		ink: "var(--color-ludo-green-ink)"
	},
	yellow: {
		label: "Saffron",
		house: "House of Saffron",
		fill: "var(--color-ludo-yellow)",
		ink: "var(--color-ludo-yellow-ink)"
	},
	blue: {
		label: "Indigo",
		house: "House of Indigo",
		fill: "var(--color-ludo-blue)",
		ink: "var(--color-ludo-blue-ink)"
	}
};
function isSafeIndex(index) {
	return SAFE_INDICES.has(index);
}
function globalIndex(color, steps) {
	if (steps < 0 || steps > 50) return null;
	return (START_INDEX[color] + steps) % 52;
}
function cellOf(color, steps, token = 0) {
	if (steps === -1) return YARD_CELLS[color][token] ?? YARD_CELLS[color][0];
	if (steps >= 56) return FINISH_CELL[color];
	if (steps >= 51) return HOME_STRETCH[color][steps - 51] ?? FINISH_CELL[color];
	const idx = globalIndex(color, steps);
	if (idx == null) return YARD_CELLS[color][token] ?? YARD_CELLS[color][0];
	return PATH[idx] ?? YARD_CELLS[color][0];
}
function nextActive(active, current) {
	const i = active.indexOf(current);
	if (i < 0) return active[0] ?? current;
	return active[(i + 1) % active.length] ?? current;
}
var COLORS = [
	"red",
	"green",
	"yellow",
	"blue"
];
function cellKey(x, y) {
	return `${x},${y}`;
}
function Star({ x, y }) {
	const cx = x + .5;
	const cy = y + .5;
	const pts = Array.from({ length: 8 }, (_, i) => {
		const a = Math.PI / 4 * i - Math.PI / 2;
		const r = i % 2 === 0 ? .22 : .1;
		return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
	}).join(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: pts,
		fill: "var(--color-board-star)",
		opacity: "0.9"
	});
}
function BoardArt({ current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "-0.55 -0.55 16.1 16.1",
		className: "h-full w-full",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "ludo-wood",
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-board-wood-1)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "50%",
						stopColor: "var(--color-board-wood-2)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-board-wood-3)"
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "-0.5",
				y: "-0.5",
				width: "16",
				height: "16",
				rx: "0.55",
				fill: "url(#ludo-wood)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "-0.18",
				y: "-0.18",
				width: "15.36",
				height: "15.36",
				rx: "0.38",
				fill: "var(--color-board-inlay)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "0",
				y: "0",
				width: "15",
				height: "15",
				rx: "0.22",
				fill: "var(--color-board-felt)"
			}),
			COLORS.map((c) => {
				const [ox, oy] = YARD_ORIGIN[c];
				const on = current === c;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: ox + .18,
						y: oy + .18,
						width: "5.64",
						height: "5.64",
						rx: "0.42",
						fill: PLAYER_META[c].fill,
						opacity: on ? 1 : .92
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: ox + .46,
						y: oy + .46,
						width: "5.08",
						height: "5.08",
						rx: "0.3",
						fill: "none",
						stroke: PLAYER_META[c].ink,
						strokeOpacity: "0.28",
						strokeWidth: "0.08"
					}),
					[0, 1].flatMap((r) => [0, 1].map((col) => {
						const cx = ox + 1.5 + col * 3;
						const cy = oy + 1.5 + r * 3;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx,
							cy,
							r: "0.72",
							fill: PLAYER_META[c].ink,
							fillOpacity: "0.16",
							stroke: PLAYER_META[c].ink,
							strokeOpacity: "0.35",
							strokeWidth: "0.06"
						}, `${c}-${r}-${col}`);
					}))
				] }, c);
			}),
			PATH.map(([x, y], i) => {
				const owner = Object.entries(START_INDEX).find(([, idx]) => idx === i)?.[0];
				const fill = owner ? PLAYER_META[owner].fill : "var(--color-board-cell)";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x + .09,
					y: y + .09,
					width: "0.82",
					height: "0.82",
					rx: "0.12",
					fill,
					stroke: "var(--color-board-line)",
					strokeWidth: "0.03"
				}, `p-${i}`);
			}),
			COLORS.flatMap((c) => HOME_STRETCH[c].map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: x + .09,
				y: y + .09,
				width: "0.82",
				height: "0.82",
				rx: "0.12",
				fill: PLAYER_META[c].fill,
				opacity: .55 + i * .08
			}, `h-${c}-${i}`))),
			[...SAFE_INDICES].filter((i) => !Object.values(START_INDEX).includes(i)).map((i) => {
				const cell = PATH[i];
				if (!cell) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
					x: cell[0],
					y: cell[1]
				}, `s-${i}`);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "6,6 9,6 7.5,7.5",
				fill: PLAYER_META.green.fill
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "9,6 9,9 7.5,7.5",
				fill: PLAYER_META.yellow.fill
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "9,9 6,9 7.5,7.5",
				fill: PLAYER_META.blue.fill
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "6,9 6,6 7.5,7.5",
				fill: PLAYER_META.red.fill
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "7.5",
				cy: "7.5",
				r: "0.28",
				fill: "var(--color-board-inlay)"
			})
		]
	});
}
function useDisplayedSteps(logical, dest, captured) {
	const [shown, setShown] = (0, import_react.useState)(logical);
	(0, import_react.useEffect)(() => {
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
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(dest);
			return;
		}
		let current = logical;
		setShown(current);
		let raf = 0;
		let last = performance.now();
		const tick = (now) => {
			if (now - last >= 88) {
				current = Math.min(current + 1, dest);
				setShown(current);
				last = now;
			}
			if (current < dest) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		logical,
		dest,
		captured
	]);
	return shown;
}
function TokenPiece({ color, index, steps, dest, captured, canMove, stacked, stackTotal, onClick, disabled }) {
	const shown = useDisplayedSteps(steps, dest, captured);
	const [x, y] = cellOf(color, shown, index);
	let ox = 0;
	let oy = 0;
	if (stackTotal > 1 && shown >= 0) {
		const a = stacked / stackTotal * Math.PI * 2 - Math.PI / 2;
		ox = Math.cos(a) * .16;
		oy = Math.sin(a) * .16;
	}
	const left = (x + .5 + ox) / 15 * 100;
	const top = (y + .5 + oy) / 15 * 100;
	const meta = PLAYER_META[color];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": `${meta.label} token ${index + 1}`,
		disabled: disabled || !canMove,
		onClick,
		className: cn("absolute z-10 flex size-[6.4%] items-center justify-center rounded-full border-[1.5px] border-ivory/35 shadow-[0_2px_6px_rgba(20,14,8,0.45)] transition-[left,top] duration-100 ease-out", canMove && "z-20 cursor-pointer ring-2 ring-ivory/90 ring-offset-2 ring-offset-transparent", canMove && "animate-[ludo-pulse_1.4s_ease-in-out_infinite]", !canMove && "cursor-default"),
		style: {
			left: `${left}%`,
			top: `${top}%`,
			transform: "translate(-50%, -50%)",
			background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, ${meta.fill} 55%, white), ${meta.fill} 55%, color-mix(in oklab, ${meta.fill} 70%, var(--color-token-shade)))`
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "size-[38%] rounded-full opacity-70",
			style: { background: "radial-gradient(circle, rgba(255,255,255,0.7), transparent 70%)" }
		})
	});
}
function Board({ game, anim, legalTokens, onToken, interactive }) {
	const occupancy = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const color of game.active) game.tokens[color].forEach((steps, token) => {
			const cap = anim?.captures.find((c) => c.color === color && c.token === token);
			const shown = anim && anim.color === color && anim.token === token ? anim.from : cap ? cap.from : steps;
			const [x, y] = cellOf(color, shown, token);
			const k = cellKey(x, y);
			const list = map.get(k) ?? [];
			list.push({
				color,
				token
			});
			map.set(k, list);
		});
		return map;
	}, [game, anim]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-square w-full select-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardArt, { current: game.phase === "over" ? game.winner : game.current }), COLORS.filter((c) => game.active.includes(c)).flatMap((color) => game.tokens[color].map((steps, token) => {
			const moving = Boolean(anim && anim.color === color && anim.token === token);
			const cap = anim?.captures.find((c) => c.color === color && c.token === token);
			const base = cap ? cap.from : moving ? anim.from : steps;
			const [sx, sy] = cellOf(color, base, token);
			const stackList = occupancy.get(cellKey(sx, sy)) ?? [];
			const stacked = stackList.findIndex((t) => t.color === color && t.token === token);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokenPiece, {
				color,
				index: token,
				steps: base,
				dest: moving ? anim.to : null,
				captured: Boolean(cap),
				canMove: interactive && game.current === color && legalTokens.has(token),
				stacked: Math.max(0, stacked),
				stackTotal: stackList.length,
				disabled: !interactive,
				onClick: () => onToken(color, token)
			}, `${color}-${token}`);
		}))]
	});
}
var PIP_LAYOUT = {
	1: [[50, 50]],
	2: [[28, 28], [72, 72]],
	3: [
		[28, 28],
		[50, 50],
		[72, 72]
	],
	4: [
		[28, 28],
		[72, 28],
		[28, 72],
		[72, 72]
	],
	5: [
		[28, 28],
		[72, 28],
		[50, 50],
		[28, 72],
		[72, 72]
	],
	6: [
		[28, 26],
		[28, 50],
		[28, 74],
		[72, 26],
		[72, 50],
		[72, 74]
	]
};
function Face({ value }) {
	const pips = PIP_LAYOUT[value] ?? PIP_LAYOUT[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative size-full rounded-[22%] bg-dice text-dice-fg shadow-[inset_0_-6px_10px_rgba(40,28,16,0.12),inset_0_6px_8px_rgba(255,255,255,0.55)]",
		children: pips.map(([x, y], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute size-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dice-fg",
			style: {
				left: `${x}%`,
				top: `${y}%`
			}
		}, i))
	});
}
function Dice({ value, spinning, disabled, onRoll, label }) {
	const [shown, setShown] = (0, import_react.useState)(value ?? 1);
	(0, import_react.useEffect)(() => {
		if (!spinning) {
			setShown(value ?? 1);
			return;
		}
		let raf = 0;
		let last = 0;
		const tick = (now) => {
			if (now - last > 70) {
				setShown(1 + Math.floor(Math.random() * 6));
				last = now;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [spinning, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onRoll,
			disabled,
			"aria-label": label,
			className: cn("relative size-[5.5rem] sm:size-24 rounded-[1.35rem] p-[0.35rem]", "bg-surface-2 border border-border shadow-[0_10px_24px_rgba(12,10,8,0.35)]", "transition-[transform,opacity] duration-[var(--motion-quick)] ease-[var(--ease-out)]", "disabled:opacity-70", !disabled && "hover:brightness-110 active:scale-[0.97]", spinning && "animate-[ludo-roll_0.72s_ease-in-out]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { value: shown })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
			children: label
		})]
	});
}
function emptyTokens() {
	return {
		red: [
			-1,
			-1,
			-1,
			-1
		],
		green: [
			-1,
			-1,
			-1,
			-1
		],
		yellow: [
			-1,
			-1,
			-1,
			-1
		],
		blue: [
			-1,
			-1,
			-1,
			-1
		]
	};
}
function defaultSeats() {
	return [
		{
			color: "red",
			kind: "human"
		},
		{
			color: "green",
			kind: "ai-medium"
		},
		{
			color: "yellow",
			kind: "ai-medium"
		},
		{
			color: "blue",
			kind: "ai-medium"
		}
	];
}
function activeFromSeats(seats) {
	return seats.filter((s) => s.kind !== "off").map((s) => s.color);
}
function createGame(seats) {
	const active = activeFromSeats(seats);
	if (active.length < 2) throw new Error("Ludo needs at least two houses in play.");
	const current = active[0];
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
		turnCount: 1
	};
}
function houseName(seats, color) {
	if (seats.find((s) => s.color === color)?.kind === "human") return seats.filter((s) => s.kind === "human").length <= 1 ? "You" : PLAYER_META[color].label;
	return PLAYER_META[color].label;
}
function cloneGame(state) {
	return {
		seats: state.seats.map((s) => ({ ...s })),
		active: [...state.active],
		tokens: {
			red: [...state.tokens.red],
			green: [...state.tokens.green],
			yellow: [...state.tokens.yellow],
			blue: [...state.tokens.blue]
		},
		current: state.current,
		phase: state.phase,
		dice: state.dice,
		consecutiveSixes: state.consecutiveSixes,
		winner: state.winner,
		log: [...state.log],
		turnCount: state.turnCount
	};
}
function pushLog(state, line) {
	state.log = [...state.log, line].slice(-12);
}
function getLegalMoves(state, color, dice) {
	const moves = [];
	const steps = state.tokens[color];
	for (let token = 0; token < 4; token++) {
		const from = steps[token] ?? -1;
		if (from >= 56) continue;
		if (from === -1) {
			if (dice === 6) moves.push({
				token,
				from,
				to: 0
			});
			continue;
		}
		const to = from + dice;
		if (to > 56) continue;
		moves.push({
			token,
			from,
			to
		});
	}
	return moves;
}
function occupantsOnPath(state, global) {
	const found = [];
	for (const color of state.active) {
		const steps = state.tokens[color];
		for (let token = 0; token < 4; token++) {
			const s = steps[token] ?? -1;
			if (s < 0 || s > 50) continue;
			if (globalIndex(color, s) === global) found.push({
				color,
				token
			});
		}
	}
	return found;
}
function capturesAt(state, mover, to) {
	if (to < 0 || to > 50) return [];
	const global = globalIndex(mover, to);
	if (global == null || isSafeIndex(global)) return [];
	return occupantsOnPath(state, global).filter((o) => o.color !== mover).map((o) => ({
		color: o.color,
		token: o.token,
		from: state.tokens[o.color][o.token] ?? -1
	}));
}
function finishedCount(state, color) {
	return state.tokens[color].filter((s) => s >= 56).length;
}
function passTurn(state) {
	state.current = nextActive(state.active, state.current);
	state.phase = "rolling";
	state.dice = null;
	state.consecutiveSixes = 0;
	state.turnCount += 1;
}
function grantExtra(state) {
	state.phase = "rolling";
	state.dice = null;
}
function rollDie() {
	return 1 + Math.floor(Math.random() * 6);
}
/** Apply a rolled face. Mutates a clone — pass a cloned state or expect mutation. */
function applyRoll(state, face) {
	const events = {
		six: face === 6,
		captured: [],
		finished: false,
		extraTurn: false,
		forfeitedSixes: false,
		winner: null,
		skipped: false
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
	if (getLegalMoves(state, state.current, face).length === 0) {
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
function applyMove(state, token) {
	const events = {
		six: state.dice === 6,
		captured: [],
		finished: false,
		extraTurn: false,
		forfeitedSixes: false,
		winner: null,
		skipped: false
	};
	if (state.phase !== "picking" || state.dice == null || state.winner) return events;
	const color = state.current;
	const dice = state.dice;
	const move = getLegalMoves(state, color, dice).find((m) => m.token === token);
	if (!move) return events;
	const name = houseName(state.seats, color);
	const caps = capturesAt(state, color, move.to);
	for (const cap of caps) state.tokens[cap.color][cap.token] = -1;
	events.captured = caps;
	state.tokens[color][token] = move.to;
	events.finished = move.to >= 56;
	if (events.finished && finishedCount(state, color) >= 4) {
		state.winner = color;
		state.phase = "over";
		events.winner = color;
		pushLog(state, `${name} seats all four in the palace.`);
		return events;
	}
	if (caps.length) pushLog(state, `${name} sent ${[...new Set(caps.map((c) => houseName(state.seats, c.color)))].join(", ")} home.`);
	else if (events.finished) pushLog(state, `${name} reached the palace (${finishedCount(state, color)}/4).`);
	else if (move.from === -1) pushLog(state, `${name} entered the path.`);
	else pushLog(state, `${name} advanced ${dice}.`);
	const extra = dice === 6 || caps.length > 0 || events.finished;
	events.extraTurn = extra;
	if (dice === 6) state.consecutiveSixes += 1;
	else state.consecutiveSixes = 0;
	if (extra) grantExtra(state);
	else passTurn(state);
	return events;
}
function progress(state, color) {
	return state.tokens[color].filter((s) => s >= 56).length;
}
function pick(items) {
	return items[Math.floor(Math.random() * items.length)];
}
function dangerOn(state, color, steps) {
	if (steps < 0 || steps > 50) return 0;
	const g = globalIndex(color, steps);
	if (g == null || isSafeIndex(g)) return 0;
	let threat = 0;
	for (const other of state.active) {
		if (other === color) continue;
		for (const s of state.tokens[other]) {
			if (s < 0 || s > 50) continue;
			const og = globalIndex(other, s);
			if (og == null) continue;
			const dist = (g - og + 52) % 52;
			if (dist >= 1 && dist <= 6) threat += (s >= 40 ? 2.4 : 1) * ((7 - dist) / 6);
		}
	}
	return threat;
}
function tokenValue(steps) {
	if (steps >= 56) return 120;
	if (steps >= 51) return 70 + (steps - 51) * 8;
	if (steps < 0) return 0;
	return steps * 1.15;
}
function evaluate(state, me) {
	let score = 0;
	for (const color of state.active) {
		const sign = color === me ? 1 : -1;
		for (const s of state.tokens[color]) {
			score += sign * tokenValue(s);
			if (color === me && s >= 0 && s <= 50) score -= dangerOn(state, color, s) * 9;
		}
	}
	return score;
}
function scoreMove(state, move, difficulty) {
	const next = cloneGame(state);
	const events = applyMove(next, move.token);
	const me = state.current;
	let score = 0;
	if (move.from === -1) score += 48;
	if (move.to >= 56) score += 90;
	if (move.from < 51 && move.to >= 51) score += 36;
	if (events.captured.length) for (const cap of events.captured) {
		const victim = cap.from;
		score += 70 + Math.max(0, victim) * 1.4;
	}
	if (move.to >= 0 && move.to <= 50) {
		const g = globalIndex(me, move.to);
		if (g != null && isSafeIndex(g)) score += 18;
	}
	score -= dangerOn(state, me, move.from) * 2;
	score -= dangerOn(next, me, move.to) * 8;
	score += move.to * .4;
	if (difficulty === "ai-hard") {
		score += evaluate(next, me) * .35;
		if (events.extraTurn && move.to < 56) score += 8;
	}
	score += Math.random() * (difficulty === "ai-easy" ? 40 : difficulty === "ai-medium" ? 8 : 2);
	return score;
}
function chooseAiMove(state, kind) {
	if (state.dice == null) return null;
	const moves = getLegalMoves(state, state.current, state.dice);
	if (moves.length === 0) return null;
	if (kind === "ai-easy" || kind === "human" || kind === "off") {
		if (kind === "ai-easy") return pick(moves);
		return moves[0] ?? null;
	}
	let best = moves[0];
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
var ctx = null;
var master = null;
var sfx = null;
var unlocked = false;
var muted = false;
function ensure() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return null;
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfx = ctx.createGain();
		sfx.gain.value = .7;
		master.gain.value = muted ? 0 : .85;
		sfx.connect(master);
		master.connect(ctx.destination);
	}
	return ctx;
}
function unlockAudio() {
	const c = ensure();
	if (!c) return;
	if (c.state === "suspended") c.resume();
	unlocked = true;
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .85, ctx.currentTime, .02);
}
function envGain(c, peak, attack, release) {
	const g = c.createGain();
	const now = c.currentTime;
	g.gain.setValueAtTime(1e-4, now);
	g.gain.exponentialRampToValueAtTime(peak, now + attack);
	g.gain.exponentialRampToValueAtTime(1e-4, now + attack + release);
	return g;
}
function tone(freq, duration, type, peak = .12, detune = 0) {
	const c = ensure();
	if (!c || !sfx || muted) return;
	const osc = c.createOscillator();
	osc.type = type;
	osc.frequency.value = freq;
	osc.detune.value = detune;
	const g = envGain(c, peak, .008, duration);
	osc.connect(g);
	g.connect(sfx);
	osc.start();
	osc.stop(c.currentTime + duration + .05);
	osc.onended = () => {
		osc.disconnect();
		g.disconnect();
	};
}
function noise(duration, peak = .08, lpf = 1200) {
	const c = ensure();
	if (!c || !sfx || muted) return;
	const frames = Math.floor(c.sampleRate * duration);
	const buffer = c.createBuffer(1, frames, c.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
	const src = c.createBufferSource();
	src.buffer = buffer;
	const filter = c.createBiquadFilter();
	filter.type = "lowpass";
	filter.frequency.value = lpf;
	const g = envGain(c, peak, .004, duration * .9);
	src.connect(filter);
	filter.connect(g);
	g.connect(sfx);
	src.start();
	src.stop(c.currentTime + duration);
	src.onended = () => {
		src.disconnect();
		filter.disconnect();
		g.disconnect();
	};
}
function sfxDice() {
	if (!unlocked) return;
	noise(.18, .1, 1800);
	tone(180 + (Math.random() - .5) * 30, .12, "triangle", .08);
	setTimeout(() => tone(140, .08, "sine", .05), 90);
}
function sfxMove() {
	if (!unlocked) return;
	tone(420 + Math.random() * 50, .09, "sine", .07);
}
function sfxEnter() {
	if (!unlocked) return;
	tone(520, .1, "triangle", .08);
	tone(780, .14, "sine", .05);
}
function sfxCapture() {
	if (!unlocked) return;
	tone(320, .16, "sawtooth", .06);
	tone(180, .22, "triangle", .07);
}
function sfxFinish() {
	if (!unlocked) return;
	tone(523, .12, "sine", .08);
	setTimeout(() => tone(659, .12, "sine", .08), 70);
	setTimeout(() => tone(784, .18, "sine", .09), 140);
}
function sfxSix() {
	if (!unlocked) return;
	tone(880, .1, "triangle", .07);
	tone(1320, .16, "sine", .05);
}
function sfxWin() {
	if (!unlocked) return;
	[
		523,
		659,
		784,
		1046
	].forEach((n, i) => {
		setTimeout(() => tone(n, .22, "triangle", .09), i * 110);
	});
}
function sfxClick() {
	if (!unlocked) return;
	tone(700 + Math.random() * 40, .04, "square", .03);
}
function sfxForfeit() {
	if (!unlocked) return;
	tone(220, .2, "sine", .06);
	tone(160, .28, "triangle", .05);
}
if (typeof window !== "undefined") {
	const resume = () => {
		const c = ensure();
		if (c && c.state === "suspended") c.resume();
	};
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible") resume();
	});
}
var SAVE_KEY = "ludo-court-v1";
var SAVE_VERSION = 1;
var toastSeq = 1;
var persistTimer = null;
var rollTimer = null;
var animTimer = null;
function persistNow(slice) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(slice));
	} catch {}
}
function schedulePersist(get) {
	if (typeof window === "undefined") return;
	if (persistTimer) clearTimeout(persistTimer);
	persistTimer = setTimeout(() => {
		const s = get();
		persistNow({
			version: SAVE_VERSION,
			screen: s.screen,
			seats: s.seats,
			muted: s.muted,
			game: s.game?.phase === "over" ? null : s.resolved ?? s.game
		});
	}, 180);
}
function loadPersist() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed.version !== SAVE_VERSION) return null;
		return parsed;
	} catch {
		return null;
	}
}
function pushToast(set, text, tone) {
	const id = toastSeq++;
	set((s) => ({ toasts: [...s.toasts.slice(-3), {
		id,
		text,
		tone
	}] }));
	setTimeout(() => {
		set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
	}, 2200);
}
function kindOf(move) {
	if (move.from < 0) return "enter";
	if (move.to >= 56) return "finish";
	return "move";
}
function reducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function waitMs(from, to) {
	if (reducedMotion()) return 70;
	if (from < 0) return 300;
	const steps = Math.max(1, to - from);
	return Math.min(1100, 88 * steps + 70);
}
function playMoveSfx(move, events) {
	if (events.captured.length) sfxCapture();
	else if (events.finished) sfxFinish();
	else if (move.from < 0) sfxEnter();
	else sfxMove();
}
var useLudo = create((set, get) => ({
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
		setMuted(saved.muted);
		set({
			hydrated: true,
			seats: saved.seats?.length === 4 ? saved.seats : defaultSeats(),
			muted: saved.muted,
			screen: saved.game ? "play" : "setup",
			game: saved.game,
			resolved: saved.game
		});
	},
	setSeat: (color, kind) => {
		set((s) => {
			const next = s.seats.map((seat) => seat.color === color ? {
				...seat,
				kind
			} : seat);
			if (next.filter((x) => x.kind !== "off").length < 2) return s;
			return { seats: next };
		});
		schedulePersist(get);
	},
	setMuted: (muted) => {
		setMuted(muted);
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
			toasts: []
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
			toasts: []
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
			set({
				spinning: false,
				game: cloned,
				resolved: cloned
			});
			if (events.forfeitedSixes) {
				sfxForfeit();
				pushToast(set, "Three sixes — turn lost", "warn");
			} else if (events.six && !events.skipped) {
				sfxSix();
				pushToast(set, "Six", "six");
			} else if (events.skipped && events.six) pushToast(set, "Six — rolling again", "six");
			else if (events.skipped) pushToast(set, "No legal move", "neutral");
			const kind = cloned.seats.find((s) => s.color === cloned.current)?.kind;
			if (cloned.phase === "picking" && kind === "human") {
				const auto = getLegalMoves(cloned, cloned.current, face);
				if (auto.length === 1) window.setTimeout(() => get().pickToken(cloned.current, auto[0].token), 260);
			}
			schedulePersist(get);
		}, reducedMotion() ? 160 : 720);
	},
	pickToken: (color, token) => {
		const { game, anim, spinning } = get();
		if (!game || anim || spinning || game.phase !== "picking" || game.current !== color) return;
		const move = getLegalMoves(game, color, game.dice ?? 0).find((m) => m.token === token);
		if (!move) return;
		unlockAudio();
		const cloned = cloneGame(game);
		const events = applyMove(cloned, token);
		playMoveSfx(move, events);
		if (events.captured.length) pushToast(set, "Sent home", "capture");
		else if (events.finished) pushToast(set, "Seated in the palace", "home");
		if (events.winner) setTimeout(() => sfxWin(), waitMs(move.from, move.to) + 80);
		set({
			anim: {
				color,
				token,
				from: move.from,
				to: move.to,
				kind: kindOf(move),
				captures: events.captured
			},
			resolved: cloned
		});
		if (animTimer) clearTimeout(animTimer);
		animTimer = setTimeout(() => get().completeAnim(), waitMs(move.from, move.to));
	},
	completeAnim: () => {
		const { resolved, anim } = get();
		if (!anim) return;
		if (resolved) set({
			game: resolved,
			anim: null
		});
		else set({ anim: null });
		schedulePersist(get);
	}
}));
function currentKind(game) {
	if (!game) return "off";
	return game.seats.find((s) => s.color === game.current)?.kind ?? "off";
}
function canHumanAct(game, spinning, anim) {
	if (!game || spinning || anim || game.phase === "over") return false;
	return currentKind(game) === "human";
}
var SEAT_OPTIONS = [
	{
		kind: "off",
		label: "Out"
	},
	{
		kind: "human",
		label: "You"
	},
	{
		kind: "ai-easy",
		label: "Easy"
	},
	{
		kind: "ai-medium",
		label: "Medium"
	},
	{
		kind: "ai-hard",
		label: "Hard"
	}
];
function promptText(args) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-10 sm:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.22em] text-muted",
						children: "A four-house race"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl leading-[1.05] tracking-[-0.03em] text-balance text-foreground sm:text-5xl",
						children: "Ludo Court"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-pretty text-base leading-relaxed text-muted",
						children: "Bring four tokens home along a clockwise path. Six to enter, exact to finish, and no mercy on an open square."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-foreground",
						children: "Arrange the houses"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs tabular-nums text-subtle",
						children: [active, " in play"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: seats.map((seat) => {
						const meta = PLAYER_META[seat.color];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-3.5 rounded-full",
									style: { background: meta.fill },
									"aria-hidden": true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: meta.house
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-subtle",
									children: meta.label
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: SEAT_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: opt.kind === "off" && active <= 2 && seat.kind !== "off",
									onClick: () => setSeat(seat.color, opt.kind),
									className: cn("h-9 rounded-full px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]", seat.kind === opt.kind ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted hover:text-foreground"),
									children: opt.label
								}, opt.kind))
							})]
						}, seat.color);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "xl",
					onClick: () => startGame(),
					className: "min-h-12 w-full sm:w-auto",
					children: "Begin match"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					variant: "ghost",
					onClick: () => setRulesOpen(true),
					className: "w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {}), "How to play"]
				})]
			})
		]
	});
}
function PlayerRail({ game }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex gap-2 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0",
		children: game.seats.filter((s) => s.kind !== "off").map((seat) => {
			const meta = PLAYER_META[seat.color];
			const done = progress(game, seat.color);
			const on = game.current === seat.color && game.phase !== "over";
			const isHuman = seat.kind === "human";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex min-w-[9.5rem] flex-1 items-center gap-3 rounded-[var(--radius-lg)] border px-3 py-2.5 sm:min-w-0", on ? "border-accent/50 bg-surface-2" : "border-border bg-surface"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-9 shrink-0 place-items-center rounded-full",
					style: {
						background: meta.fill,
						color: meta.ink
					},
					children: isHuman ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium text-foreground",
						children: houseName(game.seats, seat.color)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs tabular-nums text-subtle",
						children: [
							done,
							"/4 home",
							on ? " · to play" : ""
						]
					})]
				})]
			}, seat.color);
		})
	});
}
function RulesDialog({ open, onClose }) {
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-overlay",
			"aria-label": "Close rules",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "rules-title",
			className: "relative z-10 w-full max-w-md rounded-t-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:rounded-[var(--radius-xl)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "rules-title",
					className: "font-display text-2xl tracking-[-0.02em] text-foreground",
					children: "How to play"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					onClick: onClose,
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "space-y-3 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Roll a six to bring a token from the yard onto your coloured start square." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tokens travel clockwise, then up your coloured column into the palace." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Landing on an opponent on an open square sends them home — stars and starts are safe." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "A six, a capture, or seating a token in the palace earns another roll." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Three sixes in a row forfeits the third roll." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You must land exactly on the palace. First house to seat all four wins." })
				]
			})]
		})]
	});
}
function WinBanner({ color, onAgain, onSetup }) {
	const meta = PLAYER_META[color];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "mx-auto size-8 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs uppercase tracking-[0.2em] text-muted",
					children: "Palace claimed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl tracking-[-0.03em] text-foreground",
					children: meta.house
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "All four tokens seated. The court is theirs."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onAgain,
						children: "Play again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: onSetup,
						children: "Rearrange"
					})]
				})
			]
		})
	});
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
	const legal = (0, import_react.useMemo)(() => game && !anim && !spinning ? legalMoves() : [], [
		game,
		anim,
		spinning,
		legalMoves
	]);
	const legalTokens = (0, import_react.useMemo)(() => new Set(legal.map((m) => m.token)), [legal]);
	(0, import_react.useEffect)(() => {
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
	}, [
		game,
		spinning,
		anim,
		kind,
		roll,
		pickToken
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === " " || e.code === "Space") {
				if (human && game?.phase === "rolling") {
					e.preventDefault();
					roll();
				}
			}
			if (e.key >= "1" && e.key <= "4" && human && game?.phase === "picking") pickToken(game.current, Number(e.key) - 1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		human,
		game,
		roll,
		pickToken
	]);
	if (!game) return null;
	const name = houseName(game.seats, game.current);
	const winnerName = game.winner ? houseName(game.seats, game.winner) : null;
	const prompt = promptText({
		spinning,
		anim: Boolean(anim),
		phase: game.phase,
		kind,
		name,
		winner: winnerName
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-6 sm:px-6 sm:py-6 lg:grid lg:grid-cols-[13.5rem_minmax(0,1fr)_11.5rem] lg:items-start",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 lg:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted",
					children: "Ludo Court"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl tracking-[-0.03em] text-foreground sm:text-2xl",
					children: prompt
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => setRulesOpen(true),
							"aria-label": "How to play",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: () => {
								unlockAudio();
								setMuted(!muted);
							},
							"aria-label": muted ? "Unmute" : "Mute",
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							onClick: returnToSetup,
							"aria-label": "New match",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerRail, { game }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto w-full max-w-[min(100%,72dvh)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, {
						game,
						anim,
						legalTokens: game.current && kind === "human" ? legalTokens : /* @__PURE__ */ new Set(),
						interactive: human && game.phase === "picking",
						onToken: pickToken
					}),
					game.winner && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinBanner, {
						color: game.winner,
						onAgain: () => startGame(seats),
						onSetup: returnToSetup
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute left-1/2 top-3 z-20 flex -translate-x-1/2 flex-col items-center gap-1",
						children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border bg-surface/95 px-3 py-1 text-xs font-medium text-foreground shadow-sm",
							children: t.text
						}, t.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col items-center gap-5 pb-[env(safe-area-inset-bottom)] lg:items-stretch lg:pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dice, {
					value: game.dice,
					spinning,
					disabled: !human || game.phase !== "rolling",
					onRoll: roll,
					label: human && game.phase === "rolling" ? "Tap to roll" : spinning ? "Rolling" : "Die"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs leading-relaxed text-subtle lg:block",
					children: "Space rolls. Keys 1–4 move a token when more than one can travel."
				})]
			})
		]
	});
}
function LudoApp() {
	const screen = useLudo((s) => s.screen);
	const hydrated = useLudo((s) => s.hydrated);
	const hydrate = useLudo((s) => s.hydrate);
	const rulesOpen = useLudo((s) => s.rulesOpen);
	const setRulesOpen = useLudo((s) => s.setRulesOpen);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const w = window;
		w.__ludo = () => {
			const s = useLudo.getState();
			return {
				screen: s.screen,
				phase: s.game?.phase,
				current: s.game?.current,
				dice: s.game?.dice,
				tokens: s.game?.tokens,
				spinning: s.spinning,
				winner: s.game?.winner
			};
		};
		return () => {
			delete w.__ludo;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-surface-2)_80%,transparent),transparent_55%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex min-h-dvh flex-1 flex-col",
				children: !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-background" }) : screen === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupScreen, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesDialog, {
				open: rulesOpen,
				onClose: () => setRulesOpen(false)
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LudoApp, {});
}
//#endregion
export { Home as component };
