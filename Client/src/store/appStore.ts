import { create } from 'zustand'

interface AppState {
  // UI State
  sidebarOpen: boolean
  modalOpen: boolean
  currentModal: string | null

  // Notifications
  notifications: Notification[]

  // Loading states
  globalLoading: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  openModal: (modalId: string) => void
  closeModal: () => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  setGlobalLoading: (loading: boolean) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  currentModal: null,
  notifications: [],
  globalLoading: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

  openModal: (modalId: string) => set({ modalOpen: true, currentModal: modalId }),

  closeModal: () => set({ modalOpen: false, currentModal: null }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: crypto.randomUUID() }
      ]
    })),

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  setGlobalLoading: (loading: boolean) => set({ globalLoading: loading }),
}))
