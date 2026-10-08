<script setup lang="ts">
interface Project {
  index: string
  title: string
  description: string
  tags: string[]
  href: string
}

interface SkillGroup {
  label: string
  items: string[]
}

interface SocialLink {
  label: string
  href: string
}

const nav = [
  { label: 'Бэкграунд', href: '#about' },
  { label: 'Кейсы', href: '#projects' },
  { label: 'Технологии', href: '#skills' },
  { label: 'Контакты', href: '#contact' },
]

const projects: Project[] = [
  {
    index: '01',
    title: 'TaskFlow',
    description:
      'SPA-сервис для эффективного управления задачами: интеграция с REST API, реактивные кастомные фильтры и строгая архитектура хранения данных.',
    tags: ['Vue 3', 'Pinia', 'REST API'],
    href: 'https://github.com/rahym',
  },
  {
    index: '02',
    title: 'People Desk',
    description:
      'Корпоративный инструмент мониторинга и сквозной фильтрации контактов сотрудников организации.',
    tags: ['TypeScript', 'Vue 3', 'UI/UX'],
    href: 'https://github.com/rahym',
  },
]

const skills: SkillGroup[] = [
  {
    label: 'Design',
    items: ['Figma (Adv.)', 'UI/UX Design', 'Дизайн-системы', 'Прототипирование'],
  },
  {
    label: 'Frontend',
    items: ['Vue 3', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    label: 'Workflow',
    items: ['Git / GitHub', 'VS Code', 'REST API', 'Performance'],
  },
]

const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/rahym' },
  { label: 'Telegram', href: 'https://t.me/rahym' },
  { label: 'Email', href: 'mailto:hello@rahym.dev' },
]
</script>

