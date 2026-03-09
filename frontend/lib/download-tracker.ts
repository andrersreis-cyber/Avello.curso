/**
 * Rastreamento de downloads semanais para plano Starter (limite 3/semana)
 */

const DOWNLOAD_LIMIT_STARTER = 3

export function getWeekNumber(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
}

export function getDownloadCount(): number {
  if (typeof window === 'undefined') return 0
  const key = `downloads_week_${getWeekNumber()}`
  return parseInt(localStorage.getItem(key) || '0', 10)
}

export function incrementDownload(): void {
  if (typeof window === 'undefined') return
  const key = `downloads_week_${getWeekNumber()}`
  const current = getDownloadCount()
  localStorage.setItem(key, String(current + 1))
}

export function canDownload(isStarter: boolean): boolean {
  if (!isStarter) return true
  return getDownloadCount() < DOWNLOAD_LIMIT_STARTER
}

export const DOWNLOAD_LIMIT = DOWNLOAD_LIMIT_STARTER
