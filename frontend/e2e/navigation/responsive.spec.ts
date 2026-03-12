import { test, expect } from '@playwright/test'

test.describe('Responsivo — Landing', () => {
  test('Desktop (1280px) — layout carrega corretamente', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/landing')
    await expect(page.locator('body')).toBeVisible()
    // Page should have reasonable content width
    const bodyWidth = await page.locator('body').evaluate((el) => el.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(1400)
  })

  test('Mobile (375px) — layout carrega sem overflow horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/landing')
    await expect(page.locator('body')).toBeVisible()

    // No horizontal scroll (body scroll width should not exceed viewport)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })

  test('Tablet (768px) — layout carrega corretamente', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/landing')
    await expect(page.locator('body')).toBeVisible()

    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    expect(hasHorizontalScroll).toBe(false)
  })
})

test.describe('Responsivo — Login', () => {
  test('Mobile (375px) — formulário visível e utilizável', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/login')
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
  })
})
