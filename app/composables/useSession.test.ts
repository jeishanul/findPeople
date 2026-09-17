import { describe, expect, it } from 'vitest'
import { useSession } from './useSession'

describe('useSession', () => {
  it('starts logged out, on the provider role, with no name', () => {
    const session = useSession()

    expect(session.isAuthenticated.value).toBe(false)
    expect(session.name.value).toBe('')
    expect(session.initials.value).toBe('')
    expect(session.activeRole.value).toBe('provider')
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
    session.setActiveRole('consumer')

    expect(session.activeRole.value).toBe('consumer')
    expect(session.isAuthenticated.value).toBe(true)
  })

  it('logout() de-authenticates without resetting the active role', () => {
    const session = useSession()

    session.login('Amara Chen')
    session.setActiveRole('consumer')
    session.logout()

    expect(session.isAuthenticated.value).toBe(false)
    expect(session.activeRole.value).toBe('consumer')
  })

  it('shares state across separate calls (single source of truth)', () => {
    const a = useSession()
    const b = useSession()

    a.login('Amara Chen')
    expect(b.isAuthenticated.value).toBe(true)
    expect(b.name.value).toBe('Amara Chen')
  })
})
