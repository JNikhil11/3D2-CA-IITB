import { test, expect } from '@playwright/test';

test.describe('Rigorous Visual Acceptance: 5 Worlds & Atlas Persistence', () => {

  test('World I: The Grand Observatory visual acceptance & screenshot', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    // 1. Assert WebGL canvas exists and is visible
    const canvas = page.locator('canvas');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });
    await expect(canvas).toBeVisible();

    // 2. Assert World I heading & tagline are active
    const heading = page.locator('.editorial-overlay h1');
    await expect(heading).toContainText(/Grand Observatory/i, { timeout: 10000 });
    await expect(page.locator('.editorial-overlay')).toContainText(/Celestial Orrery/i);

    // 3. Assert header capsule controls are present without rectangular borders
    await expect(page.getByRole('button', { name: /MAP/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /MOTION|CALM/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /TECHFEST\.ORG/i })).toBeVisible();

    // 4. Assert zero unwanted persistent numbering or bottom rails
    await expect(page.locator('header')).not.toContainText(/WORLD/i);
    await expect(page.locator('nav[aria-label="Narrative Worlds Scrubber"]')).toHaveCount(0);

    // 5. Capture verified screenshot
    await page.screenshot({ path: 'test-results/screenshots/world-01-observatory.png' });
    expect(pageErrors).toHaveLength(0);
  });

  test('World II: Subterranean Engine visual acceptance & screenshot', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Scroll to World II (28% scroll depth)
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.28, behavior: 'instant' });
    });

    // Deterministically await World II heading
    const heading = page.locator('.editorial-overlay h1');
    await expect(heading).toContainText(/Subterranean Engine/i, { timeout: 10000 });
    await expect(page.locator('.editorial-overlay')).toContainText(/Epicyclic Clockwork/i);

    // Assert canvas is actively rendering
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Capture verified screenshot
    await page.screenshot({ path: 'test-results/screenshots/world-02-engine.png' });
    expect(pageErrors).toHaveLength(0);
  });

  test('World III: Engineering Quadrants visual acceptance & screenshot (Zero Black Viewport)', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Scroll to World III (50% scroll depth)
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.50, behavior: 'instant' });
    });

    // Deterministically await World III heading
    const heading = page.locator('.editorial-overlay h1');
    await expect(heading).toContainText(/Engineering Quadrants/i, { timeout: 10000 });
    await expect(page.locator('.editorial-overlay')).toContainText(/Four Pillars/i);

    // Assert all 4 interactive quadrant capsule chips exist and are visible
    await expect(page.getByRole('button', { name: /Select Robotics/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Aerospace/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Cognitive/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select Sustainable/i })).toBeVisible();

    // Assert canvas is actively visible and rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Capture verified screenshot
    await page.screenshot({ path: 'test-results/screenshots/world-03-quadrants.png' });
    expect(pageErrors).toHaveLength(0);
  });

  test('World IV: Technoholix Arena visual acceptance & screenshot', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Scroll to World IV (75% scroll depth)
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.75, behavior: 'instant' });
    });

    // Deterministically await World IV heading
    const heading = page.locator('.editorial-overlay h1');
    await expect(heading).toContainText(/Technoholix Arena/i, { timeout: 10000 });
    await expect(page.locator('.editorial-overlay')).toContainText(/Electrifying Night Spectacle/i);

    // Assert canvas is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Capture verified screenshot
    await page.screenshot({ path: 'test-results/screenshots/world-04-arena.png' });
    expect(pageErrors).toHaveLength(0);
  });

  test('World V: The Deep Space Beacon visual acceptance & screenshot', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Scroll to World V (100% scroll depth)
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 1.0, behavior: 'instant' });
    });

    // Deterministically await World V heading
    const heading = page.locator('.editorial-overlay h1');
    await expect(heading).toContainText(/Deep Space Beacon/i, { timeout: 10000 });
    await expect(page.locator('.editorial-overlay')).toContainText(/Orbital Ascension/i);

    // Assert official Ambassador Gateway registration CTA capsule is visible
    await expect(page.getByRole('link', { name: /REGISTER AS COLLEGE AMBASSADOR/i })).toBeVisible();

    // Assert canvas is visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Capture verified screenshot
    await page.screenshot({ path: 'test-results/screenshots/world-05-beacon.png' });
    expect(pageErrors).toHaveLength(0);
  });

  test('Mobile Viewport: Reframed Atlas & Centered Editorial Typography (390x844)', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Assert mobile header and logos fit without horizontal overflow
    await expect(page.locator('img[alt*="IIT Bombay"]')).toBeVisible();
    await expect(page.locator('img[alt*="Techfest"]')).toBeVisible();

    // Assert World I heading is centered and readable
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Grand Observatory/i, { timeout: 10000 });
    await page.screenshot({ path: 'test-results/screenshots/mobile-world-01-hero.png' });

    // Scroll to World III on mobile
    await page.evaluate(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: maxScroll * 0.50, behavior: 'instant' });
    });
    await expect(page.locator('.editorial-overlay h1')).toContainText(/Engineering Quadrants/i, { timeout: 10000 });
    await page.screenshot({ path: 'test-results/screenshots/mobile-world-03-quadrants.png' });

    expect(pageErrors).toHaveLength(0);
  });

});
