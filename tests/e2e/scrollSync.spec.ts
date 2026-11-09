import { test, expect } from '@playwright/test';

test.describe('Scroll Synchronization & World Transitions', () => {
  test('natural scrolling transitions through all five worlds with centered editorial typography and persistent Atlas', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 25000 });

    // 1. Initial State: World I (The Grand Observatory)
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Grand Observatory/i);

    // Verify ZERO unwanted persistent numbering or bottom rails
    await expect(page.locator('header')).not.toContainText(/WORLD/i);
    await expect(page.locator('nav[aria-label="Narrative Worlds Scrubber"]')).toHaveCount(0);

    // Verify translucent capsule controls in header
    const mapBtn = page.getByRole('button', { name: /MAP/i });
    await expect(mapBtn).toBeVisible();
    await expect(page.getByRole('button', { name: /MOTION|CALM/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /TECHFEST\.ORG/i })).toBeVisible();

    // 2. Scroll to World II (Subterranean Engine) ~ 25% progress
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.28, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Subterranean Engine/i);

    // 3. Scroll to World III (Engineering Quadrants) ~ 50% progress
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.50, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Engineering Quadrants/i);

    // Quadrants capsule chips are visible in World III
    await expect(page.getByRole('button', { name: /Select Robotics/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Aerospace/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Cognitive/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Sustainable/i })).toBeVisible();

    // 4. Scroll to World IV (Technoholix Arena) ~ 75% progress
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.75, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Technoholix Arena/i);

    // 5. Scroll to World V (Deep Space Beacon) ~ 100% progress
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 1.0, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Deep Space Beacon/i);
    await expect(page.getByRole('link', { name: /REGISTER AS COLLEGE AMBASSADOR/i })).toBeVisible();

    // 6. Reverse Scroll back to World I
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Grand Observatory/i);

    expect(pageErrors).toHaveLength(0);
  });
});
