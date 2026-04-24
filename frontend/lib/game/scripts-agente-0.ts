import type { Nivel } from './levels'

export interface ScriptAgente {
  nivel: Nivel
  audioSrc: string
  duracaoSegundos: number
  transcricao: string[]
}

/**
 * Personaliza o script pro operador: se houver nome, insere na primeira linha.
 * O áudio TTS fixo continua dizendo "operador" — a personalização é só visual
 * na transcrição (força o reconhecimento e identidade sem regerar áudio).
 */
export function obterScriptPersonalizado(
  nivel: Nivel,
  nomeOperador: string | null,
): ScriptAgente {
  const base = SCRIPTS_AGENTE_0[nivel]
  if (!nomeOperador || nomeOperador.trim().length === 0) return base

  const nome = nomeOperador.trim().split(' ')[0].toLowerCase()
  const transcricaoOriginal = base.transcricao
  const linhasNovas = [...transcricaoOriginal]

  // Nível 1: "interceptei seu sinal. agente 0 falando."
  // Nível 2: "dados confirmados. agente 0 no canal."
  // Nível 3: "travei suas respostas no cofre. agente 0."
  // Nível 4: "identificado. agente 0 na linha."
  const substituicoes: Record<Nivel, string> = {
    1: `interceptei seu sinal, ${nome}. agente 0 falando.`,
    2: `dados confirmados, ${nome}. agente 0 no canal.`,
    3: `travei suas respostas no cofre, ${nome}. agente 0.`,
    4: `identificado, ${nome}. agente 0 na linha.`,
  }

  linhasNovas[0] = substituicoes[nivel]
  return { ...base, transcricao: linhasNovas }
}

/**
 * Scripts do Agente 0 por nível. A `transcricao` é dividida em linhas que
 * sincronizamos manualmente com o áudio (tempo total dividido em parts iguais).
 * Arquivos de áudio são gerados via ElevenLabs e salvos em
 * /public/audio/agente-0/nivel-{N}.mp3.
 *
 * Se alterar o texto: rodar `node scripts/gerar-audios-agente-0.mjs` pra regerar.
 */
export const SCRIPTS_AGENTE_0: Record<Nivel, ScriptAgente> = {
  1: {
    nivel: 1,
    audioSrc: '/audio/agente-0/nivel-1.mp3',
    duracaoSegundos: 35,
    transcricao: [
      'interceptei seu sinal. agente 0 falando.',
      'análise concluída: nível 1. iniciante.',
      'você tá na superfície. nunca rodou ia pra trabalhar — só brincou.',
      'não é crítica. é ponto de partida.',
      '12 operadores nível 1 entraram nas últimas 24 horas. mesmo perfil que o seu.',
      'todos já têm uma automação rodando.',
      'missão pra você: primeira automação no ar em 3 dias.',
      'liberei a trilha curta. ferramentas grátis, prompt base, fluxo simples.',
      'o arsenal abre agora. não pisca.',
      'agente 0. câmbio.',
    ],
  },
  2: {
    nivel: 2,
    audioSrc: '/audio/agente-0/nivel-2.mp3',
    duracaoSegundos: 37,
    transcricao: [
      'dados confirmados. agente 0 no canal.',
      'você é nível 2. aspirante.',
      'já mexeu com ia. gostou. nunca virou dinheiro.',
      'padrão conhecido. o que falta não é talento — é arsenal organizado.',
      '3 operadores nível 2 fecharam a primeira venda ontem. 250, 400 e 180 reais.',
      'usaram o mesmo pacote que tô liberando pra você agora.',
      'missão: primeira venda em 7 dias.',
      '6 módulos abertos. prompts prontos, fluxos testados, script de venda.',
      'avança. o arsenal tá do outro lado.',
      'agente 0. câmbio.',
    ],
  },
  3: {
    nivel: 3,
    audioSrc: '/audio/agente-0/nivel-3.mp3',
    duracaoSegundos: 40,
    transcricao: [
      'travei suas respostas no cofre. agente 0.',
      'nível 3. freelancer ativo.',
      'cobra por automação. sabe que tá cobrando pouco.',
      'e tem um padrão. você entrega. o cliente some. começa do zero no próximo.',
      'o problema não é o seu preço. é a estrutura.',
      'troca 500 reais uma vez por 300 reais todo mês. conta aí em 12 meses.',
      'missão: primeiro contrato recorrente em 14 dias.',
      '8 módulos liberados. inclui o template de saas branco e o funil de recorrência.',
      'avança. o arsenal te espera.',
      'agente 0. câmbio.',
    ],
  },
  4: {
    nivel: 4,
    audioSrc: '/audio/agente-0/nivel-4.mp3',
    duracaoSegundos: 38,
    transcricao: [
      'identificado. agente 0 na linha.',
      'nível 4. operador completo.',
      'pula o curso. isso a gente sabe.',
      'o que te trava é escala. seu gargalo é reutilização — você constrói do zero toda vez.',
      'liberei acesso total. 14 mil ferramentas, 30 saas white label. tudo clonável.',
      '24 operadores nível 4 lançaram saas próprio nos últimos 90 dias.',
      'missão: primeiro saas no ar em 30 dias. margem acima de 70 por cento.',
      'continua. o que vem agora não é curso — é infra.',
      'agente 0. câmbio.',
    ],
  },
}
