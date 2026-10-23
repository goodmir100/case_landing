<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { createPortfolioMotion } from '../motion'
import ContactForm from './ContactForm.vue'
import CookieNotice from './CookieNotice.vue'
import PrivacyPolicy from './PrivacyPolicy.vue'
import { emailReady, safeTelegram, safeWhatsapp, siteConfig } from '../site-config'

type Service = { title: string; need: string; scope: string; result: string }
type Case = { slug: string; title: string; category: string; tags: string; summary: string; result: string; research: string; solution: string; work: string }

const services: Service[] = [
  { title: 'Бренд-стратегия', need: 'Выделиться среди конкурентов и сформировать причину выбора.', scope: 'Исследование аудитории и конкурентов, позиционирование, платформа бренда, коммуникационная стратегия.', result: 'Чёткое позиционирование и основа для дальнейшего маркетинга.' },
  { title: 'Запуск бренда с нуля', need: 'Вывести новый продукт на рынок и привлечь первых клиентов.', scope: 'Исследование рынка, проверка гипотез, позиционирование, стратегия запуска и план продвижения.', result: 'Подготовленный бренд и пошаговый план выхода на рынок.' },
  { title: 'Маркетинг полного цикла', need: 'Выстроить системное продвижение и развитие бизнеса.', scope: 'Аудит, стратегия, выбор каналов, маркетинговый план, координация реализации и аналитика.', result: 'Управляемая система продвижения с целями и KPI.' },
  { title: 'SMM и контент-продакшн', need: 'Повышать узнаваемость и получать обращения через социальные сети.', scope: 'SMM-стратегия, контент-план, сценарии, ТЗ, съёмка, организация продакшна, публикации и аналитика.', result: 'Системное продвижение и готовый фото- и видеоконтент.' },
  { title: 'Графический дизайн', need: 'Создать визуальные материалы для рекламы, digital и печати.', scope: 'Рекламные креативы, полиграфия, журнальная вёрстка, адаптация форматов и предпечатная подготовка.', result: 'Готовые макеты для согласованных носителей и площадок.' },
]
const cases: Case[] = [
  { slug: 'a-prokat', title: 'А-ПРОКАТ', category: 'Контент', tags: 'SMM · КОНТЕНТ · ПРОДАКШН', summary: 'Как контент и короткие видео помогли увеличить аудиторию в 4 раза.', result: '300 → 1 200 подписчиков', research: 'Анализ аудитории и подходящих форматов контента.', solution: 'Ставка на понятный контент и короткие видео.', work: 'Контент-план, сценарии и производство публикаций.' },
  { slug: 'zhemchuzhina-kamy', title: 'Жемчужина Камы', category: 'Маркетинг', tags: 'МАРКЕТИНГ · ДЕВЕЛОПМЕНТ', summary: 'Продвижение премиальной недвижимости с фокусом на качественные обращения и продажи.', result: '3 продажи с рекламы', research: 'Изучение продукта, аудитории и пути выбора недвижимости.', solution: 'Коммуникация ценности проекта через релевантные каналы.', work: 'Рекламные материалы и координация продвижения.' },
  { slug: 'nastroenie', title: 'Настроение', category: 'Стратегия', tags: 'БРЕНД-СТРАТЕГИЯ · B2B', summary: 'Исследования клиентов и рынка для позиционирования производителя наружной рекламы.', result: 'Исследования · JTBD · бренд-платформа', research: 'Исследования клиентов, задач выбора и конкурентной среды.', solution: 'Платформа бренда на основе выявленных потребностей.', work: 'Позиционирование и коммуникационные ориентиры.' },
  { slug: 'talan', title: 'Талан', category: 'Контент', tags: 'B2B · КОНТЕНТ · ПРОДВИЖЕНИЕ', summary: 'Развитие коммуникаций с подрядчиками и поставщиками через контент и digital.', result: '+108% подписчиков ВК за сентябрь 2026', research: 'Анализ интересов подрядчиков и поставщиков.', solution: 'Контент, который отвечает на вопросы аудитории.', work: 'Контент-план и digital-продвижение.' },
]
const tasks = [
  ['Запускаете новый продукт или бренд?', 'Помогу определить аудиторию, сформировать позиционирование и подготовить стратегию выхода на рынок.'],
  ['Клиенты не понимают, почему выбрать вас?', 'Найду конкурентные преимущества и помогу донести ценность продукта через бренд и коммуникации.'],
  ['Маркетинг есть, а системы нет?', 'Проведу аудит, определю приоритетные каналы и выстрою продвижение с целями и показателями.'],
  ['Социальные сети не приводят нужную аудиторию?', 'Разработаю контент-стратегию, сценарии, организую съёмки и помогу сделать контент инструментом продвижения.'],
]
const process = [
  ['Знакомство и брифинг', 'Обсуждаем продукт, задачи, текущий маркетинг, бюджет и ожидаемый результат.', 'Согласованные цели и объём работ.'],
  ['Анализ и исследование', 'Изучаю рынок, конкурентов, аудиторию и существующие каналы.', 'Выводы и точки роста.'],
  ['Разработка стратегии', 'Определяю позиционирование, сообщения, каналы и план действий.', 'Стратегия с приоритетами и KPI.'],
  ['Реализация', 'Создаю контент, ТЗ, организую съёмки и координирую работы.', 'Запущенные активности.'],
  ['Аналитика и развитие', 'Отслеживаю показатели, оцениваю эффективность и предлагаю шаги.', 'Отчёт и рекомендации.'],
]
const faq = [
  ['Можно обратиться, если у бизнеса ещё нет маркетинговой стратегии?', 'Да. Начнём с продукта, задач и аудитории, затем определим приоритеты.'],
  ['Можно заказать только SMM или съёмку контента?', 'Да. Можно обсудить отдельную задачу без комплексного сопровождения.'],
  ['Работаете с B2B и B2C?', 'Да. Подход и каналы подбираются под продукт и аудиторию.'],
  ['Как формируется стоимость?', 'После знакомства и уточнения объёма работ подготовлю предложение.'],
  ['Как оценивается эффективность?', 'На старте согласуем цели и показатели, затем будем отслеживать результаты.'],
]
const hash = ref(location.hash || '#/')
const route = computed(() => hash.value.slice(1) || '/')
const activeCase = computed(() => cases.find(c => route.value === `/cases/${c.slug}`))
const filter = ref('Все')
const categories = ['Все', 'Стратегия', 'Маркетинг', 'Контент']
const visibleCases = computed(() => filter.value === 'Все' ? cases : cases.filter(c => c.category === filter.value))
const expanded = ref<number | null>(null)
const site = ref<HTMLElement | null>(null)
let motion: ReturnType<typeof createPortfolioMotion> | undefined
function updateRoute() { hash.value = location.hash || '#/'; scrollTo(0, 0) }
function openCookieSettings() { window.dispatchEvent(new Event('open-cookie-settings')) }
function focusMain() {
  const main = site.value?.querySelector<HTMLElement>('main')
  main?.setAttribute('tabindex', '-1')
  main?.focus()
}
onMounted(() => {
  addEventListener('hashchange', updateRoute)
  if (site.value) motion = createPortfolioMotion(site.value)
})
watch([route, filter], async () => {
  await nextTick()
  motion?.refresh()
})
onUnmounted(() => {
  removeEventListener('hashchange', updateRoute)
  motion?.destroy()
})
</script>

