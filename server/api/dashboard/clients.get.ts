import type { ClientServed } from '#shared/types/dashboard'

export default defineEventHandler((): ClientServed[] => {
  return getClientsServed()
})
