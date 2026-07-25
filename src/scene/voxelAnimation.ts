export const PLACE_DURATION_MS = 220
export const PAINT_PULSE_DURATION_MS = 220
export const ERASE_DURATION_MS = 160

/** Overshoots past 1 before settling — a little playful "pop" on placement. */
export function easeOutBack(t: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
