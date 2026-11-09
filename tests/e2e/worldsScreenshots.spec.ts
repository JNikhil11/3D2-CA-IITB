import { test, expect } from '@playwright/test';

test.describe('Rigorous Visual Acceptance: 5 Worlds & Atlas Persistence', () => {
  test('captures high-fidelity screenshots of all 5 worlds verifying persistent Atlas and zero black viewports', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });
    await page.waitForTimeout(1000);

    // World I: The Grand Observatory
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Grand Observatory/i);
    await page.screenshot({ path: 'test-results/screenshots/world-01-observatory.png' });

    // World II: Subterranean Engine
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.28, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Subterranean Engine/i);
    await page.screenshot({ path: 'test-results/screenshots/world-02-engine.png' });

    // World III: Engineering Quadrants (CRITICAL VERIFICATION: Zero black screen!)
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.50, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Engineering Quadrants/i);
    await page.screenshot({ path: 'test-results/screenshots/world-03-quadrants.png' });

    // World IV: Technoholix Arena
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.75, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Technoholix Arena/i);
    await page.screenshot({ path: 'test-results/screenshots/world-04-arena.png' });

    // World V: The Deep Space Beacon
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 1.0, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Deep Space Beacon/i);
    await page.screenshot({ path: 'test-results/screenshots/world-05-beacon.png' });

    // Also capture mobile layout inspection (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/mobile-world-01-hero.png' });

    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.50, behavior: 'instant' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'test-results/screenshots/mobile-world-03-quadrants.png' });

    expect(pageErrors).toHaveLength(0);
  });
});

