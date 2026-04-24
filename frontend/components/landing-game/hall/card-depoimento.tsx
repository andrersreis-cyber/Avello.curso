import Image from 'next/image'
import type { Depoimento } from '@/lib/game/oferta'

interface CardDepoimentoProps {
  depoimento: Depoimento
  first?: boolean
}

export function CardDepoimento({ depoimento, first = false }: CardDepoimentoProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[4/5] bg-zinc-950">
        <Image
          src={depoimento.imagem}
          alt={`print do resultado de ${depoimento.nome}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={first}
        />
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p className="font-orbitron font-semibold text-lg text-neon-cyan leading-snug">
          &ldquo;{depoimento.destaque}&rdquo;
        </p>
        <p className="text-sm text-zinc-400 font-exo2">{depoimento.metrica}</p>
        <p className="text-xs font-hud uppercase tracking-wider text-zinc-500 mt-1">
          {depoimento.nome} · nível {depoimento.nivelAntes} → {depoimento.nivelDepois}
        </p>
      </div>
    </article>
  )
}
