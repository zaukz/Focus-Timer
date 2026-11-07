type AudioCtorType = typeof AudioContext;

function AudioCtor(): AudioCtorType | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioCtorType }).webkitAudioContext ??
    null
  );
}

let shared: AudioContext | null = null;

/** Lazily create (and resume) the single shared audio context. */
export function audioContext(): AudioContext | null {
  const Ctor = AudioCtor();
  if (!Ctor) return null;
  if (!shared) {
    try {
      shared = new Ctor();
    } catch {
      return null;
    }
  }
  if (shared.state === 'suspended') {
    void shared.resume().catch(() => undefined);
  }
  return shared;
}

/** Call from a user gesture so later timer sounds are allowed to play. */
export function unlockAudio(): void {
  const ctx = audioContext();
  if (ctx && ctx.state === 'suspended') {
    void ctx.resume().catch(() => undefined);
  }
}

/** Soft, slow completion chime. */
export function playChime(volume = 1): void {
  const ctx = audioContext();
  if (!ctx) return;
  const start = ctx.currentTime + 0.03;
  const master = ctx.createGain();
  master.gain.value = 0.2 * Math.min(1, Math.max(0, volume));
  master.connect(ctx.destination);

  const notes = [
    { frequency: 523.25, at: 0, level: 0.9 },
    { frequency: 659.25, at: 0.17, level: 0.72 },
    { frequency: 783.99, at: 0.34, level: 0.6 },
    { frequency: 1046.5, at: 0.56, level: 0.34 },
  ];

  for (const note of notes) {
    const time = start + note.at;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = note.frequency;

    const shimmer = ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = note.frequency * 2.002;

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.0001, time);
    oscGain.gain.exponentialRampToValueAtTime(note.level, time + 0.035);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.1);

    const shimmerGain = ctx.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, time);
    shimmerGain.gain.exponentialRampToValueAtTime(note.level * 0.12, time + 0.05);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 4200;

    osc.connect(oscGain);
    shimmer.connect(shimmerGain);
    oscGain.connect(lowpass);
    shimmerGain.connect(lowpass);
    lowpass.connect(master);

    osc.start(time);
    shimmer.start(time);
    osc.stop(time + 2.2);
    shimmer.stop(time + 1.7);
  }

  window.setTimeout(() => master.disconnect(), 3600);
}

/** Quiet clock tick used by the optional ticking sound. */
export function playTick(volume = 1): void {
  const ctx = audioContext();
  if (!ctx) return;
  const time = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 1180;
  const env = ctx.createGain();
  const level = 0.03 * Math.min(1, Math.max(0, volume));
  env.gain.setValueAtTime(0.0001, time);
  env.gain.exponentialRampToValueAtTime(Math.max(0.0002, level), time + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.08);
  osc.onended = () => {
    osc.disconnect();
    env.disconnect();
  };
}