<template>
  <div
    class="min-h-screen bg-[#FBFBFA] font-sans text-[#1A1A1A] antialiased selection:bg-red-600 selection:text-white"
  >
    <header class="sticky top-0 z-50 border-b border-zinc-200 bg-[#FBFBFA]/85 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20">
        <a href="#top" class="group relative inline-flex items-center">
          <span class="font-mono text-sm font-medium tracking-[0.25em]">R.R.</span>
          <span
            class="absolute -top-2.5 left-2 text-[10px] leading-none text-red-600 transition-transform duration-300 group-hover:-rotate-12"
          >
            ✦
          </span>
        </a>

        <nav class="hidden items-center gap-8 md:flex">
          <a
            v-for="item in nav"
            :key="item.href"
            :href="item.href"
            class="group relative font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-[#1A1A1A]"
          >
            {{ item.label }}
            <span
              class="absolute -bottom-1 left-0 h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-full"
            ></span>
          </a>
        </nav>

        <a
          href="#contact"
          class="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-[#1A1A1A] md:hidden"
        >
          Контакты
        </a>
      </div>
    </header>

    <main>
      <section id="top" class="relative mx-auto max-w-6xl px-6 pt-16 pb-16 md:pt-28 md:pb-24">
        <p class="-rotate-2 font-hand text-2xl text-red-600 md:ml-1 md:text-3xl">
          привет, я Рахым ✦
        </p>

        <h1
          class="mt-6 text-[2.5rem] font-semibold uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          Web&nbsp;Designer<br />
          &amp;&nbsp;Frontend<br />
          Developer
        </h1>

        <div class="mt-12 grid gap-8 border-t border-zinc-200 pt-8 md:grid-cols-12 md:pt-10">
          <p class="max-w-xl text-lg leading-relaxed text-zinc-600 md:col-span-7">
            Универсальный специалист: проектирую UI/UX-системы в Figma и превращаю их в быстрый,
            адаптивный и поддерживаемый код на Vue и React.
          </p>

          <div class="md:col-span-5 md:justify-self-end md:text-right">
            <div
              class="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-red-600"></span>
              Алматы, Казахстан
            </div>
            <p class="mt-3 font-mono text-xs text-zinc-400">GMT+5 · открыт к проектам</p>
          </div>
        </div>
      </section>

      <section id="about" class="scroll-mt-24 border-t border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div class="flex items-baseline gap-3 font-mono text-xs tracking-[0.18em]">
            <span class="text-red-600">01</span>
            <span class="uppercase text-zinc-400">// Бэкграунд</span>
          </div>

          <div class="mt-10 grid gap-12 md:grid-cols-12">
            <div class="md:col-span-8">
              <p
                class="text-2xl font-light leading-snug sm:text-3xl md:text-[2.05rem] md:leading-[1.35]"
              >
                Студент 3-го курса колледжа <span class="font-medium">МУИТ (IITU)</span> по
                специальности Web&nbsp;Design. Проходил практику в типографии
                <span class="font-medium">DNPrint</span>, где занимался точным переносом сложных
                UI-макетов из Figma в оптимизированный адаптивный код.
              </p>

              <p class="mt-8 max-w-2xl text-base leading-relaxed text-zinc-600">
                Моя сила — универсальность: держу в голове и художественную, и инженерную часть.
                Проектирую интерфейсы с упором на производительность и минимизацию издержек — от
                первой сетки в Figma до финальной сборки.
              </p>
            </div>

            <aside class="md:col-span-4 md:pt-4 md:text-right">
              <p
                class="-rotate-3 font-hand text-2xl leading-tight text-red-600 md:rotate-[-7deg] md:text-3xl"
              >
                дизайн и код —<br />в одних руках ✦
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section id="projects" class="scroll-mt-24 border-t border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div class="flex items-baseline gap-3 font-mono text-xs tracking-[0.18em]">
            <span class="text-red-600">02</span>
            <span class="uppercase text-zinc-400">// Избранные кейсы</span>
          </div>

          <div class="mt-12 grid gap-6 md:grid-cols-2">
            <a
              v-for="project in projects"
              :key="project.title"
              :href="project.href"
              target="_blank"
              rel="noopener"
              class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white/40 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-zinc-300 hover:bg-white hover:shadow-[0_30px_60px_-45px_rgba(26,26,26,0.4)] md:p-10"
            >
              <div class="flex items-start justify-between">
                <span class="font-mono text-xs text-zinc-400">{{ project.index }}</span>
                <span
                  class="text-zinc-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-red-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="h-5 w-5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </div>

              <div class="mt-16">
                <h3 class="text-3xl font-semibold tracking-tight md:text-4xl">
                  {{ project.title }}
                </h3>
                <p class="mt-4 max-w-md text-sm leading-relaxed text-zinc-600">
                  {{ project.description }}
                </p>
              </div>

              <div class="mt-8 flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="rounded-full border border-zinc-200 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500"
                >
                  {{ tag }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="skills" class="scroll-mt-24 border-t border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div class="flex items-baseline gap-3 font-mono text-xs tracking-[0.18em]">
            <span class="text-red-600">03</span>
            <span class="uppercase text-zinc-400">// Технологии</span>
          </div>

          <div class="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            <div
              v-for="(group, index) in skills"
              :key="group.label"
              :class="index > 0 ? 'md:border-l md:border-zinc-200 md:pl-8' : ''"
            >
              <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
                {{ group.label }}
              </h3>
              <ul class="mt-6 space-y-3.5">
                <li
                  v-for="item in group.items"
                  :key="item"
                  class="flex items-center gap-3 text-lg"
                >
                  <span class="text-[11px] text-red-600">✦</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="scroll-mt-24 border-t border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div class="flex items-baseline gap-3 font-mono text-xs tracking-[0.18em]">
            <span class="text-red-600">04</span>
            <span class="uppercase text-zinc-400">// Контакты</span>
          </div>

          <div class="mt-12 grid gap-12 md:grid-cols-12 md:items-end">
            <div class="md:col-span-8">
              <h2 class="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
                Давайте создадим<br />что-то <span class="text-red-600">значимое</span>.
              </h2>

              <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="mailto:hello@rahym.dev"
                  class="group inline-flex items-center gap-3 rounded-full bg-[#1A1A1A] px-7 py-3.5 text-sm text-white transition-colors duration-300 hover:bg-red-600"
                >
                  Написать письмо
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </a>

                <p class="-rotate-3 font-hand text-2xl text-red-600 md:text-3xl">напиши мне! ✦</p>
              </div>
            </div>

            <ul class="divide-y divide-zinc-200 md:col-span-4 md:justify-self-end md:text-right">
              <li v-for="social in socials" :key="social.label">
                <a
                  :href="social.href"
                  target="_blank"
                  rel="noopener"
                  class="group flex items-center gap-3 py-4 font-mono text-sm uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-[#1A1A1A] md:justify-end"
                >
                  <span>{{ social.label }}</span>
                  <span
                    class="text-zinc-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red-600"
                  >
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-zinc-200">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-400 sm:flex-row sm:items-center sm:justify-between"
      >
        <span>© 2026 Рахым · Алматы, Казахстан</span>
        <span>Спроектировано и собрано вручную ✦</span>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
</style>
