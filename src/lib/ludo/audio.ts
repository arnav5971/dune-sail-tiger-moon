let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let unlocked = false;
let muted = false;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    sfx.gain.value = 0.7;
    master.gain.value = muted ? 0 : 0.85;
    sfx.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  unlocked = true;
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.85, ctx.currentTime, 0.02);
  }
}

export function isMuted() {
  return muted;
}

function envGain(c: AudioContext, peak: number, attack: number, release: number): GainNode {
  const g = c.createGain();
  const now = c.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(peak, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
  return g;
}

function tone(freq: number, duration: number, type: OscillatorType, peak = 0.12, detune = 0) {
  const c = ensure();
  if (!c || !sfx || muted) return;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const g = envGain(c, peak, 0.008, duration);
  osc.connect(g);
  g.connect(sfx);
  osc.start();
  osc.stop(c.currentTime + duration + 0.05);
  osc.onended = () => {
    osc.disconnect();
    g.disconnect();
  };
}

function noise(duration: number, peak = 0.08, lpf = 1200) {
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
  const g = envGain(c, peak, 0.004, duration * 0.9);
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

export function sfxDice() {
  if (!unlocked) return;
  noise(0.18, 0.1, 1800);
  const jitter = (Math.random() - 0.5) * 30;
  tone(180 + jitter, 0.12, "triangle", 0.08);
  setTimeout(() => tone(140, 0.08, "sine", 0.05), 90);
}

export function sfxMove() {
  if (!unlocked) return;
  const f = 420 + Math.random() * 50;
  tone(f, 0.09, "sine", 0.07);
}

export function sfxEnter() {
  if (!unlocked) return;
  tone(520, 0.1, "triangle", 0.08);
  tone(780, 0.14, "sine", 0.05);
}

export function sfxCapture() {
  if (!unlocked) return;
  tone(320, 0.16, "sawtooth", 0.06);
  tone(180, 0.22, "triangle", 0.07);
}

export function sfxFinish() {
  if (!unlocked) return;
  tone(523, 0.12, "sine", 0.08);
  setTimeout(() => tone(659, 0.12, "sine", 0.08), 70);
  setTimeout(() => tone(784, 0.18, "sine", 0.09), 140);
}

export function sfxSix() {
  if (!unlocked) return;
  tone(880, 0.1, "triangle", 0.07);
  tone(1320, 0.16, "sine", 0.05);
}

export function sfxWin() {
  if (!unlocked) return;
  const notes = [523, 659, 784, 1046];
  notes.forEach((n, i) => {
    setTimeout(() => tone(n, 0.22, "triangle", 0.09), i * 110);
  });
}

export function sfxClick() {
  if (!unlocked) return;
  tone(700 + Math.random() * 40, 0.04, "square", 0.03);
}

export function sfxForfeit() {
  if (!unlocked) return;
  tone(220, 0.2, "sine", 0.06);
  tone(160, 0.28, "triangle", 0.05);
}

if (typeof window !== "undefined") {
  const resume = () => {
    const c = ensure();
    if (c && c.state === "suspended") void c.resume();
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resume();
  });
}
