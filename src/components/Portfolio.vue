<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { createPortfolioMotion } from '../motion'
import ContactForm from './ContactForm.vue'
import TaskNotebook from './TaskNotebook.vue'
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
  ['Запускаете бренд с нуля?', 'Помогу определить, кому и что продавать, чем отличаться от конкурентов и как выйти на рынок с понятной стратегией.'],
  ['Клиенты выбирают конкурентов?', 'Выясню, что влияет на выбор покупателей, найду сильные стороны продукта и помогу превратить их в причину покупать у вас.'],
  ['Вкладываетесь в маркетинг, но не видите результата?', 'Проанализирую текущие инструменты, найду слабые места и выстрою план продвижения с понятными целями и показателями.'],
  ['Хотите привлекать клиентов через контент?', 'Разработаю контент-стратегию, организую съёмки и создам материалы, которые раскрывают ценность продукта и ведут аудиторию к покупке.'],
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
const mobileMenuOpen = ref(false)
const site = ref<HTMLElement | null>(null)
let motion: ReturnType<typeof createPortfolioMotion> | undefined
function updateRoute() { hash.value = location.hash || '#/'; scrollTo(0, 0) }
function closeMenuOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') mobileMenuOpen.value = false
}
function openCookieSettings() { window.dispatchEvent(new Event('open-cookie-settings')) }
function focusMain() {
  const main = site.value?.querySelector<HTMLElement>('main')
  main?.setAttribute('tabindex', '-1')
  main?.focus()
}
onMounted(() => {
  addEventListener('hashchange', updateRoute)
  addEventListener('keydown', closeMenuOnEscape)
  if (site.value) motion = createPortfolioMotion(site.value)
})
watch([route, filter], async () => {
  mobileMenuOpen.value = false
  await nextTick()
  motion?.refresh()
})
onUnmounted(() => {
  removeEventListener('hashchange', updateRoute)
  removeEventListener('keydown', closeMenuOnEscape)
  motion?.destroy()
})
</script>

