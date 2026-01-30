'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Copy, 
  Check,
  Users,
  MousePointerClick,
  DollarSign,
  TrendingUp,
  Gift,
  Share2,
  Sparkles,
  ChevronRight,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dados mockados (em produção viriam do Supabase)
const mockAffiliateData = {
  codigo: 'AVELLO2026',
  nome: 'Afiliado Demo',
  comissao_percentual: 30,
  total_cliques: 1247,
  total_vendas: 23,
  total_comissao: 269.10,
  comissao_pendente: 78.00,
  comissao_aprovada: 117.00,
  comissao_paga: 74.10,
  taxa_conversao: 1.84,
}

const mockCommissions = [
  { id: 1, data: '2026-01-28', produto: 'Acesso Anual', valor_venda: 39.00, comissao: 11.70, status: 'paid' },
  { id: 2, data: '2026-01-27', produto: 'Consultoria 1h', valor_venda: 297.00, comissao: 89.10, status: 'approved' },
  { id: 3, data: '2026-01-26', produto: 'Acesso Anual', valor_venda: 39.00, comissao: 11.70, status: 'pending' },
  { id: 4, data: '2026-01-25', produto: 'Pack Templates Premium', valor_venda: 97.00, comissao: 29.10, status: 'paid' },
  { id: 5, data: '2026-01-24', produto: 'Acesso Anual', valor_venda: 39.00, comissao: 11.70, status: 'pending' },
]

const benefits = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: '30% de Comissão',
    description: 'Ganhe 30% em cada venda realizada através do seu link'
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Pagamento Rápido',
    description: 'Receba suas comissões via PIX em até 7 dias úteis'
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Dashboard Completo',
    description: 'Acompanhe cliques, vendas e comissões em tempo real'
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: 'Materiais Prontos',
    description: 'Banners, textos e estratégias para divulgação'
  }
]

export default function AfiliadosPage() {
  const [copied, setCopied] = useState(false)
  const [isAffiliate] = useState(true) // Em produção, verificar se usuário é afiliado
  
  const affiliateLink = `https://avello.com.br/?ref=${mockAffiliateData.codigo}`
  
  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/10'
      case 'approved': return 'text-blue-400 bg-blue-500/10'
      case 'pending': return 'text-yellow-400 bg-yellow-500/10'
      default: return 'text-zinc-400 bg-zinc-500/10'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'approved': return 'Aprovado'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  // Se não for afiliado, mostrar página de cadastro
  if (!isAffiliate) {
    return <AffiliateSignup />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para Área de Membros</span>
        </Link>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/30">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">Afiliado Ativo</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header do Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Painel do Afiliado</h1>
            <p className="text-zinc-400">Bem-vindo, {mockAffiliateData.nome}!</p>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors">
            <Wallet className="w-5 h-5" />
            Solicitar Saque
          </button>
        </div>

        {/* Link de Afiliado */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 border border-cyan-500/30 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Seu Link de Afiliado</h2>
              <p className="text-sm text-zinc-400">Compartilhe e ganhe {mockAffiliateData.comissao_percentual}% em cada venda</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <span className="text-zinc-300 truncate">{affiliateLink}</span>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                copied
                  ? "bg-green-600 text-white"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Link
                </>
              )}
            </button>
          </div>
          
          {/* Social Share */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-700">
            <span className="text-sm text-zinc-400">Compartilhar:</span>
            <div className="flex gap-2">
              <SocialButton icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp" color="bg-green-600" />
              <SocialButton icon={<Instagram className="w-4 h-4" />} label="Instagram" color="bg-pink-600" />
              <SocialButton icon={<Twitter className="w-4 h-4" />} label="Twitter" color="bg-blue-500" />
              <SocialButton icon={<Facebook className="w-4 h-4" />} label="Facebook" color="bg-blue-600" />
              <SocialButton icon={<Linkedin className="w-4 h-4" />} label="LinkedIn" color="bg-blue-700" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<MousePointerClick className="w-5 h-5" />}
            label="Total de Cliques"
            value={mockAffiliateData.total_cliques.toLocaleString()}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Vendas Realizadas"
            value={mockAffiliateData.total_vendas.toString()}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Taxa de Conversão"
            value={`${mockAffiliateData.taxa_conversao}%`}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Ganho"
            value={formatCurrency(mockAffiliateData.total_comissao)}
            color="from-yellow-500 to-orange-500"
          />
        </div>

        {/* Comissões por Status */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-zinc-400">Pendente</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(mockAffiliateData.comissao_pendente)}</p>
          </div>
          
          <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-zinc-400">Aprovado</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{formatCurrency(mockAffiliateData.comissao_aprovada)}</p>
          </div>
          
          <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-green-400" />
              <span className="text-sm text-zinc-400">Pago</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(mockAffiliateData.comissao_paga)}</p>
          </div>
        </div>

        {/* Histórico de Comissões */}
        <div className="bg-zinc-800/50 rounded-2xl border border-zinc-700 overflow-hidden">
          <div className="p-6 border-b border-zinc-700">
            <h2 className="text-xl font-semibold">Histórico de Comissões</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Data</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">Produto</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">Valor Venda</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">Comissão</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-zinc-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {mockCommissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-zinc-800/50">
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {new Date(commission.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {commission.produto}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300 text-right">
                      {formatCurrency(commission.valor_venda)}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-400 font-medium text-right">
                      {formatCurrency(commission.comissao)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        getStatusColor(commission.status)
                      )}>
                        {getStatusLabel(commission.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de card de estatística
function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  color: string 
}) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br",
        color
      )}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  )
}

// Botão de compartilhamento social
function SocialButton({ 
  icon, 
  label, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  color: string 
}) {
  return (
    <button
      title={label}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-opacity hover:opacity-80",
        color
      )}
    >
      {icon}
    </button>
  )
}

// Página de cadastro de afiliado
function AffiliateSignup() {
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Programa de Afiliados</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ganhe dinheiro indicando a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Avello
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Torne-se um afiliado e receba 30% de comissão em cada venda realizada 
            através do seu link exclusivo.
          </p>

          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-green-500/25">
            <Users className="w-6 h-6" />
            Quero ser Afiliado
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Por que ser afiliado?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-green-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-zinc-400 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Como funciona?</h2>
          
          <div className="space-y-6">
            <Step 
              number={1} 
              title="Cadastre-se como afiliado" 
              description="Preencha o formulário com seus dados e aguarde a aprovação."
            />
            <Step 
              number={2} 
              title="Receba seu link exclusivo" 
              description="Após aprovado, você terá acesso ao seu link personalizado."
            />
            <Step 
              number={3} 
              title="Divulgue para sua audiência" 
              description="Compartilhe o link nas redes sociais, grupos e para conhecidos."
            />
            <Step 
              number={4} 
              title="Ganhe comissões" 
              description="A cada venda realizada pelo seu link, você ganha 30% de comissão."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2026 Avello. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}

function Step({ 
  number, 
  title, 
  description 
}: { 
  number: number
  title: string
  description: string 
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0">
        <span className="text-lg font-bold text-white">{number}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-zinc-400">{description}</p>
      </div>
    </div>
  )
}
