'use client'

import { useState } from 'react'
import { 
  Gift, Cloud, Code, Database, Mail, Image,
  Globe, Shield, BarChart, Zap, FileText, Video,
  MessageSquare, Smartphone, Search, ExternalLink,
  ChevronRight, Sparkles, Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UpgradeModal } from './upgrade-modal'

// Categorias de ferramentas gratuitas
const freeToolsCategories = [
  {
    id: 'hosting',
    name: 'Hospedagem Gratuita',
    icon: Cloud,
    count: 28,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { name: 'Vercel', desc: 'Deploy frontend grátis', url: 'https://vercel.com', free: 'Hobby tier gratuito' },
      { name: 'Netlify', desc: 'JAMstack hosting', url: 'https://netlify.com', free: '100GB bandwidth/mês' },
      { name: 'Railway', desc: 'Deploy apps', url: 'https://railway.app', free: '$5 créditos/mês' },
      { name: 'Render', desc: 'Cloud platform', url: 'https://render.com', free: 'Static sites grátis' },
      { name: 'Fly.io', desc: 'Deploy globally', url: 'https://fly.io', free: '3 VMs gratuitas' },
      { name: 'Cloudflare Pages', desc: 'Fast hosting', url: 'https://pages.cloudflare.com', free: 'Ilimitado' },
    ]
  },
  {
    id: 'database',
    name: 'Banco de Dados',
    icon: Database,
    count: 22,
    color: 'from-green-500 to-emerald-500',
    tools: [
      { name: 'Supabase', desc: 'Postgres + Auth', url: 'https://supabase.com', free: '500MB database' },
      { name: 'PlanetScale', desc: 'MySQL serverless', url: 'https://planetscale.com', free: '5GB storage' },
      { name: 'MongoDB Atlas', desc: 'NoSQL cloud', url: 'https://mongodb.com/atlas', free: '512MB storage' },
      { name: 'Neon', desc: 'Serverless Postgres', url: 'https://neon.tech', free: '3GB storage' },
      { name: 'Turso', desc: 'Edge database', url: 'https://turso.tech', free: '9GB storage' },
      { name: 'Upstash', desc: 'Redis serverless', url: 'https://upstash.com', free: '10K commands/dia' },
    ]
  },
  {
    id: 'auth',
    name: 'Autenticação',
    icon: Shield,
    count: 15,
    color: 'from-purple-500 to-pink-500',
    tools: [
      { name: 'Clerk', desc: 'Auth completo', url: 'https://clerk.com', free: '10K MAU' },
      { name: 'Auth0', desc: 'Identity platform', url: 'https://auth0.com', free: '7K MAU' },
      { name: 'Supabase Auth', desc: 'Auth + Postgres', url: 'https://supabase.com/auth', free: 'Ilimitado' },
      { name: 'Firebase Auth', desc: 'Google auth', url: 'https://firebase.google.com', free: 'Ilimitado' },
      { name: 'Kinde', desc: 'Modern auth', url: 'https://kinde.com', free: '7.5K MAU' },
      { name: 'WorkOS', desc: 'Enterprise SSO', url: 'https://workos.com', free: '1M MAU' },
    ]
  },
  {
    id: 'email',
    name: 'Email & Marketing',
    icon: Mail,
    count: 20,
    color: 'from-red-500 to-orange-500',
    tools: [
      { name: 'Resend', desc: 'Email API', url: 'https://resend.com', free: '3K emails/mês' },
      { name: 'Mailchimp', desc: 'Email marketing', url: 'https://mailchimp.com', free: '500 contatos' },
      { name: 'Brevo', desc: 'Marketing suite', url: 'https://brevo.com', free: '300 emails/dia' },
      { name: 'Mailgun', desc: 'Email API', url: 'https://mailgun.com', free: '100 emails/dia' },
      { name: 'Buttondown', desc: 'Newsletter', url: 'https://buttondown.email', free: '100 subscribers' },
      { name: 'EmailOctopus', desc: 'Email marketing', url: 'https://emailoctopus.com', free: '2.5K subscribers' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart,
    count: 18,
    color: 'from-indigo-500 to-purple-500',
    tools: [
      { name: 'Plausible', desc: 'Privacy analytics', url: 'https://plausible.io', free: 'Self-hosted grátis' },
      { name: 'Umami', desc: 'Simple analytics', url: 'https://umami.is', free: 'Open source' },
      { name: 'PostHog', desc: 'Product analytics', url: 'https://posthog.com', free: '1M events/mês' },
      { name: 'Mixpanel', desc: 'User analytics', url: 'https://mixpanel.com', free: '20M events/mês' },
      { name: 'Amplitude', desc: 'Product analytics', url: 'https://amplitude.com', free: '10M events/mês' },
      { name: 'Google Analytics', desc: 'Web analytics', url: 'https://analytics.google.com', free: 'Ilimitado' },
    ]
  },
  {
    id: 'ai',
    name: 'Inteligência Artificial',
    icon: Sparkles,
    count: 25,
    color: 'from-violet-500 to-fuchsia-500',
    tools: [
      { name: 'OpenAI', desc: 'GPT API', url: 'https://openai.com', free: '$5 créditos iniciais' },
      { name: 'Anthropic', desc: 'Claude API', url: 'https://anthropic.com', free: '$5 créditos' },
      { name: 'Groq', desc: 'Fast inference', url: 'https://groq.com', free: 'Tier gratuito' },
      { name: 'Together AI', desc: 'Open models', url: 'https://together.ai', free: '$25 créditos' },
      { name: 'Replicate', desc: 'ML models', url: 'https://replicate.com', free: 'Pay per use' },
      { name: 'Hugging Face', desc: 'ML hub', url: 'https://huggingface.co', free: 'Inference API grátis' },
    ]
  },
  {
    id: 'storage',
    name: 'Armazenamento',
    icon: Cloud,
    count: 16,
    color: 'from-cyan-500 to-teal-500',
    tools: [
      { name: 'Cloudflare R2', desc: 'Object storage', url: 'https://cloudflare.com/r2', free: '10GB storage' },
      { name: 'Uploadthing', desc: 'File uploads', url: 'https://uploadthing.com', free: '2GB storage' },
      { name: 'Cloudinary', desc: 'Media storage', url: 'https://cloudinary.com', free: '25GB bandwidth' },
      { name: 'ImageKit', desc: 'Image CDN', url: 'https://imagekit.io', free: '20GB bandwidth' },
      { name: 'Bunny CDN', desc: 'Fast CDN', url: 'https://bunny.net', free: '14 dias trial' },
      { name: 'Backblaze B2', desc: 'Cloud storage', url: 'https://backblaze.com', free: '10GB storage' },
    ]
  },
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    icon: Code,
    count: 30,
    color: 'from-gray-600 to-zinc-500',
    tools: [
      { name: 'GitHub', desc: 'Code hosting', url: 'https://github.com', free: 'Repos ilimitados' },
      { name: 'GitLab', desc: 'DevOps platform', url: 'https://gitlab.com', free: '400 CI minutes/mês' },
      { name: 'Sentry', desc: 'Error tracking', url: 'https://sentry.io', free: '5K errors/mês' },
      { name: 'LogRocket', desc: 'Session replay', url: 'https://logrocket.com', free: '1K sessions/mês' },
      { name: 'Linear', desc: 'Issue tracking', url: 'https://linear.app', free: 'Até 250 issues' },
      { name: 'Figma', desc: 'Design tool', url: 'https://figma.com', free: '3 projetos' },
    ]
  },
  {
    id: 'communication',
    name: 'Comunicação',
    icon: MessageSquare,
    count: 18,
    color: 'from-blue-600 to-indigo-500',
    tools: [
      { name: 'Discord', desc: 'Community chat', url: 'https://discord.com', free: 'Ilimitado' },
      { name: 'Slack', desc: 'Team chat', url: 'https://slack.com', free: '90 dias histórico' },
      { name: 'Crisp', desc: 'Live chat', url: 'https://crisp.chat', free: '2 seats' },
      { name: 'Tawk.to', desc: 'Live chat', url: 'https://tawk.to', free: 'Ilimitado' },
      { name: 'Intercom', desc: 'Support chat', url: 'https://intercom.com', free: '14 dias trial' },
      { name: 'Chatwoot', desc: 'Open source chat', url: 'https://chatwoot.com', free: 'Self-hosted' },
    ]
  },
  {
    id: 'automation',
    name: 'Automação',
    icon: Zap,
    count: 20,
    color: 'from-orange-500 to-amber-500',
    tools: [
      { name: 'n8n', desc: 'Workflow automation', url: 'https://n8n.io', free: 'Self-hosted grátis' },
      { name: 'Make', desc: 'Visual automation', url: 'https://make.com', free: '1K operations/mês' },
      { name: 'Zapier', desc: 'App integration', url: 'https://zapier.com', free: '100 tasks/mês' },
      { name: 'IFTTT', desc: 'Simple automation', url: 'https://ifttt.com', free: '2 applets' },
      { name: 'Pipedream', desc: 'Developer workflows', url: 'https://pipedream.com', free: '10K invocations/mês' },
      { name: 'Activepieces', desc: 'Open automation', url: 'https://activepieces.com', free: 'Self-hosted' },
    ]
  },
  {
    id: 'cms',
    name: 'CMS & Content',
    icon: FileText,
    count: 15,
    color: 'from-emerald-500 to-green-500',
    tools: [
      { name: 'Sanity', desc: 'Headless CMS', url: 'https://sanity.io', free: '10K docs, 500K API' },
      { name: 'Contentful', desc: 'Content platform', url: 'https://contentful.com', free: '25K records' },
      { name: 'Strapi', desc: 'Open source CMS', url: 'https://strapi.io', free: 'Self-hosted' },
      { name: 'Payload', desc: 'Headless CMS', url: 'https://payloadcms.com', free: 'Self-hosted' },
      { name: 'Notion', desc: 'Workspace', url: 'https://notion.so', free: 'Personal grátis' },
      { name: 'Ghost', desc: 'Publishing platform', url: 'https://ghost.org', free: 'Self-hosted' },
    ]
  },
  {
    id: 'payments',
    name: 'Pagamentos',
    icon: Zap,
    count: 12,
    color: 'from-green-600 to-emerald-500',
    tools: [
      { name: 'Stripe', desc: 'Payment processing', url: 'https://stripe.com', free: 'Sem taxa mensal' },
      { name: 'LemonSqueezy', desc: 'Digital products', url: 'https://lemonsqueezy.com', free: 'Sem taxa mensal' },
      { name: 'Paddle', desc: 'SaaS payments', url: 'https://paddle.com', free: 'Sem taxa mensal' },
      { name: 'Gumroad', desc: 'Sell anything', url: 'https://gumroad.com', free: 'Sem taxa mensal' },
      { name: 'Ko-fi', desc: 'Creator support', url: 'https://ko-fi.com', free: '0% platform fee' },
      { name: 'Buy Me a Coffee', desc: 'Donations', url: 'https://buymeacoffee.com', free: '5% fee only' },
    ]
  },
]

