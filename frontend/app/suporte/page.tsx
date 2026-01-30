'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  HelpCircle,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Search,
  Send,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Zap,
  CreditCard,
  Users,
  Download,
  Settings,
  Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

const SUPPORT_EMAIL = 'andre.produtart@gmail.com'
const TELEGRAM_LINK = 'https://t.me/+LgHnVN3B_81hYzA5'

// Categorias do FAQ
const faqCategories = [
  { id: 'geral', name: 'Geral', icon: <HelpCircle className="w-5 h-5" /> },
  { id: 'acesso', name: 'Acesso', icon: <Shield className="w-5 h-5" /> },
  { id: 'pagamento', name: 'Pagamento', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'conteudo', name: 'Conteúdo', icon: <Download className="w-5 h-5" /> },
  { id: 'tecnico', name: 'Técnico', icon: <Settings className="w-5 h-5" /> },
]

// Perguntas frequentes
const faqs = [
  {
    category: 'geral',
    question: 'O que está incluído no plano?',
    answer: 'O plano inclui acesso a mais de 6.000 recursos: +2000 templates n8n, +3500 prompts ChatGPT, +3500 prompts Midjourney, +3000 templates Typebot, +14 mil ferramentas de IA, +350 softwares self-hosted, +30 SaaS white label e +8 bônus exclusivos. Você também tem acesso à comunidade no Telegram.'
  },
  {
    category: 'geral',
    question: 'Por quanto tempo tenho acesso?',
    answer: 'O plano Acesso Anual dá direito a 12 meses de acesso a todos os recursos e atualizações. Após esse período, você pode renovar para continuar tendo acesso.'
  },
  {
    category: 'geral',
    question: 'Os recursos são atualizados?',
    answer: 'Sim! Adicionamos novos templates, prompts e ferramentas regularmente. Você receberá todas as atualizações durante o período da sua assinatura.'
  },
  {
    category: 'acesso',
    question: 'Como acesso a área de membros?',
    answer: 'Após a confirmação do pagamento, você receberá um email com as instruções de acesso. Basta clicar no link e fazer login com o email cadastrado na compra.'
  },
  {
    category: 'acesso',
    question: 'Esqueci minha senha, o que faço?',
    answer: 'Na página de login, clique em "Esqueci minha senha" e informe seu email. Você receberá um link para redefinir sua senha.'
  },
  {
    category: 'acesso',
    question: 'Posso acessar de mais de um dispositivo?',
    answer: 'Sim! Você pode acessar a plataforma de quantos dispositivos quiser. Não há limite de dispositivos.'
  },
  {
    category: 'pagamento',
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos cartão de crédito (Visa, Mastercard, American Express) através do Stripe. O pagamento é processado de forma segura.'
  },
  {
    category: 'pagamento',
    question: 'Posso parcelar o pagamento?',
    answer: 'O parcelamento depende das condições do seu cartão de crédito. O Stripe permite parcelamento em até 12x dependendo do seu banco.'
  },
  {
    category: 'pagamento',
    question: 'Como funciona a garantia de 7 dias?',
    answer: 'Se você não ficar satisfeito por qualquer motivo, pode solicitar o reembolso total em até 7 dias após a compra. Basta entrar em contato pelo email de suporte.'
  },
  {
    category: 'pagamento',
    question: 'Recebo nota fiscal?',
    answer: 'Sim! A nota fiscal é enviada automaticamente para o email cadastrado após a confirmação do pagamento.'
  },
  {
    category: 'conteudo',
    question: 'Como faço download dos templates?',
    answer: 'Na área de membros, navegue até o módulo desejado e clique no template. Você verá o botão de download ou poderá copiar o JSON diretamente.'
  },
  {
    category: 'conteudo',
    question: 'Os templates funcionam em qualquer versão do n8n?',
    answer: 'Os templates são compatíveis com as versões mais recentes do n8n. Recomendamos manter seu n8n atualizado para melhor compatibilidade.'
  },
  {
    category: 'conteudo',
    question: 'Posso usar os templates comercialmente?',
    answer: 'Sim! Você pode usar todos os templates em projetos pessoais e comerciais. Não é permitido revender os templates como se fossem seus.'
  },
  {
    category: 'tecnico',
    question: 'Estou com erro ao importar um template, o que faço?',
    answer: 'Verifique se seu n8n está atualizado e se todas as credenciais necessárias estão configuradas. Se o problema persistir, entre em contato pelo suporte.'
  },
  {
    category: 'tecnico',
    question: 'Como configuro as credenciais no n8n?',
    answer: 'Após importar o template, o n8n mostrará quais credenciais são necessárias. Vá em Settings > Credentials e adicione as credenciais dos serviços utilizados (como OpenAI, Google, etc).'
  },
  {
    category: 'tecnico',
    question: 'Preciso de servidor para usar os templates?',
    answer: 'Para templates n8n, você precisa ter o n8n instalado (pode ser local ou em servidor). Para prompts e outros recursos, basta acessar a plataforma pelo navegador.'
  },
]

export default function SuportePage() {
  const [activeCategory, setActiveCategory] = useState('geral')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Filtra FAQs por categoria e busca
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    // Simula envio (em produção, enviaria para API)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Abre o cliente de email com os dados preenchidos
    const subject = encodeURIComponent(formData.subject)
    const body = encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
    )
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    
    setSending(false)
    setSent(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    setTimeout(() => setSent(false), 5000)
  }

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
      <section className="py-12 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <HelpCircle className="w-8 h-8 text-cyan-400" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Central de Suporte
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-cyan-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0088cc] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Comunidade
                </h3>
                <p className="text-sm text-zinc-400">Tire dúvidas no Telegram</p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 ml-auto" />
            </a>
            
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-cyan-500/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Email
                </h3>
                <p className="text-sm text-zinc-400">{SUPPORT_EMAIL}</p>
              </div>
            </a>
            
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Resposta Rápida</h3>
                <p className="text-sm text-zinc-400">Até 24 horas úteis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Perguntas Frequentes</h2>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar nas perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === 'all'
                  ? "bg-cyan-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              )}
            >
              Todas
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                )}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                Nenhuma pergunta encontrada para "{searchTerm}"
              </div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-medium text-white pr-4">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Não encontrou sua resposta?</h2>
          <p className="text-zinc-400 mb-6">
            Envie sua dúvida ou problema e responderemos em até 24 horas úteis.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Assunto
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">Selecione um assunto</option>
                <option value="Dúvida sobre acesso">Dúvida sobre acesso</option>
                <option value="Problema técnico">Problema técnico</option>
                <option value="Dúvida sobre pagamento">Dúvida sobre pagamento</option>
                <option value="Solicitação de reembolso">Solicitação de reembolso</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Parceria">Parceria</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Mensagem
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Descreva sua dúvida ou problema em detalhes..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : sent ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Enviado!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2026 Avello. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
