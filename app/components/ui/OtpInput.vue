<script setup lang="ts">
// Auto-imported as <UiOtpInput/>. A row of single-digit boxes for a numeric
// verification code: typing a digit auto-advances to the next box, Backspace
// clears the current box first and then walks back clearing as it goes, the
// arrow keys move focus without editing, and pasting a full code distributes
// it across every box in one go.
const props = withDefaults(
  defineProps<{
    length?: number
    disabled?: boolean
    ariaLabel?: string
  }>(),
  { length: 6, disabled: false, ariaLabel: undefined },
)

const emit = defineEmits<{
  complete: [code: string]
}>()

const model = defineModel<string>({ default: '' })

const digits = ref<string[]>(Array.from({ length: props.length }, () => ''))
const inputRefs = useTemplateRef<HTMLInputElement[]>('inputRefs')

// Keep boxes in sync when the parent clears/replaces the model itself (e.g.
// resetting it after "Resend code") — but skip the no-op round-trip from our
// own `sync()` write below, which would otherwise fight the DOM mid-edit.
watch(() => model.value, (value) => {
  if (value === digits.value.join('')) return
  digits.value = Array.from({ length: props.length }, (_, i) => value[i] ?? '')
})

function sync() {
  const code = digits.value.join('')
  model.value = code
  if (code.length === props.length) emit('complete', code)
}

function focusInput(index: number) {
  inputRefs.value?.[index]?.focus()
}

function onInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const digit = target.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = digit
  target.value = digit
  sync()
  if (digit && index < props.length - 1) focusInput(index + 1)
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusInput(index - 1)
    return
  }
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault()
    focusInput(index + 1)
    return
  }
  if (event.key !== 'Backspace') return
  // A filled box just clears itself via the native edit → `onInput` above.
  // Only once it's already empty does Backspace walk back a box.
  if (digits.value[index]) return
  if (index === 0) return
  event.preventDefault()
  digits.value[index - 1] = ''
  sync()
  focusInput(index - 1)
}

// Each box needs its own accessible name (not just the group's) — built from
// the caller-supplied `ariaLabel` rather than a hardcoded word here, since a
// generic `ui/` atom must not invent user-facing text (see CLAUDE.md i18n).
function digitAriaLabel(index: number) {
  return props.ariaLabel ? `${props.ariaLabel} ${index + 1}` : String(index + 1)
}

function onPaste(event: ClipboardEvent) {
  const clean = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, props.length)
  if (!clean) return
  event.preventDefault()
  digits.value = Array.from({ length: props.length }, (_, i) => clean[i] ?? '')
  sync()
  focusInput(Math.min(clean.length, props.length - 1))
}
</script>

<template>
  <div
    role="group"
    :aria-label="ariaLabel"
    class="flex gap-2.5"
  >
    <input
      v-for="(digit, index) in digits"
      :key="index"
      ref="inputRefs"
      :value="digit"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      :disabled="disabled"
      :aria-label="digitAriaLabel(index)"
      class="h-14 w-12 rounded-xl border border-black/10 bg-white text-center text-xl font-bold text-black outline-none focus:border-brand-500 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
      @input="onInput(index, $event)"
      @keydown="onKeydown(index, $event)"
      @paste="onPaste"
    >
  </div>
</template>