<template>
  <div ref="site" class="site">
    <button class="skip-link" type="button" @click="focusMain">Перейти к содержимому</button>
    <div class="motion-progress" aria-hidden="true"></div>
    <button class="motion-toggle" type="button" aria-pressed="false" aria-label="Включить анимацию"><span aria-hidden="true">✳</span><span>Анимация</span><strong class="motion-toggle-state">Выкл</strong></button>
    <div class="motion-cursor" aria-hidden="true"><span>✳</span></div><div class="motion-cursor-core" aria-hidden="true"></div>
    <header class="header"><div class="wrap header-inner"><a class="logo" href="#/" aria-label="Главная">brand<span>✳</span>marketing</a><span class="header-era" aria-hidden="true">EST. IN IDEAS / 00s ENERGY</span><nav aria-label="Основная навигация"><a href="#/services">Услуги</a><a href="#/cases">Кейсы</a><a href="#/design">Дизайн</a><a href="#/about">Обо мне</a></nav><a class="header-link" href="#/contact">Обсудить проект ↗</a></div></header>

    <main v-if="route === '/'" tabindex="-1">
      <section class="hero wrap"><div class="hero-copy"><p class="eyebrow">Бренд-маркетолог · стратегия и реализация</p><h1>Маркетинг<br />с <em>понятной</em><br />целью<span class="dot">.</span></h1><p class="lead">Помогаю новым брендам выходить на рынок, а действующим компаниям привлекать клиентов и увеличивать продажи.</p><p class="muted">Исследую рынок и аудиторию, разрабатываю позиционирование, маркетинговые стратегии и реализую продвижение.</p><div class="actions"><a class="button dark" href="#/cases">Смотреть кейсы ↗</a><a class="button outline" href="#/contact">Обсудить проект ↗</a></div><span class="hero-scribble" aria-hidden="true">make it matter!</span></div><div class="hero-collage"><div class="collage-print"><img src="/editorial-studio.jpg" alt="" width="1024" height="1536" fetchpriority="high" /><span class="film-grain" aria-hidden="true"></span><span class="photo-caption">VISUAL RESEARCH / FRAME 01</span></div><span class="collage-outline" aria-hidden="true">MAKE IT<br />MATTER</span><span class="collage-star" aria-hidden="true">✳</span><span class="collage-sticker" aria-hidden="true">STRATEGY<br />WITH ATTITUDE ↗</span><span class="collage-date" aria-hidden="true">Y2K / 2004</span></div><div class="hero-foot"><span>Исследование → стратегия → креатив → реализация → аналитика</span><span>01 / 12</span></div></section>
      <div class="marquee" aria-hidden="true"><div class="marquee-track"><span>IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳</span><span>IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳ IDEAS WITH IMPACT ✳</span></div></div>

      <section class="section ink"><svg class="ink-trail" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap"><p class="eyebrow pink">Результаты</p><h2>Маркетинг, за которым<br />стоят результаты<span class="dot">.</span></h2><div class="metrics"><a href="#/cases/a-prokat"><strong>×4</strong><span>Рост аудитории<br />А-ПРОКАТ</span><b>↗</b></a><a href="#/cases/zhemchuzhina-kamy"><strong>3</strong><span>Продажи с рекламы<br />Жемчужина Камы</span><b>↗</b></a><a href="#/cases/talan"><strong>+108%</strong><span>Рост подписчиков ВК<br />Талан · сентябрь 2026</span><b>↗</b></a></div><p class="note">Показатели из брифа. Перед публикацией требуется сверка с отчётами и подтверждение личного вклада.</p></div></section>

      <section class="section wrap float-section"><span class="float-mark star" aria-hidden="true">✳</span><p class="eyebrow">Задачи</p><h2>Решаю маркетинговые<br />задачи бизнеса<span class="dot">.</span></h2><div class="task-grid"><article v-for="(item,i) in tasks" :key="item[0]"><span>0{{ i+1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div></section>

      <section class="section pale float-section"><span class="float-mark star float-mark-left" aria-hidden="true">✳</span><div class="wrap"><p class="eyebrow">Услуги</p><h2>От исследования<br />до реализации<span class="dot">.</span></h2><p class="section-lead">Подбираю маркетинговые решения под задачи бизнеса. Можно начать с отдельной стратегии или выстроить комплексное продвижение.</p><div class="services"><article v-for="(item,i) in services" :key="item.title"><button type="button" :aria-expanded="expanded === i" @click="expanded = expanded === i ? null : i"><span>0{{ i+1 }}</span><strong>{{ item.title }}</strong><small>{{ item.need }}<br />Результат: {{ item.result }}</small><b>{{ expanded === i ? '−' : '+' }}</b></button><div v-if="expanded === i" class="service-open"><p>{{ item.scope }}</p><a href="#/contact">Обсудить услугу ↗</a></div></article></div><a class="text-link" href="#/services">Все услуги и форматы работы ↗</a></div></section>

      <section class="section wrap float-section"><span class="float-mark year" aria-hidden="true">2003</span><div class="heading-row"><div><p class="eyebrow">Избранные проекты</p><h2>Проекты, в которых<br />маркетинг решает задачи<span class="dot">.</span></h2></div><a class="text-link" href="#/cases">Все кейсы ↗</a></div><div class="case-grid"><a v-for="(item,i) in cases" :key="item.slug" class="case-card" :href="`#/cases/${item.slug}`"><div class="case-art" :class="`art-${i+1}`">{{ item.title }}</div><small>{{ item.tags }}</small><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><div><b>{{ item.result }}</b><span>Подробнее ↗</span></div></a></div><p class="note light-note">Визуальные блоки обозначают места для реальных материалов проектов.</p></section>

      <section class="section ink"><svg class="ink-trail" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap approach"><div><p class="eyebrow pink">Подход</p><h2>Сначала разбираюсь<br />в бизнесе. Потом<br /><em>предлагаю решения.</em></h2><p>Изучаю продукт, рынок, конкурентов и поведение покупателей, чтобы принимать решения на основе данных.</p></div><ol><li v-for="(item,i) in [['Исследования','Кто покупает, почему выбирает и что мешает покупке.'],['Стратегия','Как выделить бренд и достичь целей.'],['Реализация','Коммуникации, контент и рекламные материалы.'],['Аналитика','Оценка результатов и корректировка продвижения.']]" :key="item[0]"><span>0{{ i+1 }}</span><div><strong>{{ item[0] }}</strong><p>{{ item[1] }}</p></div></li></ol></div></section>

      <section class="section wrap float-section"><span class="float-mark thorn" aria-hidden="true">✳</span><p class="eyebrow">Процесс</p><h2>Понятный путь<br />от задачи до результата<span class="dot">.</span></h2><div class="process"><article v-for="(item,i) in process" :key="item[0]"><span>0{{ i+1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><small>Итог: {{ item[2] }}</small></article></div><p class="note light-note">Не каждый проект проходит все этапы: можно заказать отдельную стратегию или производство контента.</p></section>

      <section class="section pink-bg"><svg class="ink-trail light" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap design-teaser"><div><p class="eyebrow">Дизайн-портфолио</p><h2>Дизайн, который<br />поддерживает идею бренда.</h2><p>Визуальные материалы для digital и печати с учётом коммуникации, носителя и требований производства.</p><a class="button dark" href="#/design">Смотреть дизайн-портфолио ↗</a></div><div class="design-types"><span class="design-doodle" aria-hidden="true">glam<br />hustle!</span><article><span>01</span><h3>Print & Editorial</h3><p>Полиграфия, журнальная вёрстка, рекламные материалы.</p></article><article><span>02</span><h3>Digital Design</h3><p>Креативы, баннеры, визуальные системы и адаптации.</p></article></div></div></section>

      <section class="section wrap about-teaser"><div class="about-art" aria-hidden="true">01<span>↗</span><small>NO EMPTY IDEAS</small></div><div><p class="eyebrow">Обо мне</p><h2>Стратегическое мышление.<br />Креативная реализация<span class="dot">.</span></h2><p>Я бренд-маркетолог. Работаю на пересечении исследований, стратегии, контента и дизайна. Могу разработать стратегию и участвовать в её реализации.</p><a class="text-link" href="#/about">Подробнее обо мне ↗</a></div></section>

      <section class="section pale float-section"><span class="float-mark year float-mark-left" aria-hidden="true">2004</span><div class="wrap"><p class="eyebrow">Сотрудничество</p><h2>Подключаюсь<br />на нужном этапе<span class="dot">.</span></h2><div class="formats"><article v-for="(item,i) in [['Разовая стратегическая задача','Исследование, аудит, позиционирование или стратегия с планом действий.'],['Проектное сопровождение','Запуск бренда, кампания или контентный проект.'],['Долгосрочное сотрудничество','Системное сопровождение, развитие каналов и аналитика.']]" :key="item[0]"><span>0{{ i+1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div></div></section>

      <section class="section wrap faq"><div><p class="eyebrow">Частые вопросы</p><h2>Коротко о работе<span class="dot">.</span></h2></div><div><details v-for="item in faq" :key="item[0]"><summary>{{ item[0] }} <span aria-hidden="true">+</span></summary><p>{{ item[1] }}</p></details></div></section>
      <section class="contact-section float-section"><span class="float-mark thorn" aria-hidden="true">✳</span><div class="wrap contact-grid"><div><p class="eyebrow pink">Давайте знакомиться</p><p class="script">LET'S BUILD SOMETHING SPICY</p><h2>Есть задача<br />для маркетинга?<br /><em>Обсудим.</em></h2><p>Расскажите о бизнесе и цели. Помогу определить, с чего начать.</p></div><ContactForm id-prefix="home" dark /></div></section>
    </main>

    <main v-else-if="route === '/services'" class="inner wrap"><a class="back" href="#/">← Главная</a><p class="eyebrow">Направления работы</p><h1>От исследования<br />до реализации<span class="dot">.</span></h1><p class="page-lead">Пять направлений, которые можно заказать отдельно или объединить в комплексный проект.</p><div class="service-page"><article v-for="(item,i) in services" :key="item.title"><span>0{{ i+1 }}</span><div><h2>{{ item.title }}</h2><p>{{ item.need }}</p><h3>Что входит</h3><p>{{ item.scope }}</p><h3>Результат</h3><p>{{ item.result }}</p><a class="text-link" href="#/contact">Обсудить услугу ↗</a></div></article></div></main>
    <main v-else-if="route === '/cases'" class="inner wrap"><a class="back" href="#/">← Главная</a><p class="eyebrow">Портфолио</p><h1>Кейсы<span class="dot">.</span></h1><p class="page-lead">Задачи, решения и результаты проектов.</p><div class="filters" aria-label="Фильтры кейсов"><button v-for="item in categories" :key="item" type="button" :class="{active:filter===item}" :aria-pressed="filter===item" @click="filter=item">{{ item }}</button></div><div class="case-grid"><a v-for="item in visibleCases" :key="item.slug" class="case-card" :href="`#/cases/${item.slug}`"><div class="case-art" :class="`art-${cases.indexOf(item)+1}`">{{ item.title }}</div><small>{{ item.tags }}</small><h2>{{ item.title }}</h2><p>{{ item.summary }}</p><div><b>{{ item.result }}</b><span>Подробнее ↗</span></div></a></div></main>
    <main v-else-if="activeCase" class="inner wrap"><a class="back" href="#/cases">← Все кейсы</a><p class="eyebrow">{{ activeCase.tags }}</p><h1>{{ activeCase.title }}<span class="dot">.</span></h1><p class="page-lead">{{ activeCase.summary }}</p><div class="case-placeholder">Место для реальных материалов проекта</div><div class="story"><article v-for="(item,i) in [['Задача',activeCase.summary],['Исходная ситуация',activeCase.summary],['Исследование',activeCase.research],['Решение',activeCase.solution],['Реализация',activeCase.work],['Результат',activeCase.result],['Визуальные материалы','Скриншоты и макеты будут добавлены после согласования.']]" :key="item[0]"><span>0{{ i+1 }}</span><h2>{{ item[0] }}</h2><p>{{ item[1] }}</p></article></div><p class="note light-note">Описание составлено по брифу. Отчёты, период и личный вклад требуют подтверждения перед публикацией.</p><a class="button dark" href="#/contact">Обсудить похожую задачу ↗</a></main>
    <main v-else-if="route === '/design'" class="inner wrap"><a class="back" href="#/">← Главная</a><p class="eyebrow">Дизайн-портфолио</p><h1>Дизайн для<br />задач бренда<span class="dot">.</span></h1><p class="page-lead">Работы будут добавлены после отбора и согласования.</p><div class="gallery"><article><div>Print & Editorial</div><h2>Print & Editorial</h2><p>Полиграфия, журнальная вёрстка, рекламные материалы и подготовка к печати.</p></article><article><div>Digital Design</div><h2>Digital Design</h2><p>Креативы, баннеры, визуальные системы и адаптации.</p></article></div></main>
    <main v-else-if="route === '/about'" class="inner wrap"><a class="back" href="#/">← Главная</a><p class="eyebrow">Обо мне</p><h1>Стратегическое мышление.<br /><em>Креативная реализация.</em></h1><div class="about-page"><div>Место для профессионального портрета</div><article><p>Я бренд-маркетолог. Работаю на пересечении исследований, стратегии, контента и дизайна.</p><p>Мне важно понимать, как устроен бизнес, что влияет на выбор покупателей и какие решения нужны продукту. Поэтому я могу не только разработать стратегию, но и участвовать в её реализации: создавать концепции, сценарии, визуальные материалы и контент.</p><blockquote>У каждого маркетингового решения должна быть конкретная задача и понятный способ оценить результат.</blockquote><a class="button dark" href="#/contact">Обсудить проект ↗</a></article></div></main>
    <main v-else-if="route === '/contact'" class="inner wrap"><a class="back" href="#/">← Главная</a><p class="eyebrow">Контакты</p><h1>Есть задача для маркетинга?<br /><em>Обсудим.</em></h1><p class="page-lead">Расскажите о бизнесе и цели. Помогу определить, с чего начать.</p><div class="contact-page-grid"><ContactForm id-prefix="page" /><aside class="contact-details"><h2>Другие способы связи</h2><a v-if="emailReady" :href="`mailto:${siteConfig.email}`">{{ siteConfig.email }}</a><a v-if="siteConfig.phone" :href="`tel:${siteConfig.phone.replace(/[^+\d]/g, '')}`">{{ siteConfig.phone }}</a><a v-if="safeTelegram" :href="safeTelegram" target="_blank" rel="noopener noreferrer">Telegram ↗</a><a v-if="safeWhatsapp" :href="safeWhatsapp" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><p v-if="!emailReady && !siteConfig.phone && !safeTelegram && !safeWhatsapp">Контактные данные будут доступны после заполнения владельцем сайта.</p></aside></div></main>
    <PrivacyPolicy v-else-if="route === '/privacy'" />
    <main v-else class="inner wrap"><h1>Страница не найдена.</h1><a class="button dark" href="#/">На главную ↗</a></main>
    <footer class="footer"><div class="wrap"><a class="logo" href="#/">brand<span>✳</span>marketing</a><p>Стратегия · креатив · реализация</p><a href="#/privacy">Политика конфиденциальности</a><button type="button" class="footer-settings" @click="openCookieSettings">Настройки хранения</button><a href="#/contact">Контакты ↗</a></div></footer>
    <CookieNotice />
  </div>
</template>
