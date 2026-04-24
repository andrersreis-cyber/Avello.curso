interface LeadProperties {
  nivel: 1 | 2 | 3 | 4
  classe: string
}

export function trackViewContent(contentName: string): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'ViewContent', { content_name: contentName })
}

export function trackLead(properties: LeadProperties): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'Lead', {
    content_name: `nível ${properties.nivel} · ${properties.classe}`,
    nivel: properties.nivel,
  })
}

export function trackInitiateCheckout(valor: number): void {
  if (typeof window === 'undefined') return
  window.fbq?.('track', 'InitiateCheckout', {
    value: valor,
    currency: 'BRL',
    content_name: 'operador-completo',
  })
}
