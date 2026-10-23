// Public contact details. VITE_ values are embedded into the client bundle: never put secrets here.
export const siteConfig = {
  operator: import.meta.env.VITE_OPERATOR_NAME?.trim() || '',
  address: import.meta.env.VITE_OPERATOR_ADDRESS?.trim() || '',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || '',
  phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '',
  telegram: import.meta.env.VITE_CONTACT_TELEGRAM?.trim() || '',
  whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || '',
}

// Restrict the recipient used in a mailto URL so configuration cannot inject query parameters.
export const emailReady = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(siteConfig.email)
export const safeTelegram = /^https:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/.test(siteConfig.telegram) ? siteConfig.telegram : ''
export const safeWhatsapp = /^https:\/\/(wa\.me|api\.whatsapp\.com)\/[A-Za-z0-9/?=&]+$/.test(siteConfig.whatsapp) ? siteConfig.whatsapp : ''