type FreeToolsDirectoryProps = {
  isLocked?: boolean
}

export function FreeToolsDirectory({ isLocked = false }: FreeToolsDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const totalTools = freeToolsCategories.reduce((acc, cat) => acc + cat.count, 0)

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const filteredCategories = searchQuery 
    ? freeToolsCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.tools.some(tool => 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : freeToolsCategories

  return (
    <>
    <div className="min-h-full bg-zinc-950 p-6">
      {/* Banner de bloqueio */}
      {isLocked && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-white font-medium">Conteúdo Premium</p>
              <p className="text-sm text-zinc-400">Visualize a prévia, mas faça upgrade para acessar os links</p>
            </div>
          </div>
          <button 
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Fazer Upgrade
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full mb-4">
          <Gift className="w-5 h-5 text-green-400" />
          <span className="text-sm text-green-300">100% Gratuitas ou Freemium</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          +280 Ferramentas Gratuitas
        </h1>
        <p className="text-zinc-400 mb-4">
          Ferramentas e serviços gratuitos para desenvolvedores e empreendedores
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-zinc-300">{freeToolsCategories.length} Categorias</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-zinc-300">{totalTools}+ Ferramentas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-zinc-300">Tiers Gratuitos</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ferramenta..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          const isExpanded = expandedCategories.has(category.id)
          
          return (
            <div
              key={category.id}
              className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
            >
              {/* Category Header */}
              <div className={cn(
                "p-4 bg-gradient-to-r",
                category.color
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-xs text-white/70">{category.count} ferramentas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools List */}
              <div className="p-3 relative">
                {category.tools.slice(0, isExpanded ? undefined : 4).map((tool, idx) => (
                  <a
                    key={idx}
                    href={isLocked ? undefined : tool.url}
                    target={isLocked ? undefined : "_blank"}
                    rel={isLocked ? undefined : "noopener noreferrer"}
                    onClick={isLocked ? (e) => { e.preventDefault(); setShowUpgradeModal(true) } : undefined}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-lg transition-colors group",
                      isLocked ? "cursor-pointer" : "hover:bg-zinc-800/50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center gap-3 flex-1 min-w-0",
                      isLocked && "blur-[2px]"
                    )}>
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tool.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{tool.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 whitespace-nowrap",
                        isLocked && "blur-[2px]"
                      )}>
                        {tool.free}
                      </span>
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-green-400 transition-colors" />
                      )}
                    </div>
                  </a>
                ))}

                {category.tools.length > 4 && (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full mt-2 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    {isExpanded ? 'Mostrar menos' : `Ver mais ${category.tools.length - 4}`}
                    <ChevronRight className={cn(
                      "w-3 h-3 transition-transform",
                      isExpanded && "rotate-90"
                    )} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-500">
          Ferramentas com tiers gratuitos para começar sem custos •{' '}
          <a 
            href="https://free-for.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 inline-flex items-center gap-1"
          >
            Ver mais em free-for.dev
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </div>
    
    {/* Modal de Upgrade */}
    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
    />
    </>
  )
}
