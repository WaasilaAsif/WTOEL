import { useCallback, useRef } from "react";

function tone(context, frequency, duration, type = "sine", volume = 0.05) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

export function useSound(enabled = true) {
  const ref = useRef(null);

  const getContext = useCallback(() => {
    if (!enabled) return null;
    if (!ref.current) {
      ref.current = new window.AudioContext();
    }
    return ref.current;
  }, [enabled]);

  const playSuccess = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, 660, 0.12, "triangle", 0.08);
    setTimeout(() => tone(ctx, 880, 0.16, "triangle", 0.05), 80);
  }, [getContext]);

  const playFail = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, 200, 0.2, "sawtooth", 0.06);
  }, [getContext]);

  return { playSuccess, playFail };
}
