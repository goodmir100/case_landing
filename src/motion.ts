const revealSelector = [
  '.section h2', '.section .eyebrow', '.metrics a', '.task-grid article',
  '.case-card', '.process article', '.formats article', '.about-art',
  '.inner h1', '.inner .gallery article', '.inner .story article',
  '.contact-section h2', '.hero-scribble', '.design-doodle',
].join(', ')

export function createPortfolioMotion(root: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
  const cursor = root.querySelector<HTMLElement>('.motion-cursor')
  const cursorCore = root.querySelector<HTMLElement>('.motion-cursor-core')
  let observer: IntersectionObserver | undefined
  let frame = 0
  let cursorFrame = 0
  let targetX = -100
  let targetY = -100
  let currentX = -100
  let currentY = -100
  let cursorVisible = false

  function refresh() {
    observer?.disconnect()
    root.classList.toggle('motion-enabled', !reduced.matches)
    if (reduced.matches) {
      root.querySelectorAll('.motion-reveal, .motion-section, .hero').forEach(element => {
        element.classList.remove('motion-reveal', 'is-visible', 'motion-section', 'hero-past')
      })
      return
    }

    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    root.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
      if (element.getBoundingClientRect().top < innerHeight * 0.96) {
        if (element.classList.contains('hero-scribble') && !element.classList.contains('is-visible')) {
          element.classList.add('motion-reveal')
          requestAnimationFrame(() => element.classList.add('is-visible'))
        } else {
          element.classList.add('is-visible')
        }
      } else {
        element.classList.add('motion-reveal')
        element.style.setProperty('--reveal-delay', `${(index % 3) * 75}ms`)
      }
      observer?.observe(element)
    })
    root.querySelectorAll<HTMLElement>('.ink-trail').forEach(element => {
      element.classList.add('motion-section')
      observer?.observe(element)
    })
    updateParallax()
  }

  function updateParallax() {
    frame = 0
    if (reduced.matches) return
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
      mark.style.transform = `translate3d(0, ${progress * 30}px, 0) rotate(${progress * 8}deg)`
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
    if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return
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

  function onPreferenceChange() {
    onPointerLeave()
    refresh()
  }

  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerleave', onPointerLeave)
  reduced.addEventListener('change', onPreferenceChange)
  finePointer.addEventListener('change', onPreferenceChange)
  refresh()

  return {
    refresh,
    destroy() {
      observer?.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(cursorFrame)
      removeEventListener('scroll', onScroll)
      removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      reduced.removeEventListener('change', onPreferenceChange)
      finePointer.removeEventListener('change', onPreferenceChange)
    },
  }
}
