import type { Testimonial } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<Testimonial[]> => {
  return callApi<Testimonial[]>(event, '/testimonials')
})
