import { beforeEach, describe, expect, it } from 'vitest'
import { useSession } from './useSession'

describe('useSession', () => {
  // `activeRole` persists via `useLocalStorage`, not `useState` — reset it
  // between tests so one test's `setActiveRole()` can't leak into the next.
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts logged out, on the consumer role, with no name', () => {
    const session = useSession()

    expect(session.isAuthenticated.value).toBe(false)
    expect(session.name.value).toBe('')
    expect(session.initials.value).toBe('')
    expect(session.activeRole.value).toBe('consumer')
  })

  it('login() authenticates and derives initials from the name', () => {
    const session = useSession()

    session.login('Amara Chen')

    expect(session.isAuthenticated.value).toBe(true)
    expect(session.name.value).toBe('Amara Chen')
    expect(session.initials.value).toBe('AC')
  })

  it('derives initials from a single-word name without throwing', () => {
    const session = useSession()

    session.login('Cher')

    expect(session.initials.value).toBe('C')
  })

  it('setActiveRole() switches roles without logging out', () => {
    const session = useSession()

    session.login('Amara Chen')
    session.setActiveRole('provider')

    expect(session.activeRole.value).toBe('provider')
    expect(session.isAuthenticated.value).toBe(true)
  })

  it('logout() de-authenticates without resetting the active role', () => {
    const session = useSession()

    session.login('Amara Chen')
    session.setActiveRole('provider')
    session.logout()

    expect(session.isAuthenticated.value).toBe(false)
    expect(session.activeRole.value).toBe('provider')
  })

  it('persists the active role across separate useSession() calls (survives a reload)', async () => {
    const a = useSession()
    a.setActiveRole('provider')
    // `useLocalStorage` flushes its write on the next tick, same as a real
    // reload always has a task-queue boundary before the page re-reads it.
    await nextTick()

    const b = useSession()
    expect(b.activeRole.value).toBe('provider')
  })

  it('shares state across separate calls (single source of truth)', () => {
    const a = useSession()
    const b = useSession()

    a.login('Amara Chen')
    expect(b.isAuthenticated.value).toBe(true)
    expect(b.name.value).toBe('Amara Chen')
  })
})
