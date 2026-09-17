import type { DashboardSummary, UserRole } from '#shared/types/dashboard'

export default defineEventHandler((event): DashboardSummary => {
  const query = getQuery(event)
  const role: UserRole = query.role === 'consumer' ? 'consumer' : 'provider'

  return getDashboardSummary(role)
})
