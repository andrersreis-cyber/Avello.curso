'use client'

import { useState } from 'react'
import { 
  Server, Database, Mail, Cloud, Shield, Video,
  FileText, MessageSquare, Calendar, Music, Image,
  Code, Home, Monitor, Wifi, Lock, ChevronRight,
  ExternalLink, Check, Search, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UpgradeModal } from './upgrade-modal'

// Categorias de softwares Self-Hosted
const selfHostedCategories = [
  {
    id: 'automation',
    name: 'Automação',
    icon: Server,
    count: 45,
    color: 'from-orange-500 to-red-500',
    tools: [
      { name: 'n8n', desc: 'Workflow automation', url: 'https://n8n.io' },
      { name: 'Huginn', desc: 'Agents automation', url: 'https://github.com/huginn/huginn' },
      { name: 'Node-RED', desc: 'Flow-based programming', url: 'https://nodered.org' },
      { name: 'Airflow', desc: 'Workflow orchestration', url: 'https://airflow.apache.org' },
      { name: 'Prefect', desc: 'Data workflows', url: 'https://prefect.io' },
      { name: 'Temporal', desc: 'Durable execution', url: 'https://temporal.io' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: Database,
    count: 38,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      { name: 'Plausible', desc: 'Privacy-focused analytics', url: 'https://plausible.io' },
      { name: 'Umami', desc: 'Simple analytics', url: 'https://umami.is' },
      { name: 'Matomo', desc: 'Google Analytics alternative', url: 'https://matomo.org' },
      { name: 'PostHog', desc: 'Product analytics', url: 'https://posthog.com' },
      { name: 'Metabase', desc: 'Business intelligence', url: 'https://metabase.com' },
      { name: 'Grafana', desc: 'Observability platform', url: 'https://grafana.com' },
    ]
  },
  {
    id: 'communication',
    name: 'Comunicação',
    icon: MessageSquare,
    count: 42,
    color: 'from-purple-500 to-pink-500',
    tools: [
      { name: 'Mattermost', desc: 'Team messaging', url: 'https://mattermost.com' },
      { name: 'Rocket.Chat', desc: 'Team collaboration', url: 'https://rocket.chat' },
      { name: 'Matrix/Element', desc: 'Decentralized chat', url: 'https://element.io' },
      { name: 'Zulip', desc: 'Threaded chat', url: 'https://zulip.com' },
      { name: 'Discourse', desc: 'Community forum', url: 'https://discourse.org' },
      { name: 'Flarum', desc: 'Modern forum', url: 'https://flarum.org' },
    ]
  },
  {
    id: 'media',
    name: 'Media Server',
    icon: Video,
    count: 35,
    color: 'from-red-500 to-orange-500',
    tools: [
      { name: 'Jellyfin', desc: 'Media streaming', url: 'https://jellyfin.org' },
      { name: 'Plex', desc: 'Media server', url: 'https://plex.tv' },
      { name: 'Emby', desc: 'Media organizer', url: 'https://emby.media' },
      { name: 'Navidrome', desc: 'Music server', url: 'https://navidrome.org' },
      { name: 'Airsonic', desc: 'Music streaming', url: 'https://airsonic.github.io' },
      { name: 'PhotoPrism', desc: 'Photo management', url: 'https://photoprism.app' },
    ]
  },
  {
    id: 'storage',
    name: 'Armazenamento',
    icon: Cloud,
    count: 32,
    color: 'from-cyan-500 to-blue-500',
    tools: [
      { name: 'Nextcloud', desc: 'File sync & share', url: 'https://nextcloud.com' },
      { name: 'Seafile', desc: 'File hosting', url: 'https://seafile.com' },
      { name: 'ownCloud', desc: 'File sync', url: 'https://owncloud.com' },
      { name: 'MinIO', desc: 'Object storage', url: 'https://min.io' },
      { name: 'Syncthing', desc: 'P2P file sync', url: 'https://syncthing.net' },
      { name: 'Filebrowser', desc: 'Web file manager', url: 'https://filebrowser.org' },
    ]
  },
  {
    id: 'productivity',
    name: 'Produtividade',
    icon: FileText,
    count: 48,
    color: 'from-green-500 to-emerald-500',
    tools: [
      { name: 'Outline', desc: 'Team wiki', url: 'https://getoutline.com' },
      { name: 'BookStack', desc: 'Documentation', url: 'https://bookstackapp.com' },
      { name: 'Wiki.js', desc: 'Modern wiki', url: 'https://js.wiki' },
      { name: 'Joplin', desc: 'Note taking', url: 'https://joplinapp.org' },
      { name: 'Standard Notes', desc: 'Encrypted notes', url: 'https://standardnotes.com' },
      { name: 'Trilium', desc: 'Knowledge base', url: 'https://github.com/zadam/trilium' },
    ]
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    count: 28,
    color: 'from-yellow-500 to-orange-500',
    tools: [
      { name: 'Mailcow', desc: 'Mail server suite', url: 'https://mailcow.email' },
      { name: 'Mail-in-a-Box', desc: 'Easy mail server', url: 'https://mailinabox.email' },
      { name: 'Postal', desc: 'Mail delivery', url: 'https://docs.postalserver.io' },
      { name: 'Mailu', desc: 'Docker mail server', url: 'https://mailu.io' },
      { name: 'Roundcube', desc: 'Webmail client', url: 'https://roundcube.net' },
      { name: 'Mailpile', desc: 'Email client', url: 'https://mailpile.is' },
    ]
  },
  {
    id: 'security',
    name: 'Segurança',
    icon: Shield,
    count: 36,
    color: 'from-red-600 to-rose-500',
    tools: [
      { name: 'Vaultwarden', desc: 'Password manager', url: 'https://github.com/dani-garcia/vaultwarden' },
      { name: 'Keycloak', desc: 'Identity management', url: 'https://keycloak.org' },
      { name: 'Authelia', desc: '2FA portal', url: 'https://authelia.com' },
      { name: 'Authentik', desc: 'Identity provider', url: 'https://goauthentik.io' },
      { name: 'CrowdSec', desc: 'Security engine', url: 'https://crowdsec.net' },
      { name: 'Wazuh', desc: 'Security monitoring', url: 'https://wazuh.com' },
    ]
  },
  {
    id: 'development',
    name: 'Desenvolvimento',
    icon: Code,
    count: 40,
    color: 'from-violet-500 to-purple-500',
    tools: [
      { name: 'Gitea', desc: 'Git service', url: 'https://gitea.io' },
      { name: 'GitLab', desc: 'DevOps platform', url: 'https://gitlab.com' },
      { name: 'Gogs', desc: 'Git server', url: 'https://gogs.io' },
      { name: 'Drone CI', desc: 'CI/CD pipeline', url: 'https://drone.io' },
      { name: 'Jenkins', desc: 'Automation server', url: 'https://jenkins.io' },
      { name: 'Woodpecker', desc: 'CI engine', url: 'https://woodpecker-ci.org' },
    ]
  },
  {
    id: 'homelab',
    name: 'Home Lab',
    icon: Home,
    count: 30,
    color: 'from-amber-500 to-yellow-500',
    tools: [
      { name: 'Home Assistant', desc: 'Home automation', url: 'https://home-assistant.io' },
      { name: 'Proxmox', desc: 'Virtualization', url: 'https://proxmox.com' },
      { name: 'TrueNAS', desc: 'Storage OS', url: 'https://truenas.com' },
      { name: 'Portainer', desc: 'Container mgmt', url: 'https://portainer.io' },
      { name: 'Cockpit', desc: 'Server admin', url: 'https://cockpit-project.org' },
      { name: 'Homarr', desc: 'Dashboard', url: 'https://homarr.dev' },
    ]
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: Wifi,
    count: 25,
    color: 'from-teal-500 to-cyan-500',
    tools: [
      { name: 'Pi-hole', desc: 'DNS ad blocker', url: 'https://pi-hole.net' },
      { name: 'AdGuard Home', desc: 'Ad blocking DNS', url: 'https://adguard.com/adguard-home.html' },
      { name: 'WireGuard', desc: 'VPN protocol', url: 'https://wireguard.com' },
      { name: 'Tailscale', desc: 'Mesh VPN', url: 'https://tailscale.com' },
      { name: 'Traefik', desc: 'Reverse proxy', url: 'https://traefik.io' },
      { name: 'Nginx PM', desc: 'Proxy manager', url: 'https://nginxproxymanager.com' },
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoramento',
    icon: Monitor,
    count: 28,
    color: 'from-indigo-500 to-blue-500',
    tools: [
      { name: 'Uptime Kuma', desc: 'Uptime monitor', url: 'https://uptime.kuma.pet' },
      { name: 'Prometheus', desc: 'Monitoring system', url: 'https://prometheus.io' },
      { name: 'Netdata', desc: 'Real-time monitoring', url: 'https://netdata.cloud' },
      { name: 'Zabbix', desc: 'Enterprise monitoring', url: 'https://zabbix.com' },
      { name: 'Checkmk', desc: 'IT monitoring', url: 'https://checkmk.com' },
      { name: 'Healthchecks', desc: 'Cron monitoring', url: 'https://healthchecks.io' },
    ]
  },
]

type SelfHostedDirectoryProps = {
  isLocked?: boolean
}

export function SelfHostedDirectory({ isLocked = false }: SelfHostedDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const totalTools = selfHostedCategories.reduce((acc, cat) => acc + cat.count, 0)

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
    ? selfHostedCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.tools.some(tool => 
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : selfHostedCategories

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
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-full mb-4">
          <Server className="w-5 h-5 text-orange-400" />
          <span className="text-sm text-zinc-300">Self-Hosted Software Directory</span>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">
          +350 Softwares Self-Hosted
        </h1>
        <p className="text-zinc-400 mb-4">
          Softwares open-source para instalar no seu próprio servidor
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-zinc-300">{selfHostedCategories.length} Categorias</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-zinc-300">{totalTools}+ Softwares</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-zinc-300">100% Open Source</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar software..."
            className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
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
                      <p className="text-xs text-white/70">{category.count} softwares</p>
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
                      "flex items-center gap-3",
                      isLocked && "blur-[2px]"
                    )}>
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{tool.name}</p>
                        <p className="text-xs text-zinc-500">{tool.desc}</p>
                      </div>
                    </div>
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                    )}
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
          Todos os softwares listados são open-source e podem ser auto-hospedados •{' '}
          <a 
            href="https://github.com/awesome-selfhosted/awesome-selfhosted"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
          >
            Ver lista completa no GitHub
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
