@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at 10% 10%, rgba(216, 166, 64, .18), transparent 28%),
    radial-gradient(circle at 90% 15%, rgba(92, 168, 255, .10), transparent 25%),
    #07070a;
  color: #fff6e8;
}

.card {
  @apply rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur;
}

.input {
  @apply w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-cream outline-none transition focus:border-gold/70 focus:ring-4 focus:ring-gold/10;
}

.label {
  @apply text-sm font-bold text-muted;
}

.btn-primary {
  @apply inline-flex items-center justify-center rounded-full bg-gradient-to-r from-goldLight to-gold px-5 py-3 font-black text-black transition hover:-translate-y-0.5;
}

.btn-secondary {
  @apply inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-5 py-3 font-bold text-cream transition hover:border-gold/40;
}

.status {
  @apply rounded-full px-3 py-1 text-xs font-black;
}

.status-pending {
  @apply border border-yellow-300/30 bg-yellow-300/10 text-yellow-200;
}

.status-confirmed {
  @apply border border-green-300/30 bg-green-300/10 text-green-200;
}

.status-rejected {
  @apply border border-red-300/30 bg-red-300/10 text-red-200;
}

.status-completed {
  @apply border border-blue-300/30 bg-blue-300/10 text-blue-200;
}

.status-no_show {
  @apply border border-purple-300/30 bg-purple-300/10 text-purple-200;
}

.input-wrap {
  @apply flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-cream outline-none transition focus-within:border-gold/70 focus-within:ring-4 focus-within:ring-gold/10;
}

.input-wrap svg {
  @apply shrink-0 text-goldLight;
}

.input-wrap input,
.input-wrap select {
  @apply w-full bg-transparent text-cream outline-none;
}

.input-wrap option {
  color: #111;
}

.slot-button {
  @apply inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-sm font-black text-cream transition hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/10;
}

.slot-active {
  @apply border-gold/70 bg-gold text-black shadow-glow;
}

.slot-disabled {
  @apply cursor-not-allowed border-red-300/20 bg-red-300/10 text-red-100 opacity-45 line-through hover:translate-y-0 hover:border-red-300/20 hover:bg-red-300/10;
}
