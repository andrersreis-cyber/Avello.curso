import confetti from 'canvas-confetti'

export function dispararConfetti(): void {
  const cores = ['#06b6d4', '#22c55e', '#d946ef', '#f59e0b']
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: cores,
    disableForReducedMotion: true,
  })
  window.setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.65 },
      colors: cores,
      disableForReducedMotion: true,
    })
  }, 250)
}
