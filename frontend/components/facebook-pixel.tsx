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
  return (
    <>
      {/* Bootstrap: cria o stub fbq ANTES de carregar o SDK */}
      <Script
        id="fb-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixelId}');
            fbq('track','PageView');
            window.avelloPixel={
              cadastro:function(){fbq('track','CompleteRegistration',{content_name:'Avello',currency:'BRL',value:0})},
              purchase:function(p,v){fbq('track','Purchase',{content_name:p||'Avello Premium',currency:'BRL',value:v||39})}
            };
          `,
        }}
      />
      {/* Carrega o SDK depois que o stub esta pronto */}
      <Script
        id="fb-sdk"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
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
