'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function FacebookPixel() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window.fbq === 'undefined') return
    window.fbq('track', 'PageView')
  }, [pathname, searchParams])

  return null
}

export function FacebookPixelScript({ pixelId }: { pixelId: string }) {
  const handleLoad = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('init', pixelId)
      window.avelloPixel = {
        cadastro: function () {
          window.fbq('track', 'CompleteRegistration', { content_name: 'Avello', currency: 'BRL', value: 0 })
        },
        purchase: function (plano?: string, valor?: number) {
          window.fbq('track', 'Purchase', { content_name: plano || 'Avello Premium', currency: 'BRL', value: valor || 39 })
        },
      }
    }
  }

  return (
    <>
      <Script
        id="fb-sdk"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
        onLoad={handleLoad}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}
