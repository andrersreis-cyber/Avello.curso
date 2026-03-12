import { test, expect } from '@playwright/test'

const pagesWithMeta = [
  {
    path: '/landing',
    expectedTitle: /avello/i,
    expectedDescription: /ia|automação|recursos/i,
  },
  {
    path: '/login',
    expectedTitle: /entrar.*avello/i,
    expectedDescription: /./,
  },
  {
    path: '/cadastro',
    expectedTitle: /criar.*conta.*avello/i,
    expectedDescription: /./,
  },
  {
    path: '/termos',
    expectedTitle: /termos.*uso.*avello/i,
    expectedDescription: /./,
  },
  {
    path: '/privacidade',
    expectedTitle: /privacidade.*avello/i,
    expectedDescription: /./,
  },
  {
    path: '/recuperar-senha',
    expectedTitle: /recuperar.*senha.*avello/i,
    expectedDescription: /./,
  },
]

for (const pg of pagesWithMeta) {
  test.describe(`SEO — ${pg.path}`, () => {
    test('tem title correto', async ({ page }) => {
      await page.goto(pg.path)
      const title = await page.title()
      expect(title).toMatch(pg.expectedTitle)
    })

    test('tem meta description', async ({ page }) => {
      await page.goto(pg.path)
      const description = await page.getAttribute('meta[name="description"]', 'content')
      expect(description).toBeTruthy()
      expect(description!.length).toBeGreaterThan(10)
      expect(description!.length).toBeLessThanOrEqual(160)
      expect(description).toMatch(pg.expectedDescription)
    })

    test('tem og:title e og:description', async ({ page }) => {
      await page.goto(pg.path)
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content')
      const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content')
      expect(ogTitle).toBeTruthy()
      expect(ogDesc).toBeTruthy()
    })
  })
}
