// Utilitários para o programa de afiliados

const AFFILIATE_COOKIE_NAME = 'avello_ref'
const AFFILIATE_COOKIE_DAYS = 30 // Cookie válido por 30 dias

/**
 * Salva o código do afiliado no cookie
 */
export function setAffiliateCookie(code: string) {
  if (typeof document === 'undefined') return
  const expires = new Date()
  expires.setTime(expires.getTime() + AFFILIATE_COOKIE_DAYS * 24 * 60 * 60 * 1000)
  document.cookie = `${AFFILIATE_COOKIE_NAME}=${code};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

/**
 * Obtém o código do afiliado do cookie
 */
export function getAffiliateCookie(): string | null {
  if (typeof document === 'undefined') return null
  const name = AFFILIATE_COOKIE_NAME + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';')
  
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length)
    }
  }
  return null
}

/**
 * Remove o cookie do afiliado
 */
export function clearAffiliateCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AFFILIATE_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

/**
 * Captura o parâmetro ?ref da URL e salva no cookie
 * Deve ser chamado no carregamento da página
 */
export function captureAffiliateRef() {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const refCode = urlParams.get('ref')
  
  if (refCode) {
    setAffiliateCookie(refCode)
    
    // Remove o parâmetro da URL sem recarregar a página (opcional, para URL limpa)
    const newUrl = window.location.pathname + window.location.hash
    window.history.replaceState({}, '', newUrl)
    
    return refCode
  }
  
  return getAffiliateCookie()
}

/**
 * Registra um clique de afiliado no servidor
 */
export async function trackAffiliateClick(code: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  try {
    await fetch('/api/affiliate/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code,
        referrer: document.referrer,
        landingPage: window.location.href
      })
    })
  } catch (error) {
    console.error('Erro ao registrar clique:', error)
  }
}
