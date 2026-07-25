import { create } from 'zustand'

export interface ToastMessage {
  id: string
  text: string
  tone: 'info' | 'error' | 'success'
}

interface ToastState {
  toasts: ToastMessage[]
  show: (text: string, tone?: ToastMessage['tone']) => void
  dismiss: (id: string) => void
}

const TOAST_DURATION_MS = 3200

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (text, tone = 'info') => {
    const id = createId()
    set((state) => ({ toasts: [...state.toasts, { id, text, tone }] }))
    setTimeout(() => get().dismiss(id), TOAST_DURATION_MS)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
