'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  Clock, 
  Server, 
  Package, 
  Infinity,
  Users,
  Loader2,
  ShoppingCart,
  Star,
  Shield
} from 'lucide-react'
import { products, ProductId } from '@/lib/stripe'
import { getAffiliateCookie } from '@/lib/affiliate'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { ExitIntentPopup } from '@/components/exit-intent-popup'

const productIcons: Record<ProductId, React.ReactNode> = {
  starter: <Shield className="w-6 h-6" />,
  lowtik: <Crown className="w-6 h-6" />,
  consultoria: <Clock className="w-6 h-6" />,
  setup_n8n: <Server className="w-6 h-6" />,
  pack_premium: <Package className="w-6 h-6" />,
  acesso_vitalicio: <Infinity className="w-6 h-6" />,
  mentoria_mensal: <Users className="w-6 h-6" />,
}

const productColors: Record<ProductId, string> = {
  starter: 'from-green-500 to-emerald-600',
  lowtik: 'from-cyan-500 to-blue-600',
  consultoria: 'from-purple-500 to-pink-600',
  setup_n8n: 'from-orange-500 to-red-600',
  pack_premium: 'from-emerald-500 to-green-600',
  acesso_vitalicio: 'from-yellow-500 to-amber-600',
  mentoria_mensal: 'from-violet-500 to-purple-600',
}

export default function LojaPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null)
  const { user, isStarter } = useAuth()
  
  useEffect(() => {
    const code = getAffiliateCookie()
    if (code) setAffiliateCode(code)
  }, [])

  // [PIXEL] ViewContent — dispara quando usuário chega na página da loja (intenção de compra)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Avello Premium',
        content_ids: ['lowtik'],
        content_type: 'product',
        value: 39,
        currency: 'BRL',
      })
    }
  }, [])
  
  const handleCheckout = async (productId: ProductId) => {
    setLoading(productId)
    
    // Track Facebook Pixel - InitiateCheckout
    if (typeof window !== 'undefined' && window.fbq) {
      const product = products[productId]
      window.fbq('track', 'InitiateCheckout', {
        content_name: product.name,
        content_ids: [productId],
        content_type: 'product',
        value: product.price / 100,
        currency: 'BRL',
      })
    }
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, affiliateCode, customerEmail: user?.email }),
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao processar pagamento. Tente novamente em instantes.')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setLoading(null)
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100)
  }
  
  // Separar produtos: Premium como principal, Starter e serviços como adicionais
  const mainProduct = products.lowtik
  const additionalProducts = Object.entries(products).filter(([id]) => id !== 'lowtik')

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-700 flex items-center px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para Área de Membros</span>
        </Link>
      </header>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-6">
            <ShoppingCart className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Loja Avello</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Acelere seus resultados
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Escolha o plano ideal para você e desbloqueie todo o potencial da automação com IA
          </p>
        </div>
      </section>

      {/* Plano Principal */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {isStarter && (
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
              <p className="text-cyan-400 font-medium">
                Faça upgrade para desbloquear todos os 6.000+ recursos
              </p>
            </div>
          )}
          <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-cyan-500/30 overflow-hidden">
            {/* Destaque */}
            <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-bl-2xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-sm font-bold text-white">MAIS POPULAR</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{mainProduct.name}</h2>
                    <p className="text-zinc-400">Acesso completo por 12 meses</p>
                  </div>
                </div>
                
                <p className="text-zinc-300 mb-6">{mainProduct.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {mainProduct.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Preço e CTA */}
              <div className="lg:w-72 flex flex-col items-center justify-center p-6 bg-zinc-800/50 rounded-2xl relative">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded">LANÇAMENTO</span>
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">{formatPrice(mainProduct.price)}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-1">por ano</p>
                  <p className="text-cyan-400 text-sm mt-2">
                    Apenas {formatPrice(mainProduct.price / 12)}/mês
                  </p>
                </div>
                
                <button
                  onClick={() => handleCheckout('lowtik')}
                  disabled={loading !== null}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading === 'lowtik' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Assinar Agora
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-2 mt-4 text-zinc-500 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Pagamento seguro via Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos e Serviços Adicionais */}
      <section className="py-12 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Plano Starter e Serviços</h2>
            <p className="text-zinc-400">Comece pelo Starter ou potencialize com serviços adicionais</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalProducts.map(([id, product]) => (
              <div 
                key={id}
                className={cn(
                  "bg-zinc-800/50 rounded-2xl p-6 border transition-all hover:scale-[1.02]",
                  (product as any).highlight 
                    ? "border-yellow-500/30 hover:border-yellow-500/50" 
                    : "border-zinc-700 hover:border-zinc-600"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                    productColors[id as ProductId]
                  )}>
                    {productIcons[id as ProductId]}
                  </div>
                  
                  {product.type === 'subscription' && (
                    <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                      Recorrente
                    </span>
                  )}
                </div>
                
                {/* Info */}
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                {/* Features */}
                <div className="space-y-2 mb-6">
                  {product.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                  {product.features.length > 4 && (
                    <p className="text-xs text-zinc-500">+{product.features.length - 4} benefícios</p>
                  )}
                </div>
                
                {/* Preço */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
                  {product.type === 'subscription' && (
                    <span className="text-zinc-400 text-sm">
                      /{(product as any).interval === 'month' ? 'mês' : 'ano'}
                    </span>
                  )}
                </div>
                
                {/* CTA */}
                <button
                  onClick={() => handleCheckout(id as ProductId)}
                  disabled={loading !== null}
                  className={cn(
                    "w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50",
                    (product as any).highlight
                      ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white"
                      : "bg-zinc-700 hover:bg-zinc-600 text-white"
                  )}
                >
                  {loading === id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Comprar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Garantia de 7 dias</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Se por qualquer motivo você não ficar satisfeito, devolvemos 100% do seu dinheiro 
            nos primeiros 7 dias. Sem perguntas.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2026 Avello. Todos os direitos reservados.
        </div>
      </footer>

      <ExitIntentPopup
        onCheckout={handleCheckout}
        loading={loading !== null}
      />
    </div>
  )
}
