import type { ContentItem, ContentSectionKey } from '#shared/types/marketplace'

export default defineEventHandler((event): Promise<ContentItem[]> => {
  const section = getRouterParam(event, 'section') as ContentSectionKey

  return callApi<ContentItem[]>(event, `/content/${section}`)
})
