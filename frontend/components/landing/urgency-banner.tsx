'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Users, ShoppingCart } from 'lucide-react'

const NOMES = [
  'Lucas', 'Pedro', 'Gabriel', 'Mateus', 'Rafael', 'Thiago', 'Bruno', 'Diego',
  'Felipe', 'Guilherme', 'João', 'Carlos', 'André', 'Rodrigo', 'Marcelo',
  'Ana', 'Maria', 'Juliana', 'Fernanda', 'Patricia', 'Amanda', 'Camila',
  'Beatriz', 'Larissa', 'Vanessa', 'Mariana', 'Leticia', 'Renata', 'Claudia'
]

const CIDADES = [
  'SP', 'RJ', 'BH', 'Curitiba', 'Porto Alegre', 'Fortaleza', 'Salvador',
  'Recife', 'Manaus', 'Belém', 'Goiânia', 'Florianópolis', 'Campinas', 'Natal'
]

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface Notification {
  id: number
  text: string
}

export function UrgencyBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [vagas, setVagas] = useState(940) // 1000 - 60 já preenchidas
  const [notification, setNotification] = useState<Notification | null>(null)
  const [notifId, setNotifId] = useState(0)

  const showNotification = useCallback(() => {
    const nome = getRandom(NOMES)
    const cidade = getRandom(CIDADES)
    const id = notifId + 1
    setNotifId(id)
    setNotification({ id, text: `${nome} de ${cidade} acabou de entrar` })
    setVagas(prev => Math.max(prev - 1, 800))
    setTimeout(() => setNotification(null), 3500)
  }, [notifId])

  useEffect(() => {
    // Primeira notificação após 8s, depois a cada 20-50s
    const initialDelay = setTimeout(() => {
      showNotification()
    }, 8000)

    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 30000 + 20000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const preenchidas = 1000 - vagas
  const percentual = (preenchidas / 1000) * 100

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-30 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-orange-600/97 to-red-700/97 backdrop-blur-sm px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Notificação de compra */}
            <div className="relative flex-shrink-0">
              {notification ? (
                <div
                  key={notification.id}
                  className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 animate-pulse"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-white flex-shrink-0" />
                  <span className="text-xs text-white font-medium whitespace-nowrap">{notification.text}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-white/80 flex-shrink-0" />
                </div>
              )}
            </div>

            {/* Barra de progresso + vagas */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-[80px] max-w-[140px]">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${percentual}%` }}
                  />
                </div>
              </div>
              <span className="text-xs text-white/90 font-semibold whitespace-nowrap">
                <span className="text-white font-bold">{vagas}</span> vagas restantes
              </span>
            </div>

            <p className="hidden sm:block text-sm text-white font-medium whitespace-nowrap">
              R$39/ano → sobe para R$97 após 1.000 membros
            </p>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
