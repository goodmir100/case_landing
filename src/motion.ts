const revealSelector = [
  '.section .eyebrow', '.metrics a', '.task-grid article',
  '.services article', '.case-card', '.approach li', '.process article',
  '.design-types article', '.formats article', '.about-art', '.faq details',
  '.inner .gallery article', '.inner .story article',
  '.inner .service-page article', '.contact-section .script',
  '.contact-section form', '.hero-scribble', '.design-doodle',
].join(', ')

export function createPortfolioMotion(root: HTMLElement) {
  const progressBar = root.querySelector<HTMLElement>('.motion-progress')
  let observer: IntersectionObserver | undefined
  let frame = 0
  let heroFrame = 0

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
        const targets = maskedTargets.get(entry.target) ?? [entry.target as HTMLElement]
        if (entry.isIntersecting) {
          targets.forEach(element => element.classList.add('is-visible'))
        } else {
          targets.forEach(element => element.classList.remove('is-visible'))
        }
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

  addEventListener('scroll', onScroll, { passive: true })
  refresh()

  return {
    refresh,
    destroy() {
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(heroFrame)
      removeEventListener('scroll', onScroll)
    },
  }
}
