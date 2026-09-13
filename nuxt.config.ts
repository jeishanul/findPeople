import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-security',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
  ],
  devtools: { enabled: true },

  // Favicon matches the brand mark (green rounded square + white leaf, same
  // as the header/footer logo badge) — see public/favicon.svg. SVG first
  // (crisp at any size, modern browsers prefer it); PNG fallbacks for
  // browsers/contexts that don't support SVG favicons.
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  // --- SEO (@nuxtjs/seo: site-config, robots, sitemap, og-image, schema-org, seo-utils) ---
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3838',
    name: 'FindPeople',
    description: 'FindPeople',
    defaultLocale: 'en',
    indexable: process.env.NUXT_SITE_INDEXABLE === 'true',
  },

  // --- Theme toggle (AppHeader) ---
  // `classSuffix: ''` so the module toggles a plain `.dark`/`.light` class on
  // <html> — matches the `@custom-variant dark (&:where(.dark, .dark *))`
  // override in main.css (Tailwind v4's class-based dark mode). The module
  // injects a blocking inline script (before hydration) that reads
  // `storageKey` from localStorage and applies the class immediately, so
  // there's no flash of the wrong theme on refresh even though this is
  // localStorage — not cookie — backed. `preference: 'system'` is the
  // *initial* value only; picking light/dark explicitly (see
  // ThemeToggle.vue) overrides it from then on, persisted under this key.
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'color-mode',
  },

  // --- Hybrid rendering defaults; extend per-route as pages are added ---
  // `/` and `/providers/**` deliberately stay plain SSR, not `isr`: isr's
  // route-caching layer serves those pages through the same payload-
  // extraction path as a prerendered route, but this app never prerenders
  // them — the client then requests a `_payload.json` that was never
  // written, which 404s and produces a hydration mismatch on every load.
  // Reproduced and confirmed by removing `isr` here. Revisit only after
  // confirming that payload actually gets generated (e.g. after a real
  // `nuxt generate`/CDN-backed cache storage), not just in local preview.
  routeRules: {},

  devServer: {
    port: 3838,
  },

  // Opt in to Nuxt 4 defaults everywhere (app/ srcDir, normalized page names, etc.)
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    defaults: {
      nuxtLink: { prefetch: true, prefetchOn: { visibility: true } },
      useAsyncData: { deep: true },
    },
  },
  compatibilityDate: '2025-07-15',

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    // Full type-checking runs via `npm run typecheck` (CI/pre-commit), not on every dev/build for speed.
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        noImplicitOverride: true,
        noFallthroughCasesInSwitch: true,
        forceConsistentCasingInFileNames: true,
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
    },
  },

  // --- i18n: architecture ready for multiple locales; only `en` is active. ---
  // `prefix_except_default` keeps English at clean unprefixed URLs (/about) while
  // any future locale gets its own prefix (/fr/about) — adding a locale is just adding
  // an entry to `locales` + a message file, no routing/URL rework needed.
  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3838',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
    ],
    // Inert with a single locale; wired correctly now so adding a second locale doesn't
    // require revisiting this. Root-only redirect keeps explicit locale URLs stable and
    // indexable (redirecting on every route would confuse crawlers and split link equity).
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },

  image: {
    // Add third-party providers here (cloudinary, ipx, etc.) as the project grows.
    quality: 80,
    format: ['avif', 'webp'],
  },

  robots: {
    blockNonSeoBots: true,
    // 2026 baseline: explicit policy for AI crawlers/trainers (GPTBot, ClaudeBot, etc.)
    // rather than leaving it to each bot's default behavior. Flip to `false` per-bot
    // in `groups` if this site wants to opt in to AI training/answer engines.
    blockAiBots: true,
  },

  // Security headers (CSP, HSTS, X-Frame-Options, etc.) via nuxt-security.
  // Using the module's defaults for everything except CORS: the module's own
  // default binds `corsHandler.origin` to the *dev server* URL even in a
  // production build, which never matches a real deployed domain. Bind it to
  // our actual site URL explicitly instead of relying on that mismatch.
  security: {
    corsHandler: {
      origin: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3838',
    },
  },

  // `nuxt-seo-utils` (bundled in @nuxtjs/seo) auto-mirrors OG tags into
  // `twitter:card` etc. by default — unhead's own dev-time SEO lint then
  // flags every one of those as deprecated ("use Open Graph metadata
  // instead"). Open Graph tags alone cover every modern platform's preview,
  // so turn the Twitter-specific mirroring off rather than silence the warning.
  seo: {
    automaticTwitterTags: false,
  },
})
