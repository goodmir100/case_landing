const revealSelector = [
  '.section h2', '.section .eyebrow', '.metrics a', '.task-grid article',
  '.services article', '.case-card', '.approach li', '.process article',
  '.design-types article', '.formats article', '.about-art', '.faq details',
  '.inner h1', '.inner .gallery article', '.inner .story article',
  '.inner .service-page article', '.contact-section h2', '.contact-section .script',
  '.contact-section form', '.hero-scribble', '.design-doodle',
].join(', ')

export function createPortfolioMotion(root: HTMLElement) {
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
  const cursor = root.querySelector<HTMLElement>('.motion-cursor')
  const cursorCore = root.querySelector<HTMLElement>('.motion-cursor-core')
  const progressBar = root.querySelector<HTMLElement>('.motion-progress')
  let observer: IntersectionObserver | undefined
  let frame = 0
  let cursorFrame = 0
  let heroFrame = 0
  let targetX = -100
  let targetY = -100
  let currentX = -100
  let currentY = -100
  let cursorVisible = false

  function enableMotion() {
    root.classList.add('motion-enabled')
  }

  function revealKind(element: HTMLElement) {
    if (element.matches('h1, h2')) return 'motion-title'
    if (element.matches('.case-card, .about-art, .gallery article')) return 'motion-card'
    if (element.matches('.hero-scribble, .design-doodle, .script')) return 'motion-script'
    if (element.matches('article, .metrics a, .faq details')) return 'motion-row'
    return 'motion-small'
  }

  function refresh() {
    observer?.disconnect()
    enableMotion()

    const maskedTargets = new Map<Element, HTMLElement[]>()
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        maskedTargets.get(entry.target)?.forEach(element => element.classList.add('is-visible'))
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    root.querySelectorAll<HTMLElement>(revealSelector).forEach(element => {
      element.classList.add('motion-reveal', revealKind(element))
      const siblings = Array.from(element.parentElement?.children ?? [])
      element.style.setProperty('--reveal-delay', `${Math.min(4, siblings.indexOf(element)) * 65}ms`)
      if (element.getBoundingClientRect().top < innerHeight * 0.96) {
        if (element.classList.contains('hero-scribble') && !element.classList.contains('is-visible')) {
          requestAnimationFrame(() => element.classList.add('is-visible'))
        } else {
          element.classList.add('is-visible')
        }
      }
      if (element.matches('.motion-title, .motion-script') && !element.classList.contains('is-visible')) {
        const section = element.closest('section, main') ?? element.parentElement
        if (section) {
          maskedTargets.set(section, [...(maskedTargets.get(section) ?? []), element])
          observer?.observe(section)
        }
      } else {
        observer?.observe(element)
      }
    })
    const hero = root.querySelector<HTMLElement>('.hero')
    if (hero && !hero.classList.contains('hero-entered')) {
      heroFrame = requestAnimationFrame(() => {
        heroFrame = requestAnimationFrame(() => hero.classList.add('hero-entered'))
      })
    }
    updateParallax()
  }

  function updateParallax() {
    frame = 0
    if (progressBar) {
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight)
      progressBar.style.transform = `scaleX(${Math.min(1, scrollY / scrollRange)})`
    }
    const hero = root.querySelector<HTMLElement>('.hero')
    if (hero) {
      const progress = Math.max(0, Math.min(1, scrollY / Math.max(1, hero.offsetHeight)))
      hero.classList.toggle('hero-past', progress > 0.13)
      const star = hero.querySelector<HTMLElement>('.collage-star')
      const date = hero.querySelector<HTMLElement>('.collage-date')
      const grain = hero.querySelector<HTMLElement>('.film-grain')
      if (star) star.style.transform = `translate3d(0, ${progress * -34}px, 0) rotate(${18 + progress * 16}deg)`
      if (date) date.style.transform = `translate3d(0, ${progress * 19}px, 0) rotate(${-10 + progress * 8}deg)`
      if (grain) grain.style.transform = `translate3d(0, ${progress * -12}px, 0)`
    }
    root.querySelectorAll<HTMLElement>('.float-mark').forEach(mark => {
      const rect = mark.parentElement?.getBoundingClientRect()
      if (!rect || rect.bottom < -100 || rect.top > innerHeight + 100) return
      const progress = Math.max(-1, Math.min(1, (innerHeight * 0.5 - rect.top - rect.height * 0.5) / innerHeight))
      mark.style.transform = `translate3d(0, ${progress * 80}px, 0) rotate(${progress * 18}deg)`
    })
    root.querySelectorAll<SVGSVGElement>('.ink-trail').forEach(trail => {
      const section = trail.parentElement
      if (!section) return
      const rect = section.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) return
      const reveal = Math.max(0, Math.min(1, (innerHeight * .82 - rect.top) / (innerHeight * .78)))
      const path = trail.querySelector<SVGPathElement>('path')
      if (path) path.style.strokeDashoffset = String(100 * (1 - reveal))
      trail.querySelectorAll<SVGCircleElement>('circle').forEach(circle => {
        circle.style.opacity = String(Math.min(.55, Math.max(0, (reveal - .7) * 1.85)))
      })
    })
  }

  function onScroll() {
    if (!frame) frame = requestAnimationFrame(updateParallax)
  }

  function animateCursor() {
    cursorFrame = 0
    if (!cursor || !cursorCore || !cursorVisible) return
    currentX += (targetX - currentX) * 0.19
    currentY += (targetY - currentY) * 0.19
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
    cursorCore.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.25) {
      cursorFrame = requestAnimationFrame(animateCursor)
    }
  }

  function onPointerMove(event: PointerEvent) {
    if (!finePointer.matches || event.pointerType === 'touch') return
    targetX = event.clientX
    targetY = event.clientY
    if (!cursorVisible) {
      currentX = targetX
      currentY = targetY
      cursorVisible = true
      root.classList.add('cursor-active')
    }
    const hover = (event.target as Element)?.closest('a, button, summary, .collage-print')
    root.classList.toggle('cursor-hover', Boolean(hover))
    if (!cursorFrame) cursorFrame = requestAnimationFrame(animateCursor)
  }

  function onPointerLeave() {
    cursorVisible = false
    root.classList.remove('cursor-active', 'cursor-hover')
    cancelAnimationFrame(cursorFrame)
    cursorFrame = 0
  }

  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  refresh()

  return {
    refresh,
    destroy() {
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(cursorFrame)
      cancelAnimationFrame(heroFrame)
      removeEventListener('scroll', onScroll)
      removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    },
  }
}
