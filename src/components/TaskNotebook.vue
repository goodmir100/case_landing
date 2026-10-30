<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{ tasks: string[][] }>()
const page = ref(1)
const target = ref<number | null>(null)
const progress = ref(0)
const direction = ref(1)
const root = ref<HTMLElement>()
let tween: gsap.core.Tween | undefined
let pointer: number | null = null
let startX = 0
let width = 1
let started = 0
// The notebook keeps its requested page-turn animation regardless of the OS motion preference.
const reduced = () => false
const number = (i: number) => String(i + 1).padStart(2, '0')
const frontStyle = computed(() => {
  const p = progress.value
  const edge = direction.value > 0 ? 100 * (1 - p) : 100 * p
  const bow = Math.sin(p * Math.PI) * 5
  return { clipPath: direction.value > 0
    ? `polygon(0 0, ${edge}% 0, ${edge + bow}% 50%, ${edge}% 100%, 0 100%)`
    : `polygon(${edge}% 0, 100% 0, 100% 100%, ${edge}% 100%, ${edge - bow}% 50%)` }
})
const curlStyle = computed(() => {
  const bend = Math.sin(progress.value * Math.PI)
  const edge = direction.value > 0 ? 100 * (1 - progress.value) : 100 * progress.value
  return {
    left: `${edge}%`, width: `${bend * 18}%`, opacity: Math.min(1, bend * 5),
    transform: `translateX(-50%) perspective(700px) rotateY(${direction.value * -36 * bend}deg) rotateZ(${direction.value * -2 * bend}deg)`,
    boxShadow: `${direction.value * 24 * bend}px 12px ${36 * bend}px #30281938`,
  }
})
function settle(complete: boolean) {
  tween?.kill()
  const done = () => {
    if (complete && target.value !== null) page.value = target.value
    target.value = null
    progress.value = 0
  }
  if (reduced()) { done(); return }
  tween = gsap.to(progress, { value: complete ? 1 : 0, duration: Math.max(.25, .95 * Math.abs((complete ? 1 : 0) - progress.value)), ease: 'power2.inOut', onComplete: done })
}
function go(index: number) {
  if (index < 0 || index >= props.tasks.length || index === page.value || target.value !== null) return
  direction.value = index > page.value ? 1 : -1
  target.value = index
  settle(true)
}
function down(event: PointerEvent, dir: number) {
  if (event.button !== 0 || target.value !== null || page.value + dir < 0 || page.value + dir >= props.tasks.length) return
  pointer = event.pointerId
  startX = event.clientX
  started = performance.now()
  width = root.value?.querySelector('.notebook-stage')?.clientWidth || 1
  direction.value = dir
  target.value = page.value + dir
  ;(event.currentTarget as HTMLElement).setPointerCapture(pointer)
}
function move(event: PointerEvent) {
  if (event.pointerId !== pointer || reduced()) return
  progress.value = Math.max(0, Math.min(1, (startX - event.clientX) * direction.value / (width * .8)))
}
function up(event: PointerEvent, cancelled = false) {
  if (event.pointerId !== pointer) return
  pointer = null
  const travel = (startX - event.clientX) * direction.value
  settle(!cancelled && (Math.abs(travel) < 5 || progress.value > .3 || travel / Math.max(1, performance.now() - started) > .5))
}
function magnet(event: PointerEvent, reset = false) {
  if (reduced() || event.pointerType !== 'mouse') return
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  gsap.to(button, { x: reset ? 0 : (event.clientX - rect.left - rect.width / 2) * .16, y: reset ? 0 : (event.clientY - rect.top - rect.height / 2) * .16, duration: .3, overwrite: true })
}
onBeforeUnmount(() => {
  tween?.kill()
  if (root.value) gsap.killTweensOf(root.value.querySelectorAll('button'))
})
</script>

