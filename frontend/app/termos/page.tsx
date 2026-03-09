'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Shield, AlertCircle, Scale } from 'lucide-react'

export default function TermosPage() {
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
            <FileText className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold">Termos de Uso</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
          <p className="text-zinc-400">Última atualização: Janeiro de 2026</p>
        </div>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          {/* Introdução */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">1. Aceitação dos Termos</h2>
            </div>
            <p className="mb-4">
              Ao acessar e usar a plataforma Avello Premium Access ("Plataforma"), você concorda em cumprir 
              e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, 
              não deve usar nossa Plataforma.
            </p>
            <p>
              Estes termos se aplicam a todos os visitantes, usuários e outras pessoas que acessam ou usam 
              nossos serviços.
            </p>
          </section>

          {/* Descrição do Serviço */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">2. Descrição do Serviço</h2>
            </div>
            <p className="mb-4">
              A Avello Premium Access é uma plataforma de recursos digitais que oferece:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Templates e workflows para automação (n8n, Typebot)</li>
              <li>Prompts para inteligência artificial (ChatGPT, Midjourney)</li>
              <li>Diretórios de ferramentas e softwares</li>
              <li>Materiais educacionais e bônus exclusivos</li>
              <li>Acesso a comunidade de membros</li>
            </ul>
          </section>

          {/* Contas de Usuário */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">3. Contas de Usuário</h2>
            </div>
            <p className="mb-4">
              Para acessar determinados recursos da Plataforma, você deve criar uma conta. Ao criar uma conta, você concorda em:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fornecer informações precisas, atuais e completas</li>
              <li>Manter a segurança de sua senha e conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Ser responsável por todas as atividades em sua conta</li>
            </ul>
          </section>

          {/* Planos e Pagamentos */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Planos e Pagamentos</h2>
            <p className="mb-4">
              Oferecemos planos Starter, Premium e Premium Pro. Para planos pagos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Os pagamentos são processados de forma segura via Stripe</li>
              <li>Os preços estão sujeitos a alterações com aviso prévio</li>
              <li>Assinaturas são renovadas automaticamente, salvo cancelamento</li>
              <li>Reembolsos seguem nossa política específica de reembolso</li>
            </ul>
          </section>

          {/* Uso Permitido */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Uso Permitido</h2>
            <p className="mb-4">
              Você concorda em usar a Plataforma apenas para fins legais. É proibido:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Compartilhar credenciais de acesso com terceiros</li>
              <li>Revender ou redistribuir conteúdo sem autorização</li>
              <li>Usar a plataforma para atividades ilegais ou prejudiciais</li>
              <li>Tentar acessar áreas restritas ou sistemas não autorizados</li>
              <li>Interferir no funcionamento normal da Plataforma</li>
            </ul>
          </section>

          {/* Propriedade Intelectual */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Propriedade Intelectual</h2>
            <p className="mb-4">
              Todo o conteúdo disponibilizado na Plataforma, incluindo mas não limitado a textos, 
              gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, 
              é propriedade da Avello ou de seus fornecedores de conteúdo.
            </p>
            <p>
              Os templates, workflows e prompts disponibilizados podem ser usados em seus projetos 
              pessoais e comerciais, mas não podem ser revendidos ou redistribuídos como produtos standalone.
            </p>
          </section>

          {/* Limitação de Responsabilidade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">7. Limitação de Responsabilidade</h2>
            </div>
            <p className="mb-4">
              A Plataforma é fornecida "como está" e "conforme disponível". Não garantimos que:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>O serviço será ininterrupto ou livre de erros</li>
              <li>Os resultados obtidos serão precisos ou confiáveis</li>
              <li>A qualidade atenderá suas expectativas específicas</li>
            </ul>
            <p className="mt-4">
              Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, 
              especiais ou consequenciais.
            </p>
          </section>

          {/* Programa de Afiliados */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Programa de Afiliados</h2>
            <p className="mb-4">
              Participantes do programa de afiliados concordam em:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Promover a plataforma de forma ética e honesta</li>
              <li>Não usar spam ou práticas enganosas</li>
              <li>Aguardar o período de 30 dias para receber comissões</li>
              <li>Manter valor mínimo de R$ 100,00 para saque</li>
            </ul>
          </section>

          {/* Modificações */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Notificaremos sobre alterações significativas por email ou através de aviso na Plataforma. 
              O uso continuado após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          {/* Contato */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Contato</h2>
            <p>
              Para questões sobre estes Termos de Uso, entre em contato conosco através de:
            </p>
            <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p><strong>Email:</strong> andre.produtart@gmail.com</p>
              <p className="mt-2"><strong>Suporte:</strong> <Link href="/suporte" className="text-cyan-400 hover:underline">Página de Suporte</Link></p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
          <p>© 2026 Avello Premium Access. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link href="/privacidade" className="text-cyan-400 hover:underline">
              Política de Privacidade
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
