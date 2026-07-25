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
  startChallenge: (id: string) => void
  exitChallenge: () => void
  completeChallenge: (id: string) => void
  openPanel: () => void
  closePanel: () => void
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  activeChallengeId: null,
  completedChallengeIds: loadCompleted(),
  panelOpen: false,
  startChallenge: (id) => set({ activeChallengeId: id, panelOpen: false }),
  exitChallenge: () => set({ activeChallengeId: null }),
  completeChallenge: (id) => {
    if (get().completedChallengeIds.includes(id)) return
    const next = [...get().completedChallengeIds, id]
    saveCompleted(next)
    set({ completedChallengeIds: next })
  },
  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
}))