<template>
  <div ref="site" class="site">
    <button class="skip-link" type="button" @click="focusMain">Перейти к содержимому</button>
    <div class="motion-progress" aria-hidden="true"></div>
    <header class="header"><div class="wrap header-inner"><a class="logo" href="#/" aria-label="Brand Marketing — главная"><svg class="sparkle-icon logo-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><span>BRAND</span><span>MARKETING</span></a><button class="menu-toggle" type="button" aria-controls="primary-navigation" :aria-expanded="mobileMenuOpen" :aria-label="mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'" @click="mobileMenuOpen = !mobileMenuOpen"><span aria-hidden="true">{{ mobileMenuOpen ? '×' : '☰' }}</span></button><nav id="primary-navigation" :class="{ 'is-open': mobileMenuOpen }" aria-label="Основная навигация" @click="mobileMenuOpen = false"><a href="#/services">Услуги</a><a href="#/cases">Кейсы</a><a href="#/design">Дизайн</a><a href="#/about">Обо мне</a><a class="mobile-contact-link" href="#/contact">Обсудить проект</a></nav><a class="header-link" href="#/contact">Обсудить проект</a></div></header>

    <main v-if="route === '/'" tabindex="-1">
      <section class="hero wrap"><div class="hero-copy"><h1>Маркетинг<br />с <em>понятной</em><br />целью</h1><p class="lead">Помогаю бизнесу находить своё место на рынке, выделяться среди конкурентов и привлекать клиентов.</p><p class="muted">Исследую аудиторию и рынок, разрабатываю позиционирование и стратегию продвижения. Превращаю исследования в конкретные маркетинговые решения.</p><div class="actions"><a class="button hero-cta" href="#/contact">Обсудить проект</a><a class="button hero-secondary" href="#/cases">Смотреть кейсы</a></div></div><div class="hero-collage"><div class="collage-print"><img src="/portrait-diploma.jpg" alt="Бренд-маркетолог с дипломом на Дворцовой площади" width="1086" height="1448" fetchpriority="high" /></div><div class="collage-secondary"><img src="/portrait-evening.jpg" alt="Бренд-маркетолог на вечернем фоне" width="1920" height="2560" loading="lazy" /></div><svg class="collage-star sparkle-icon" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><span class="collage-sticker">MAKE IT MATTER</span></div></section>
      <div class="marquee" aria-hidden="true"><div class="marquee-track"><span>БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg></span><span>БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg> БРЕНДЫ И МОЕ СОТРУДНИЧЕСТВО <svg class="sparkle-icon marquee-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg></span></div></div>

      <section class="section ink"><svg class="ink-trail" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap"><h2 class="script-heading results-heading">Результаты</h2><h2>Маркетинг, за которым<br />стоят результаты</h2><div class="metrics"><a href="#/cases/a-prokat"><strong>×4</strong><span>Рост аудитории<br />А-ПРОКАТ</span><b></b></a><a href="#/cases/zhemchuzhina-kamy"><strong>3</strong><span>Продажи с рекламы<br />Жемчужина Камы</span><b></b></a><a href="#/cases/talan"><strong>+108%</strong><span>Рост подписчиков ВК<br />Талан · сентябрь 2026</span><b></b></a></div></div></section>

      <section class="section wrap tasks-section" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading">С какими задачами<br />ко мне обращаются</h2>
        <TaskNotebook :tasks="tasks" />
      </section>

      <section class="section pale float-section"><svg class="float-mark star float-mark-left sparkle-icon" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><div class="wrap"><h2 class="script-heading services-heading">Услуги</h2><h2>От исследования<br />до реализации</h2><p class="section-lead">Подбираю маркетинговые решения под задачи бизнеса. Можно начать с отдельной стратегии или выстроить комплексное продвижение.</p><div class="services"><article v-for="(item,i) in services" :key="item.title"><button type="button" :aria-expanded="expanded === i" @click="expanded = expanded === i ? null : i"><span>0{{ i+1 }}</span><strong>{{ item.title }}</strong><small>{{ item.need }}<br />Результат: {{ item.result }}</small><b>{{ expanded === i ? '−' : '+' }}</b></button><div v-if="expanded === i" class="service-open"><p>{{ item.scope }}</p><a href="#/contact">Обсудить услугу</a></div></article></div><a class="text-link" href="#/services">Все услуги и форматы работы</a></div></section>

      <section class="section wrap float-section"><div class="heading-row"><div><p class="eyebrow">Избранные проекты</p><h2>Проекты, в которых<br />маркетинг решает задачи</h2></div><a class="text-link" href="#/cases">Все кейсы</a></div><div class="case-grid"><a v-for="(item,i) in cases" :key="item.slug" class="case-card" :href="`#/cases/${item.slug}`"><div class="case-art" :class="`art-${i+1}`">{{ item.title }}</div><small>{{ item.tags }}</small><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><div><b>{{ item.result }}</b><span>Подробнее</span></div></a></div></section>

      <section class="section ink"><svg class="ink-trail" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap approach"><div><p class="eyebrow pink">Подход</p><h2>Сначала разбираюсь<br />в бизнесе Потом<br /><em>предлагаю решения</em></h2><p>Изучаю продукт, рынок, конкурентов и поведение покупателей, чтобы принимать решения на основе данных.</p></div><ol><li v-for="(item,i) in [['Исследования','Кто покупает, почему выбирает и что мешает покупке.'],['Стратегия','Как выделить бренд и достичь целей.'],['Реализация','Коммуникации, контент и рекламные материалы.'],['Аналитика','Оценка результатов и корректировка продвижения.']]" :key="item[0]"><span>0{{ i+1 }}</span><div><strong>{{ item[0] }}</strong><p>{{ item[1] }}</p></div></li></ol></div></section>

      <section class="section wrap float-section"><svg class="float-mark thorn sparkle-icon" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><p class="eyebrow">Процесс</p><h2>Понятный путь<br />от задачи до результата</h2><div class="process"><article v-for="(item,i) in process" :key="item[0]"><span>0{{ i+1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p><small>Итог: {{ item[2] }}</small></article></div></section>

      <section class="section pink-bg"><svg class="ink-trail light" viewBox="0 0 520 130" aria-hidden="true"><path pathLength="100" d="M8 92 C 92 35, 153 126, 230 66 S 395 22, 506 82" /><circle cx="48" cy="85" r="3" /><circle cx="444" cy="62" r="4" /><circle cx="476" cy="71" r="2" /></svg><div class="wrap design-teaser"><div><p class="eyebrow">Дизайн-портфолио</p><h2>Дизайн, который<br />поддерживает идею бренда</h2><p>Визуальные материалы для digital и печати с учётом коммуникации, носителя и требований производства.</p><a class="button dark" href="#/design">Смотреть дизайн-портфолио</a></div><div class="design-types"><span class="design-doodle" aria-hidden="true">glam<br />hustle!</span><article><span>01</span><h3>Print & Editorial</h3><p>Полиграфия, журнальная вёрстка, рекламные материалы.</p></article><article><span>02</span><h3>Digital Design</h3><p>Креативы, баннеры, визуальные системы и адаптации.</p></article></div></div></section>

      <section class="section wrap about-teaser"><div class="about-art"><img src="/portrait-evening.jpg" alt="Портрет бренд-маркетолога на вечернем фоне" loading="lazy" /></div><div><p class="eyebrow">Обо мне</p><h2>Стратегическое мышление<br />Креативная реализация</h2><p>Я бренд-маркетолог. Работаю на пересечении исследований, стратегии, контента и дизайна. Могу разработать стратегию и участвовать в её реализации.</p><a class="text-link" href="#/about">Подробнее обо мне</a></div></section>

      <section class="section pale float-section"><div class="wrap"><p class="eyebrow">Сотрудничество</p><h2>Подключаюсь<br />на нужном этапе</h2><div class="formats"><article v-for="(item,i) in [['Разовая стратегическая задача','Исследование, аудит, позиционирование или стратегия с планом действий.'],['Проектное сопровождение','Запуск бренда, кампания или контентный проект.'],['Долгосрочное сотрудничество','Системное сопровождение, развитие каналов и аналитика.']]" :key="item[0]"><span>0{{ i+1 }}</span><h3>{{ item[0] }}</h3><p>{{ item[1] }}</p></article></div></div></section>

      <section class="section wrap faq"><div><p class="eyebrow">Частые вопросы</p><h2>Коротко о работе</h2></div><div><details v-for="item in faq" :key="item[0]"><summary>{{ item[0] }} <span aria-hidden="true">+</span></summary><p>{{ item[1] }}</p></details></div></section>
      <section class="contact-section float-section"><svg class="float-mark thorn sparkle-icon" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><div class="wrap contact-grid"><div><p class="eyebrow pink">Давайте знакомиться</p><p class="script">LET'S BUILD SOMETHING SPICY</p><h2>Есть задача<br />для маркетинга?<br /><em>Обсудим</em></h2><p>Расскажите о бизнесе и цели. Помогу определить, с чего начать.</p></div><ContactForm id-prefix="home" dark /></div></section>
    </main>

    <main v-else-if="route === '/services'" class="inner wrap inner-feature"><a class="back" href="#/">← Главная</a><p class="eyebrow">Направления работы</p><h1 class="inner-script-title">Услуги</h1><p class="page-lead">Пять направлений, которые можно заказать отдельно или объединить в комплексный проект.</p><div class="service-page"><article v-for="(item,i) in services" :key="item.title"><span>0{{ i+1 }}</span><div><h2>{{ item.title }}</h2><p>{{ item.need }}</p><h3>Что входит</h3><p>{{ item.scope }}</p><h3>Результат</h3><p>{{ item.result }}</p><a class="text-link" href="#/contact">Обсудить услугу</a></div></article></div></main>
    <main v-else-if="route === '/cases'" class="inner wrap inner-feature"><a class="back" href="#/">← Главная</a><p class="eyebrow">Портфолио</p><h1 class="inner-script-title">Кейсы</h1><p class="page-lead">Задачи, решения и результаты проектов.</p><div class="filters" aria-label="Фильтры кейсов"><button v-for="item in categories" :key="item" type="button" :class="{active:filter===item}" :aria-pressed="filter===item" @click="filter=item">{{ item }}</button></div><div class="case-grid"><a v-for="item in visibleCases" :key="item.slug" class="case-card" :href="`#/cases/${item.slug}`"><div class="case-art" :class="`art-${cases.indexOf(item)+1}`">{{ item.title }}</div><small>{{ item.tags }}</small><h2>{{ item.title }}</h2><p>{{ item.summary }}</p><div><b>{{ item.result }}</b><span>Подробнее</span></div></a></div></main>
    <main v-else-if="activeCase" class="inner wrap"><a class="back" href="#/cases">← Все кейсы</a><p class="eyebrow">{{ activeCase?.tags }}</p><h1>{{ activeCase?.title }}</h1><p class="page-lead">{{ activeCase?.summary }}</p><div class="case-placeholder">Место для реальных материалов проекта</div><div class="story"><article v-for="(item,i) in [['Задача',activeCase?.summary],['Исходная ситуация',activeCase?.summary],['Исследование',activeCase?.research],['Решение',activeCase?.solution],['Реализация',activeCase?.work],['Результат',activeCase?.result],['Визуальные материалы','Скриншоты и макеты будут добавлены после согласования.']]" :key="item[0]"><span>0{{ i+1 }}</span><h2>{{ item[0] }}</h2><p>{{ item[1] }}</p></article></div><a class="button dark" href="#/contact">Обсудить похожую задачу</a></main>
    <main v-else-if="route === '/design'" class="inner wrap inner-feature"><a class="back" href="#/">← Главная</a><p class="eyebrow">Дизайн-портфолио</p><h1 class="inner-script-title">Дизайн</h1><p class="page-lead">Работы будут добавлены после отбора и согласования.</p><div class="gallery"><article><div>Print & Editorial</div><h2>Print & Editorial</h2><p>Полиграфия, журнальная вёрстка, рекламные материалы и подготовка к печати.</p></article><article><div>Digital Design</div><h2>Digital Design</h2><p>Креативы, баннеры, визуальные системы и адаптации.</p></article></div></main>
    <main v-else-if="route === '/about'" class="inner wrap inner-feature"><a class="back" href="#/">← Главная</a><p class="eyebrow">О работе и подходе</p><h1 class="inner-script-title">Обо мне</h1><p class="page-lead">Стратегическое мышление и креативная реализация.</p><div class="about-page"><div><img src="/portrait-evening.jpg" alt="Портрет бренд-маркетолога на вечернем фоне" loading="lazy" /></div><article><p>Я бренд-маркетолог. Работаю на пересечении исследований, стратегии, контента и дизайна.</p><p>Мне важно понимать, как устроен бизнес, что влияет на выбор покупателей и какие решения нужны продукту. Поэтому я могу не только разработать стратегию, но и участвовать в её реализации: создавать концепции, сценарии, визуальные материалы и контент.</p><blockquote>У каждого маркетингового решения должна быть конкретная задача и понятный способ оценить результат.</blockquote><a class="button dark" href="#/contact">Обсудить проект</a></article></div></main>
    <main v-else-if="route === '/contact'" class="inner wrap inner-feature"><a class="back" href="#/">← Главная</a><p class="eyebrow">Давайте знакомиться</p><h1 class="inner-script-title">Контакты</h1><p class="page-lead">Расскажите о бизнесе и цели. Помогу определить, с чего начать.</p><div class="contact-page-grid"><ContactForm id-prefix="page" /><aside class="contact-details"><h2>Другие способы связи</h2><a v-if="emailReady" :href="`mailto:${siteConfig.email}`">{{ siteConfig.email }}</a><a v-if="siteConfig.phone" :href="`tel:${siteConfig.phone.replace(/[^+\d]/g, '')}`">{{ siteConfig.phone }}</a><a v-if="safeTelegram" :href="safeTelegram" target="_blank" rel="noopener noreferrer">Telegram</a><a v-if="safeWhatsapp" :href="safeWhatsapp" target="_blank" rel="noopener noreferrer">WhatsApp</a><p v-if="!emailReady && !siteConfig.phone && !safeTelegram && !safeWhatsapp">Контактные данные будут доступны после заполнения владельцем сайта.</p></aside></div></main>
    <PrivacyPolicy v-else-if="route === '/privacy'" />
    <main v-else class="inner wrap"><h1>Страница не найдена</h1><a class="button dark" href="#/">На главную</a></main>
    <footer class="footer"><div class="wrap"><a class="logo" href="#/" aria-label="Brand Marketing — главная"><svg class="sparkle-icon logo-sparkle" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2 59 38 92 15 69 48 98 56 65 62 84 94 56 70 45 99 41 66 7 82 31 55 1 43 35 41 25 8 48 34Z" /></svg><span>BRAND</span><span>MARKETING</span></a><a href="#/privacy">Политика конфиденциальности</a><button type="button" class="footer-settings" @click="openCookieSettings">Настройки хранения</button><a href="#/contact">Контакты</a></div></footer>
    <CookieNotice />
  </div>
</template>
