# Global Store Documentation

This directory contains the Zustand-based global state management for the Oglasnik application.

## Stores

### 1. `authStore` - Authentication State
Manages user authentication, login, signup, and user session.

**State:**
- `user`: Current user object or null
- `isAuthenticated`: Boolean indicating auth status
- `isLoading`: Loading state for auth operations
- `error`: Error message if any

**Actions:**
- `signIn(email, password)`: Sign in a user
- `signUp(email, password, name?)`: Register a new user
- `signOut()`: Sign out the current user
- `clearError()`: Clear error messages
- `setUser(user)`: Manually set user state

**Persistence:** User data is persisted to localStorage

### 2. `appStore` - Application UI State
Manages global UI state like modals, notifications, sidebars.

**State:**
- `sidebarOpen`: Sidebar visibility
- `modalOpen`: Modal visibility
- `currentModal`: Current modal ID
- `notifications`: Array of notifications
- `globalLoading`: Global loading state

**Actions:**
- `toggleSidebar()`: Toggle sidebar
- `setSidebarOpen(open)`: Set sidebar state
- `openModal(modalId)`: Open a specific modal
- `closeModal()`: Close current modal
- `addNotification(notification)`: Add a notification
- `removeNotification(id)`: Remove a notification
- `setGlobalLoading(loading)`: Set global loading state

## Usage Examples

### Basic Usage

```tsx
import { useAuthStore } from '@/store'

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuthStore()

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  )
}
```

### Using Multiple Stores

```tsx
import { useAuthStore, useAppStore } from '@/store'

function Header() {
  const user = useAuthStore((state) => state.user)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  return (
    <header>
      <button onClick={toggleSidebar}>Menu</button>
      <p>{user?.name}</p>
    </header>
  )
}
```

### Optimized Selector (prevents unnecessary re-renders)

```tsx
// ❌ Bad: Re-renders on any auth state change
const authStore = useAuthStore()

// ✅ Good: Only re-renders when user changes
const user = useAuthStore((state) => state.user)
```

### Using Actions

```tsx
import { useAuthStore } from '@/store'

function SignInForm() {
  const { signIn, isLoading, error } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <input type="email" />
      <input type="password" />
      <button disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### Notifications Example

```tsx
import { useAppStore } from '@/store'

function MyComponent() {
  const addNotification = useAppStore((state) => state.addNotification)

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      message: 'Operation completed successfully!',
      duration: 3000
    })
  }

  return <button onClick={handleSuccess}>Do Something</button>
}
```

### Outside React Components

```tsx
import { useAuthStore } from '@/store'

// Get state
const user = useAuthStore.getState().user

// Call actions
useAuthStore.getState().signOut()

// Subscribe to changes
const unsubscribe = useAuthStore.subscribe(
  (state) => state.user,
  (user) => console.log('User changed:', user)
)
```

## Adding New Stores

1. Create a new file in `src/store/` (e.g., `listingsStore.ts`)
2. Define your interface and create the store:

```tsx
import { create } from 'zustand'

interface ListingsState {
  listings: Listing[]
  fetchListings: () => Promise<void>
}

export const useListingsStore = create<ListingsState>((set) => ({
  listings: [],
  fetchListings: async () => {
    const data = await fetch('/api/listings').then(r => r.json())
    set({ listings: data })
  }
}))
```

3. Export from `src/store/index.ts`:

```tsx
export { useListingsStore } from './listingsStore'
```

## Best Practices

1. **Selector optimization**: Only select the state you need
2. **Separate concerns**: Keep auth, UI, and data stores separate
3. **TypeScript**: Always type your stores properly
4. **Actions in store**: Keep business logic in store actions, not components
5. **Persistence**: Use `persist` middleware only for data that should survive refreshes
6. **Server state**: Consider using TanStack Query for server data instead

## Migrating from Context

The existing `ThemeContext` can remain as-is or be migrated to Zustand. Both approaches work well for different use cases.
