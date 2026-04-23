# 🔊 Áudios — Agente 0

Esta pasta recebe os 6 arquivos de áudio da jornada gameficada.

## Arquivos esperados

| Arquivo          | Descrição                                   | Duração |
|------------------|---------------------------------------------|---------|
| `ringtone.mp3`   | Toque da chamada (loop)                     | ~3s     |
| `beep-fim.mp3`   | Beep de fim de chamada                      | ~1s     |
| `nivel-1.mp3`    | Voz Agente 0 — nível 1 (Iniciante)          | ~35s    |
| `nivel-2.mp3`    | Voz Agente 0 — nível 2 (Aspirante)          | ~35s    |
| `nivel-3.mp3`    | Voz Agente 0 — nível 3 (Freelancer)         | ~35s    |
| `nivel-4.mp3`    | Voz Agente 0 — nível 4 (Operador)           | ~35s    |

## Como gerar (ElevenLabs)

Os scripts estão em `frontend/lib/game/scripts-agente-0.ts`.

**Config recomendada:**
- Voz: robótica masculina (ex: `Josh` ou custom)
- Model: `eleven_multilingual_v2`
- Stability: 0.45 / Similarity: 0.75 / Style: 0.35

**Fluxo:**
1. Copia cada script (`transcricao.join(' ')`)
2. Gera no ElevenLabs → baixa `.mp3`
3. Salva nesta pasta com o nome exato da tabela

## Enquanto os áudios não existirem

O modal do Agente 0 detecta erro de carregamento via Howler (`loaderror`/`playerror`)
e mostra um aviso + a transcrição completa sincronizada no tempo do script.
A jornada continua funcionando sem áudio.
