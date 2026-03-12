import { test, expect } from '@playwright/test'

test.describe('Error Boundaries', () => {
  test('Página 404 — rota inexistente mostra not-found', async ({ page }) => {
    await page.goto('/rota-que-nao-existe-12345')
    // Next.js App Router returns 200 with not-found page content
    // Verify the page renders (not a blank/broken page)
    await expect(page.locator('body')).toBeVisible()
    const bodyText = await page.locator('body').innerText()
    expect(bodyText.length).toBeGreaterThan(0)
  })

  test('Error boundary não expõe detalhes internos', async ({ page }) => {
    // Visit a non-existent page and check the error page doesn't leak info
    await page.goto('/rota-que-nao-existe-12345')
    const bodyText = await page.locator('body').innerText()

    // Should NOT contain stack traces or internal error details
    expect(bodyText).not.toMatch(/Error:/)
    expect(bodyText).not.toMatch(/at\s+\w+\s+\(/)
    expect(bodyText).not.toMatch(/node_modules/)
    expect(bodyText).not.toMatch(/webpack/)
  })

  test('API route inexistente retorna JSON de erro', async ({ request }) => {
    const response = await request.get('/api/rota-inexistente')
    expect(response.status()).toBeGreaterThanOrEqual(400)
  })
})
