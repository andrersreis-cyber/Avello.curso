'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, Bell, UserCheck } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link 
            href="/landing"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <div className="h-6 w-px bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="font-semibold">Política de Privacidade</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
          <p className="text-zinc-400">Última atualização: Janeiro de 2026</p>
        </div>

        {/* Resumo */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            Resumo da Política
          </h2>
          <ul className="space-y-2 text-sm text-zinc-300">
            <li>✓ Coletamos apenas dados necessários para o funcionamento do serviço</li>
            <li>✓ Nunca vendemos seus dados pessoais a terceiros</li>
            <li>✓ Você pode solicitar exclusão dos seus dados a qualquer momento</li>
            <li>✓ Usamos criptografia para proteger suas informações</li>
          </ul>
        </div>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          {/* Introdução */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">1. Introdução</h2>
            </div>
            <p className="mb-4">
              A Avello Premium Access ("nós", "nosso" ou "Plataforma") está comprometida em proteger 
              sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos 
              e protegemos suas informações quando você usa nossa plataforma.
            </p>
            <p>
              Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo com 
              esta política.
            </p>
          </section>

          {/* Dados Coletados */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">2. Dados que Coletamos</h2>
            </div>
            
            <h3 className="font-semibold text-white mt-6 mb-3">2.1 Dados fornecidos por você:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Dados de conta:</strong> Nome, email, senha (criptografada)</li>
              <li><strong>Dados de perfil:</strong> Foto de perfil (opcional)</li>
              <li><strong>Dados de pagamento:</strong> Processados diretamente pelo Stripe (não armazenamos dados de cartão)</li>
              <li><strong>Comunicações:</strong> Mensagens de suporte e feedback</li>
            </ul>

            <h3 className="font-semibold text-white mt-6 mb-3">2.2 Dados coletados automaticamente:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Dados de uso:</strong> Páginas visitadas, recursos utilizados, tempo de acesso</li>
              <li><strong>Dados do dispositivo:</strong> Tipo de navegador, sistema operacional, endereço IP</li>
              <li><strong>Cookies:</strong> Para manter sua sessão e preferências</li>
            </ul>
          </section>

          {/* Como Usamos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">3. Como Usamos seus Dados</h2>
            </div>
            <p className="mb-4">Utilizamos suas informações para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fornecer e manter nossos serviços</li>
              <li>Processar transações e enviar confirmações</li>
              <li>Enviar atualizações importantes sobre sua conta</li>
              <li>Responder suas solicitações de suporte</li>
              <li>Melhorar nossos produtos e serviços</li>
              <li>Prevenir fraudes e atividades maliciosas</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Compartilhamento de Dados</h2>
            <p className="mb-4">
              <strong className="text-white">Não vendemos seus dados pessoais.</strong> Podemos compartilhar 
              informações apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Provedores de serviço:</strong> Stripe (pagamentos), Supabase (banco de dados)</li>
              <li><strong>Requisitos legais:</strong> Quando exigido por lei ou ordem judicial</li>
              <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos e segurança</li>
              <li><strong>Com seu consentimento:</strong> Quando você autorizar expressamente</li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">5. Segurança dos Dados</h2>
            </div>
            <p className="mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Criptografia SSL/TLS para todas as comunicações</li>
              <li>Senhas armazenadas com hash bcrypt</li>
              <li>Acesso restrito a dados pessoais</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e criptografados</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies e Tecnologias Similares</h2>
            <p className="mb-4">Utilizamos cookies para:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cookies essenciais:</strong> Manter sua sessão de login</li>
              <li><strong>Cookies de preferências:</strong> Lembrar suas configurações</li>
              <li><strong>Cookies de afiliados:</strong> Rastrear referências (30 dias)</li>
            </ul>
            <p className="mt-4">
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar 
              a funcionalidade da plataforma.
            </p>
          </section>

          {/* Seus Direitos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">7. Seus Direitos (LGPD)</h2>
            </div>
            <p className="mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão dos seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar seu consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
            </ul>
            <p className="mt-4">
              Para exercer esses direitos, entre em contato através do email: 
              <strong className="text-cyan-400"> andre.produtart@gmail.com</strong>
            </p>
          </section>

          {/* Retenção */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Retenção de Dados</h2>
            <p className="mb-4">
              Mantemos seus dados pessoais enquanto sua conta estiver ativa ou conforme necessário 
              para fornecer serviços. Após exclusão da conta:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dados de conta: excluídos em até 30 dias</li>
              <li>Dados de pagamento: mantidos conforme exigências fiscais (5 anos)</li>
              <li>Logs de segurança: mantidos por 90 dias</li>
            </ul>
          </section>

          {/* Menores */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Menores de Idade</h2>
            <p>
              Nossos serviços não são destinados a menores de 18 anos. Não coletamos 
              intencionalmente dados de menores. Se você é pai/responsável e acredita que 
              seu filho forneceu dados pessoais, entre em contato conosco.
            </p>
          </section>

          {/* Alterações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Alterações na Política</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre 
              mudanças significativas por email ou aviso na plataforma. Recomendamos revisar esta 
              página regularmente.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">11. Contato</h2>
            <p>
              Para questões sobre esta Política de Privacidade ou sobre seus dados pessoais:
            </p>
            <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p><strong>Email:</strong> andre.produtart@gmail.com</p>
              <p className="mt-2"><strong>Suporte:</strong> <Link href="/suporte" className="text-cyan-400 hover:underline">Página de Suporte</Link></p>
              <p className="mt-2 text-sm text-zinc-500">Responderemos em até 15 dias úteis.</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          <p>© 2026 Avello Premium Access. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/termos" className="text-cyan-400 hover:underline">
              Termos de Uso
            </Link>
            <span>•</span>
            <Link href="/landing" className="text-cyan-400 hover:underline">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
