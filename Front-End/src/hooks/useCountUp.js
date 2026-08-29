import { useEffect, useState } from "react";

/** Anima un número desde 0 (o from) hasta `to` en `durationMs`. */
export default function useCountUp(to, { durationMs = 900, enabled = true, from = 0 } = {}) {
  const [value, setValue] = useState(enabled ? from : to);

  useEffect(() => {
    if (!enabled) {
      setValue(to);
      return undefined;
    }

    let raf = 0;
    const start = performance.now();
    const target = Number(to) || 0;
    const origin = Number(from) || 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(origin + (target - origin) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs, enabled, from]);

  return value;
}
