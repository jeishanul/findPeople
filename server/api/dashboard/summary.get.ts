import type { DashboardSummary, UserRole } from '#shared/types/dashboard'

export default defineEventHandler((event): Promise<DashboardSummary> => {
  const query = getQuery(event)
  const role: UserRole = query.role === 'consumer' ? 'consumer' : 'provider'

  return callApi<DashboardSummary>(event, '/dashboard/summary', { query: { role } })
})
