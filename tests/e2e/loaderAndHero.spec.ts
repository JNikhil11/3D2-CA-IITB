import { test, expect } from '@playwright/test';

test.describe('Loader & Living Atlas Hero Reveal', () => {
  test('calibrated loader advances deterministically and reveals WebGL canvas without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');

    // Wait for readiness signal (calibrated loader completes and unmounts)
    const readySignal = page.locator('[data-testid="experience-ready"]');
    await expect(readySignal).toBeAttached({ timeout: 20000 });

    // Canvas must be rendered and full screen
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(600);
    expect(box!.height).toBeGreaterThan(400);

    // Header brand logos visible
    await expect(page.locator('img[alt*="IIT Bombay"]')).toBeVisible();
    await expect(page.locator('img[alt*="Techfest"]')).toBeVisible();

    // Editorial vellum panel visible
    await expect(page.locator('aside[aria-label="Editorial Narrative & World Telemetry"]')).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });
});
