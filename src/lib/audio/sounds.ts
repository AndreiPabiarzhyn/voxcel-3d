// Small synthesized sound effects via the Web Audio API — no audio files
// to source, license or load. Every export here is tied to a discrete
// user action (a click), never to a component mount or prop change, so
// loading a saved project or replaying history through undo/redo doesn't
// fire a wall of sound for every voxel at once.
//
// Kept deliberately soft: sine waves only (no square/sawtooth — rich in
// harsh high harmonics), a gentle ~20ms attack instead of an instant
// click, and a lowpass filter rounding off whatever edge is left.

let audioContext: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null

  if (!audioContext) audioContext = new AudioContextClass()
  // Browsers suspend contexts created before a user gesture — every call
  // site here runs inside a click handler, so resuming is always safe.
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

interface Tone {
  frequency: number
  duration: number
  gain?: number
}

function playTone({ frequency, duration, gain = 0.11 }: Tone, delay = 0) {
  const ctx = getContext()
  if (!ctx) return
  const startTime = ctx.currentTime + delay

  const oscillator = ctx.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startTime)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2200, startTime)

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  oscillator.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.03)
}

/** Soft rising two-note "ding" — placing a block. */
export function playPlaceSound() {
  playTone({ frequency: 659.25, duration: 0.1, gain: 0.11 }) // E5
  playTone({ frequency: 783.99, duration: 0.13, gain: 0.09 }, 0.035) // G5
}

/** Single gentle note — recoloring a block. */
export function playPaintSound() {
  playTone({ frequency: 880, duration: 0.12, gain: 0.08 }) // A5
}

/** Soft falling two-note "away it goes" — removing a block. */
export function playEraseSound() {
  playTone({ frequency: 392, duration: 0.11, gain: 0.09 }) // G4
  playTone({ frequency: 329.63, duration: 0.14, gain: 0.07 }, 0.04) // E4
}

/** Low, brief and quiet — undo. */
export function playUndoSound() {
  playTone({ frequency: 587.33, duration: 0.07, gain: 0.07 }) // D5
}

/** A touch higher than undo — redo. */
export function playRedoSound() {
  playTone({ frequency: 698.46, duration: 0.07, gain: 0.07 }) // F5
}

/** Small rising major-chord fanfare — finishing a challenge. */
export function playChallengeCompleteSound() {
  playTone({ frequency: 523.25, duration: 0.14, gain: 0.11 }) // C5
  playTone({ frequency: 659.25, duration: 0.14, gain: 0.11 }, 0.09) // E5
  playTone({ frequency: 783.99, duration: 0.18, gain: 0.11 }, 0.18) // G5
  playTone({ frequency: 1046.5, duration: 0.24, gain: 0.1 }, 0.27) // C6
}
