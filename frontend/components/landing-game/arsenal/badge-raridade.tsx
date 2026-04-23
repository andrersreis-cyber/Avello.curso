import type { Raridade } from '@/lib/game/modulos'

interface BadgeRaridadeProps {
  raridade: Raridade
}

const WRAPPER_CLASS: Record<Raridade, string> = {
  comum: 'text-zinc-400 border-zinc-700 bg-zinc-800/40',
  rara: 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10',
  epica: 'text-fuchsia-400 border-fuchsia-500/50 bg-fuchsia-500/10',
  lendaria:
    'border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10',
}

const ROTULO: Record<Raridade, string> = {
  comum: 'comum',
  rara: 'rara',
  epica: 'épica',
  lendaria: 'lendária',
}

export function BadgeRaridade({ raridade }: BadgeRaridadeProps) {
  const texto = ROTULO[raridade]
  return (
    <span
      className={`inline-flex items-center font-hud text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${WRAPPER_CLASS[raridade]}`}
      aria-label={`raridade ${texto}`}
    >
      {raridade === 'lendaria' ? (
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-cyan-300">
          {texto}
        </span>
      ) : (
        texto
      )}
    </span>
  )
}
