import { test, expect } from '@playwright/test'

const authPages = [
  { path: '/login', name: 'Login', expectedText: /entrar|login|email/i },
  { path: '/cadastro', name: 'Cadastro', expectedText: /criar|cadastr|registr/i },
  { path: '/recuperar-senha', name: 'Recuperar Senha', expectedText: /recuperar|senha|email/i },
]

for (const page of authPages) {
  test(`${page.name} — carrega e exibe formulário`, async ({ page: p }) => {
    const errors: string[] = []
    p.on('pageerror', (err) => errors.push(err.message))

    const response = await p.goto(page.path)

    expect(response?.status()).toBeLessThan(400)
    expect(errors).toHaveLength(0)
    await expect(p.locator('body')).toBeVisible()

    // Should have form-related content
    const bodyText = await p.locator('body').innerText()
    expect(bodyText).toMatch(page.expectedText)
  })
}

test('Login — campos de email e senha presentes', async ({ page }) => {
  await page.goto('/login')
  await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
})

test('Cadastro — campos de formulário presentes', async ({ page }) => {
  await page.goto('/cadastro')
  await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
})
