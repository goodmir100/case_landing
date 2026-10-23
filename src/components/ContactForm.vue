<script setup lang="ts">
import { reactive, ref } from 'vue'
import { emailReady, siteConfig } from '../site-config'

const props = defineProps<{ idPrefix: string; dark?: boolean }>()

const form = reactive({ name: '', email: '', message: '', consent: false })
const errors = reactive({ name: '', email: '', message: '', consent: '' })
const status = ref('')

function validateField(field: keyof typeof errors) {
  // Limits are enforced before building a mailto URL; a future API must repeat validation server-side.
  if (field === 'name') errors.name = form.name.trim().length < 2 || form.name.trim().length > 100 ? 'Укажите имя от 2 до 100 символов.' : ''
  if (field === 'email') errors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.length > 254 ? 'Укажите корректный email.' : ''
  if (field === 'message') errors.message = form.message.trim().length < 10 || form.message.trim().length > 3000 ? 'Опишите задачу: от 10 до 3000 символов.' : ''
  if (field === 'consent') errors.consent = form.consent ? '' : 'Подтвердите согласие на обработку данных.'
}

function validate() {
  ;(['name', 'email', 'message', 'consent'] as const).forEach(validateField)
  return !Object.values(errors).some(Boolean)
}

function submit() {
  status.value = ''
  if (!validate()) {
    // Native focus is more reliable than an alert-only error on keyboard and mobile.
    const first = (['name', 'email', 'message', 'consent'] as const).find(field => errors[field])
    if (first) document.getElementById(`${props.idPrefix}-${first}`)?.focus()
    return
  }
  if (!emailReady) {
    status.value = 'Отправка недоступна: владелец сайта ещё не указал адрес для обращений.'
    return
  }
  const subject = encodeURIComponent('Обращение с сайта')
  const body = encodeURIComponent(`Имя: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\nЗадача:\n${form.message.trim()}`)
  // mailto only opens the user's email client. We must never claim the message was delivered.
  window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
  status.value = 'Открылось почтовое приложение. Проверьте письмо и нажмите «Отправить».'
}
</script>

<template>
  <form class="contact-form" :class="{ 'contact-form-dark': dark }" novalidate @submit.prevent="submit">
    <label :for="`${idPrefix}-name`">Ваше имя</label>
    <input :id="`${idPrefix}-name`" v-model="form.name" name="name" autocomplete="name" maxlength="100" :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? `${idPrefix}-name-error` : undefined" @blur="validateField('name')" />
    <span v-if="errors.name" :id="`${idPrefix}-name-error`" class="field-error">{{ errors.name }}</span>

    <label :for="`${idPrefix}-email`">Email для ответа</label>
    <input :id="`${idPrefix}-email`" v-model="form.email" name="email" type="email" inputmode="email" autocomplete="email" spellcheck="false" maxlength="254" :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? `${idPrefix}-email-error` : undefined" @blur="validateField('email')" />
    <span v-if="errors.email" :id="`${idPrefix}-email-error`" class="field-error">{{ errors.email }}</span>

    <label :for="`${idPrefix}-message`">Расскажите о задаче</label>
    <textarea :id="`${idPrefix}-message`" v-model="form.message" name="message" rows="5" maxlength="3000" :aria-invalid="Boolean(errors.message)" :aria-describedby="errors.message ? `${idPrefix}-message-error` : undefined" @blur="validateField('message')"></textarea>
    <span v-if="errors.message" :id="`${idPrefix}-message-error`" class="field-error">{{ errors.message }}</span>

    <label class="consent-label" :for="`${idPrefix}-consent`"><input :id="`${idPrefix}-consent`" v-model="form.consent" type="checkbox" :aria-invalid="Boolean(errors.consent)" @change="validateField('consent')" /> <span>Я ознакомился(-ась) с <a href="#/privacy">политикой конфиденциальности</a> и согласен(-на) на обработку данных для ответа на обращение.</span></label>
    <span v-if="errors.consent" class="field-error">{{ errors.consent }}</span>
    <button class="button" :class="dark ? 'pink-button' : 'dark'" type="submit">Открыть письмо ↗</button>
    <p class="form-status" role="status">{{ status }}</p>
    <small>Данные остаются в браузере до открытия почтового приложения. Письмо отправляется только после вашего подтверждения в нём.</small>
  </form>
</template>
