import { test, expect } from '@playwright/test'

test.describe('Middleware — Redirects sem autenticação', () => {
  test('/ redireciona para /landing quando não autenticado', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL(/\/(landing|login)/)
    const url = page.url()
    expect(url).toMatch(/\/(landing|login)/)
  })

  test('/comunidade redireciona para /login quando não autenticado', async ({ page }) => {
    await page.goto('/comunidade')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  test('/suporte redireciona para /login quando não autenticado', async ({ page }) => {
    await page.goto('/suporte')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  test('/afiliados redireciona para /login quando não autenticado', async ({ page }) => {
    await page.goto('/afiliados')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })
})

test.describe('Middleware — Páginas públicas não redirecionam', () => {
  const publicPaths = ['/landing', '/login', '/cadastro', '/termos', '/privacidade', '/recuperar-senha']

  for (const path of publicPaths) {
    test(`${path} permanece acessível`, async ({ page }) => {
      await page.goto(path)
      // Should stay on the same page (or a sub-path of it)
      expect(page.url()).toContain(path)
    })
  }
})
