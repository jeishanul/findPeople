// @ts-check
import vueA11y from 'eslint-plugin-vuejs-accessibility'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  vueA11y.configs['flat/recommended'],
  {
    settings: {
      // Lets import/no-relative-parent-imports actually resolve .ts/.vue files with
      // implicit extensions — without this the rule silently no-ops.
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      // Enforce this project's architecture conventions.
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/block-lang': ['error', { script: { lang: 'ts' } }],
      'vue/multi-word-component-names': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Default `required: {every: ['nesting','id']}` assumes a native
      // `<label><input></label>` pattern. This codebase pairs labels with
      // custom form-control components (UiInput, etc.) via id/for as
      // siblings, not DOM nesting — the rule can't see across component
      // boundaries either way, so only requiring `for` is what's actually
      // checkable here; the real association still has to be correct by hand.
      'vuejs-accessibility/label-has-for': ['error', { required: 'id' }],
      // Force Nuxt aliases (~, ~~, #shared, #server) for anything crossing a directory
      // boundary — only same-folder `./sibling` relative imports are allowed.
      'import/no-relative-parent-imports': 'error',
    },
  },
)
