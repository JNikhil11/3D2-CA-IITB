import { test, expect } from '@playwright/test';

test.describe('Scroll Synchronization & World Transitions', () => {
  test('scrubber jumps update world state and text', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/');
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });

    // Initial state is World I
    await expect(page.locator('header')).toContainText('WORLD I / V');

    // Scrubber nav
    const scrubber = page.locator('nav[aria-label="Narrative Worlds Scrubber"]');

    // Click 02 Subterranean Engine
    const engineBtn = scrubber.getByRole('button', { name: /Subterranean/i });
    await engineBtn.click();
    await page.waitForTimeout(1000);
    await expect(page.locator('header')).toContainText('WORLD II / V');

    // Click 03 Engineering Quadrants
    const quadBtn = scrubber.getByRole('button', { name: /Quadrants/i });
    await quadBtn.click();
    await page.waitForTimeout(1000);
    await expect(page.locator('header')).toContainText('WORLD III / V');

    // Quadrants selector buttons visible
    await expect(page.getByRole('button', { name: /Robotics/i }).first()).toBeVisible();

    // Click 05 Deep Space Beacon
    const beaconBtn = scrubber.getByRole('button', { name: /Beacon/i });
    await beaconBtn.click();
    await page.waitForTimeout(1000);
    await expect(page.locator('header')).toContainText('WORLD V / V');

    expect(pageErrors).toHaveLength(0);
  });
});

