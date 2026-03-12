import { test, expect } from '@playwright/test'

test.describe('Landing — Seções principais', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/landing')
  })

  test('Hero section visível com CTA', async ({ page }) => {
    // Should have a prominent heading
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    // Should have at least one call-to-action button/link
    const cta = page.locator('a[href*="cadastro"], a[href*="login"], button').first()
    await expect(cta).toBeVisible()
  })

  test('Página tem múltiplas seções de conteúdo', async ({ page }) => {
    // Landing should be content-rich with multiple sections
    const sections = page.locator('section, [class*="section"]')
    const count = await sections.count()
    // At least a few distinct sections
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('FAQ section existe', async ({ page }) => {
    // Look for FAQ-related content
    const faqText = page.locator('text=/FAQ|perguntas|frequentes/i').first()
    await expect(faqText).toBeVisible()
  })

  test('Footer ou links de navegação presentes', async ({ page }) => {
    // Should have navigation links
    const links = page.locator('a[href]')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('Sem erros de JavaScript na página', async ({ page }) => {
    const errors: string[] = []
    const ignoredErrors = ['fbq is not defined']
    page.on('pageerror', (err) => {
      if (!ignoredErrors.some((msg) => err.message.includes(msg))) {
        errors.push(err.message)
      }
    })

    // Wait for page to fully settle
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('Imagens carregam corretamente', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const brokenImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images
        .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
        .map((img) => img.src)
    })

    expect(brokenImages).toHaveLength(0)
  })
})
