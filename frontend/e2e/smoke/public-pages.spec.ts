import { test, expect } from '@playwright/test'

const publicPages = [
  { path: '/landing', name: 'Landing' },
  { path: '/termos', name: 'Termos de Uso' },
  { path: '/privacidade', name: 'Privacidade' },
]

for (const page of publicPages) {
  test(`${page.name} — carrega sem erros`, async ({ page: p }) => {
    const errors: string[] = []
    const ignoredErrors = ['fbq is not defined']
    p.on('pageerror', (err) => {
      if (!ignoredErrors.some((msg) => err.message.includes(msg))) {
        errors.push(err.message)
      }
    })

    const response = await p.goto(page.path)

    expect(response?.status()).toBeLessThan(400)
    expect(errors).toHaveLength(0)
    await expect(p.locator('body')).toBeVisible()
  })
}

test('Landing — conteúdo principal visível', async ({ page }) => {
  await page.goto('/landing')
  await expect(page.locator('body')).toBeVisible()
  // Should have at least some text content loaded
  const bodyText = await page.locator('body').innerText()
  expect(bodyText.length).toBeGreaterThan(100)
})
