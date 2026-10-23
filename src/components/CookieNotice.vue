<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Choice = 'accepted' | 'rejected'
const key = 'case-portfolio-cookie-choice-v1'
const visible = ref(false)
const current = ref<Choice | null>(null)

onMounted(() => {
  try {
    const saved = localStorage.getItem(key)
    if (saved === 'accepted' || saved === 'rejected') current.value = saved
  } catch { /* Private mode can disable storage; the choice still works for this visit. */ }
  visible.value = current.value === null
  window.addEventListener('open-cookie-settings', openSettings)
})

onUnmounted(() => window.removeEventListener('open-cookie-settings', openSettings))

function openSettings() { visible.value = true }

function choose(choice: Choice) {
  current.value = choice
  visible.value = false
  try { localStorage.setItem(key, choice) } catch { /* No persistence when browser storage is blocked. */ }
  // Future analytics must subscribe to this event and load only after explicit acceptance.
  window.dispatchEvent(new CustomEvent('cookie-choice', { detail: choice }))
}
</script>

<template>
  <aside v-if="visible" class="cookie-banner" aria-label="Настройки файлов cookie">
    <div><strong>Настройки хранения</strong><p>Сайт сохраняет ваш выбор и настройку анимации в браузере. Необязательные cookie сейчас не используются. Если аналитика появится позже, её потребуется подключить только после согласия. <a href="#/privacy">Подробнее в политике</a>.</p></div>
    <div class="cookie-actions"><button type="button" class="button outline" @click="choose('rejected')">Отклонить необязательные</button><button type="button" class="button dark" @click="choose('accepted')">Разрешить</button></div>
  </aside>
</template>
