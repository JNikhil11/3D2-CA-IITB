import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('WCAG 2.2 AA Accessibility & DOM Mirror Verification', () => {
  test('passes axe automated accessibility scan', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 25000 });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .disableRules(['color-contrast', 'region'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('accessible DOM mirror contains full semantic hierarchy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 25000 });

    const mainMirror = page.locator('#accessible-main-content');
    await expect(mainMirror).toBeAttached();

    // Check headings for all 5 worlds
    const headings = mainMirror.locator('h2');
    expect(await headings.count()).toBe(5);

    // Check interactive buttons in DOM mirror
    const buttons = mainMirror.locator('button');
    expect(await buttons.count()).toBeGreaterThanOrEqual(10);
  });
});

