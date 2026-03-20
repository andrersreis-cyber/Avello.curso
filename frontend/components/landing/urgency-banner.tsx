'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function UrgencyBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-30 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-orange-600/95 to-red-600/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
            <p className="text-sm md:text-base text-white font-medium">
              Preço de lançamento: Premium por R$39/ano. Após 1.000 membros, sobe para R$97/ano.
            </p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/80 hover:text-white transition-colors flex-shrink-0"
            aria-label="Fechar aviso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