<template>
  <div ref="root" class="notebook" role="region" aria-label="Задачи и решения" aria-roledescription="карусель" @keydown.left.prevent="go(page - 1)" @keydown.right.prevent="go(page + 1)">
    <div class="notebook-spine" aria-hidden="true"><i v-for="i in 6" :key="i"><b></b></i><span>FIELD NOTES / 004</span></div>
    <div class="notebook-body">
      <div class="notebook-top"><span><b aria-hidden="true">✦</b> ЗАДАЧИ И РЕШЕНИЯ</span><span><strong>{{ number(page) }}</strong> / {{ number(tasks.length - 1) }}</span></div>
      <div class="notebook-stage">
        <article v-for="(item, i) in tasks" :key="i" class="notebook-paper" :class="{ 'notebook-front': i === page }" :style="i === page ? frontStyle : undefined" v-show="i === page || i === target" :aria-hidden="i !== page">
          <div class="notebook-meta"><span class="notebook-number">{{ number(i) }}<small> /</small></span><span class="notebook-badge">BRAND STRATEGY <b>✦</b></span></div>
          <h3>{{ item[0] }}</h3>
          <svg class="notebook-marker" viewBox="0 0 540 25" preserveAspectRatio="none" aria-hidden="true"><path d="M4 14 Q190 0 531 8 M40 22 Q265 10 501 19" /></svg>
          <p>{{ item[1] }}</p>
          <div class="notebook-footnote" aria-hidden="true"><span>ИССЛЕДОВАНИЕ → СТРАТЕГИЯ → РЕЗУЛЬТАТ</span><b>✦</b></div>
        </article>
        <div v-if="target !== null && !reduced()" class="notebook-curl" :class="{ reverse: direction < 0 }" :style="curlStyle" aria-hidden="true"><span>✦</span></div>
        <button v-for="dir in [-1, 1]" :key="dir" class="notebook-corner" :class="dir > 0 ? 'next' : 'prev'" :disabled="dir > 0 ? page === tasks.length - 1 : page === 0" :aria-label="dir > 0 ? 'Следующая страница' : 'Предыдущая страница'" @pointerdown="down($event, dir)" @pointermove="move" @pointerup="up($event)" @pointercancel="up($event, true)" @lostpointercapture="up($event, true)" @click="($event as MouseEvent).detail === 0 && go(page + dir)"><span aria-hidden="true"></span></button>
      </div>
      <div class="notebook-controls"><span class="notebook-hint"><span aria-hidden="true">↳</span> Потяните за угол страницы</span><nav aria-label="Страницы блокнота"><button v-for="(item, i) in tasks" :key="i" :aria-label="`Страница ${i + 1}: ${item[0]}`" :aria-pressed="page === i" @click="go(i)" @pointermove="magnet($event)" @pointerleave="magnet($event, true)">{{ number(i) }}</button></nav></div>
      <span class="notebook-sr" role="status" aria-live="polite">Страница {{ page + 1 }} из {{ tasks.length }}: {{ tasks[page]?.[0] }}</span>
    </div>
  </div>
</template>

