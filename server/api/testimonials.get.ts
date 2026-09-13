import type { Testimonial } from '#shared/types/marketplace'

export default defineEventHandler((): Testimonial[] => {
  return getTestimonials()
})
