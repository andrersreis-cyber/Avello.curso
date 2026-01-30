'use client'

import { useEffect } from 'react'
import { captureAffiliateRef, trackAffiliateClick, getAffiliateCookie } from '@/lib/affiliate'

/**
 * Componente que captura e rastreia referências de afiliados
 * Deve ser incluído no layout principal
 */
export function AffiliateTracker() {
  useEffect(() => {
    // Verificar se está no navegador
    if (typeof window === 'undefined') return
    
    // Captura o código do afiliado da URL ou cookie
    const refCode = captureAffiliateRef()
    
    // Se tiver código de afiliado na URL (primeira visita), registra o clique
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('ref')) {
      trackAffiliateClick(urlParams.get('ref')!)
    }
  }, [])

  // Componente invisível, só executa a lógica
  return null
}

/**
 * Hook para obter o código do afiliado atual
 */
export function useAffiliateCode() {
  if (typeof window === 'undefined') return null
  return getAffiliateCookie()
}
