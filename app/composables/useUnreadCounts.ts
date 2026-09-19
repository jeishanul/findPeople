import type { Conversation, NotificationItem } from '#shared/types/dashboard'

/**
 * Unread message/notification counts for the header icon badges — shared by
 * both `AppHeader.vue` and the dashboard topbar (`layouts/dashboard.vue`) so
 * neither duplicates its own fetch logic. Shares `useApi` keys with
 * `messages.vue`/`notifications.vue`, so opening the panel itself reuses the
 * same request instead of firing a second one.
 *
 * Only fetched once authenticated: login/logout always change the active
 * layout (dashboard <-> default), which remounts whichever header is
 * showing, so reading `session.isAuthenticated` once at setup time (via
 * `immediate`) is enough — no reactive re-fetch needed mid-mount.
 */
export function useUnreadCounts() {
  const session = useSession()

  const { data: conversations } = useApi<Conversation[]>('/dashboard/conversations', {
    key: 'dashboard-conversations',
    lazy: true,
    immediate: session.isAuthenticated.value,
    default: () => [],
  })
  const { data: notifications } = useApi<NotificationItem[]>('/dashboard/notifications', {
    key: 'dashboard-notifications',
    lazy: true,
    immediate: session.isAuthenticated.value,
    default: () => [],
  })

  const unreadMessages = computed(() => (conversations.value ?? []).filter(conversation => conversation.unread).length)
  const unreadNotifications = computed(() => (notifications.value ?? []).filter(item => !item.read).length)

  return {
    unreadMessages,
    unreadNotifications,
  }
}