<style scoped>
.notebook { --crimson: #c8102e; --sheet: #faf6ed; --obsidian: #282726; position: relative; isolation: isolate; display: flex; color: var(--obsidian); background: #e7dfcf; border: 1px solid #b6ad9e; border-radius: 4px 10px 10px 4px; box-shadow: 3px 4px 0 #faf6ed, 4px 5px 0 #b8ad99, 7px 8px 0 #e9e1d2, 8px 9px 0 #b8ad99, 0 24px 45px -25px #453e3655; }
.notebook-spine { flex: 0 0 76px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; padding-bottom: 30px; background: linear-gradient(90deg,#d9d1c2,#f0e9dc 60%,#d4cbbb); border-right: 1px solid #b7ad9d; }
.notebook-spine > span { position: absolute; bottom: 15px; font: 8px monospace; letter-spacing: 1px; writing-mode: vertical-rl; display: none; }
.notebook-spine i { width: 60px; height: 22px; position: relative; z-index: 5; margin-left: 25px; }
.notebook-spine i:before { content: ''; position: absolute; right: -3px; top: 1px; width: 15px; height: 20px; border-radius: 50%; background: #504a41; box-shadow: 1px 1px 2px #fff; }
.notebook-spine b { display: block; position: relative; height: 15px; margin-top: 2px; border: 1px solid #676764; border-radius: 9px; background: linear-gradient(180deg,#555752,#c5c7c3 16%,#fff 30%,#8c8f8b 47%,#535650 63%,#dadbd5 85%,#777a73); box-shadow: 0 5px 4px #38382f40, inset 4px 0 4px #fff9; overflow: hidden; }
.notebook-spine b:after { content: ''; position: absolute; inset: 0; background: linear-gradient(110deg,transparent 25%,#fff 48%,transparent 70%); transform: translateX(-110%); }
.notebook:hover .notebook-spine b:after { animation: ring-glint 1.5s ease both; }
.notebook-spine i:nth-child(2n) b:after { animation-delay: .15s; }
.notebook-body { flex: 1; min-width: 0; background: var(--sheet); border-radius: 0 10px 10px 0; padding: 28px clamp(20px,4vw,56px) 24px; }
.notebook-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; font: 700 12px/1.5 'Courier New',monospace; letter-spacing: .12em; padding-bottom: 20px; border-bottom: 1px solid #bdb4a6; }
.notebook-top > span:first-child { display: flex; align-items: center; gap: 12px; }
.notebook-top b { font-size: 24px; color: var(--crimson); }
.notebook-top strong { color: var(--crimson); }
.notebook-stage { position: relative; display: grid; perspective: 1600px; overflow: hidden; }
.notebook-paper { grid-area: 1/1; min-width: 0; position: relative; padding: 30px 36px 24px; background-color: var(--sheet); background-image: linear-gradient(#968b7510 1px,transparent 1px),linear-gradient(90deg,#968b7510 1px,transparent 1px); background-size: 22px 22px; min-height: 390px; }
.notebook-front { z-index: 2; }
.notebook-meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.notebook-number { font: 700 20px 'Courier New',monospace; color: var(--crimson); }
.notebook-number small { opacity: .5; }
.notebook-badge { display: flex; align-items: center; gap: 12px; border: 1px solid #9b9d97; border-radius: 30px; padding: 5px 13px; font: 10px 'Courier New',monospace; letter-spacing: .06em; background: linear-gradient(170deg,#fff 5%,#c1c2bc 40%,#f8f8f1 49%,#aeafa9 52%,#efefe8 90%); box-shadow: 1px 2px 2px #292b2520; transform: rotate(5deg); }
.notebook-badge b { font-size: 17px; }
.notebook-paper h3 { font-family: Arial,Helvetica,sans-serif; font-size: clamp(28px,4.1vw,58px); font-weight: 800; line-height: 1.04; letter-spacing: -.055em; text-transform: uppercase; max-width: 850px; margin: 28px 0 0; text-wrap: balance; }
.notebook-marker { display: block; width: min(70%,540px); height: 19px; overflow: visible; margin: 5px 0 20px; transform: rotate(-1deg); }
.notebook-marker path { fill: none; stroke: var(--crimson); stroke-width: 5; stroke-linecap: round; opacity: .9; }
.notebook-paper p { font: 17px/1.7 Arial,Helvetica,sans-serif; max-width: 700px; color: #514d47; margin: 0; }
.notebook-footnote { display: flex; align-items: center; justify-content: space-between; margin-top: 25px; gap: 12px; font: 9px/1.5 'Courier New',monospace; letter-spacing: .12em; color: #6a6258; }
.notebook-footnote b { color: var(--crimson); font-size: 38px; line-height: 1; transform: rotate(12deg); }
.notebook-curl { position: absolute; z-index: 3; top: -2%; bottom: -2%; pointer-events: none; border-radius: 48% 12% 12% 48% / 4% 2% 2% 4%; background: linear-gradient(90deg,#b8ab9440,#c5b89e 8%,#e9dfca 25%,#fffcf4 55%,#e4d8c0 82%,#aa9b81); transform-origin: center; }
.notebook-curl.reverse { background: linear-gradient(270deg,#b8ab9440,#c5b89e 8%,#e9dfca 25%,#fffcf4 55%,#e4d8c0 82%,#aa9b81); }
.notebook-curl span { position: absolute; top: 45%; left: 45%; color: #c8102e18; font-size: 45px; }
.notebook-corner { position: absolute; z-index: 4; bottom: 0; width: 52px; height: 52px; border: 0; padding: 0; background: transparent; touch-action: none; cursor: grab; }
.notebook-corner.next { right: 0; }
.notebook-corner.prev { left: 0; transform: scaleX(-1); }
.notebook-corner span { position: absolute; right: 0; bottom: 0; width: 32px; height: 32px; background: linear-gradient(135deg,#ddd0b8 42%,#fffcf6 49%,#b5a68d 51%,#e6ddcd 56%); clip-path: polygon(100% 0,100% 100%,0 100%); transition: width .3s,height .3s,filter .3s; }
.notebook-corner:hover span { width: 48px; height: 48px; filter: drop-shadow(-3px -3px 3px #352c3130); }
.notebook-corner:active { cursor: grabbing; }
.notebook-corner:disabled { visibility: hidden; }
.notebook-controls { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding-top: 20px; border-top: 1px solid #bdb4a6; }
.notebook-hint { color: #655d53; font: 12px/1.5 'Courier New',monospace; }
.notebook-hint > span { font-size: 24px; margin-right: 8px; color: var(--crimson); }
.notebook-controls nav { display: flex; gap: 8px; }
.notebook-controls button { position: relative; overflow: hidden; width: 46px; height: 46px; border: 1px solid #a79d8c; background: #faf6ed; color: var(--obsidian); font: 700 15px 'Courier New',monospace; cursor: pointer; }
.notebook-controls button[aria-pressed=true] { background: var(--crimson); color: #fff; border-color: var(--crimson); box-shadow: 0 4px 15px #c8102e25; }
.notebook-controls button:after { content: ''; position: absolute; inset: -50%; background: linear-gradient(110deg,transparent 35%,#ffffff70 50%,transparent 65%); transform: translateX(-100%); transition: transform .5s; }
.notebook-controls button:hover:after { transform: translateX(100%); }
.notebook button:focus-visible { outline: 3px solid var(--crimson); outline-offset: 3px; }
.notebook-corner:focus-visible { outline-offset: -4px; }
.notebook-sr { position: absolute; width: 1px; height: 1px; clip-path: inset(50%); overflow: hidden; }
@keyframes ring-glint { to { transform: translateX(110%); } }
@media(max-width:760px) {
  .notebook-spine { flex-basis: 32px; }
  .notebook-spine i { width: 31px; margin-left: 7px; }
  .notebook-spine b { height: 12px; }
  .notebook-body { padding: 18px 14px; }
  .notebook-top { font-size: 10px; letter-spacing: .02em; gap: 8px; }
  .notebook-top > span:first-child { gap: 6px; }
  .notebook-top > span:last-child { white-space: nowrap; }
  .notebook-paper { padding: 24px 12px 38px; min-height: 440px; }
  .notebook-paper h3 { font-size: clamp(27px,6vw,40px); overflow-wrap: anywhere; margin-top: 28px; }
  .notebook-paper p { font-size: 16px; line-height: 1.65; }
  .notebook-badge { font-size: 8px; padding: 4px 7px; gap: 5px; }
  .notebook-footnote { font-size: 8px; letter-spacing: .03em; }
  .notebook-controls { flex-wrap: wrap; gap: 14px; }
  .notebook-controls nav { margin-left: auto; }
  .notebook-hint { font-size: 10px; }
}
</style>
