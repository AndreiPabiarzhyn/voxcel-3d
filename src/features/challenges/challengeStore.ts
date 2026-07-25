import { create } from 'zustand'

const COMPLETED_STORAGE_KEY = 'voxcel:completed-challenges'

function loadCompleted(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function saveCompleted(ids: string[]) {
  try {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Quota exceeded or storage disabled — losing the completed badge
    // silently beats crashing the editor over it.
  }
}

interface ChallengeState {
  activeChallengeId: string | null
  completedChallengeIds: string[]
  panelOpen: boolean
  hintVisible: boolean
  startChallenge: (id: string) => void
  exitChallenge: () => void
  completeChallenge: (id: string) => void
  openPanel: () => void
  closePanel: () => void
  toggleHint: () => void
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  activeChallengeId: null,
  completedChallengeIds: loadCompleted(),
  panelOpen: false,
  // Whether the ChallengeGhost overlay is currently shown — the lightbulb
  // button in the HUD toggles this so a kid can hide the answer and test
  // themselves. Always reset to visible when a (re)started, so it's never
  // stuck hidden from a previous attempt.
  hintVisible: true,
  startChallenge: (id) => set({ activeChallengeId: id, panelOpen: false, hintVisible: true }),
  exitChallenge: () => set({ activeChallengeId: null }),
  completeChallenge: (id) => {
    if (get().completedChallengeIds.includes(id)) return
    const next = [...get().completedChallengeIds, id]
    saveCompleted(next)
    set({ completedChallengeIds: next })
  },
  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
  toggleHint: () => set((state) => ({ hintVisible: !state.hintVisible })),
}))
