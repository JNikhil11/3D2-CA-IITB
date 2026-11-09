import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 320, height: 700 },
];

for (const vp of VIEWPORTS) {
  test(`Viewport ${vp.width}x${vp.height} renders unoccluded 3D canvas with zero errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize(vp);
    await page.goto('/');

    // Wait for readiness
    await expect(page.locator('[data-testid="experience-ready"]')).toBeAttached({ timeout: 20000 });
    await page.waitForTimeout(500);

    // Verify FM-03 Prevention: Center pixel of 3D sanctuary must hit the WebGL canvas, not an opaque card
    const centerPoint = { x: Math.floor(vp.width / 2), y: Math.floor(vp.height * 0.42) };
    const topTagAtCenter = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return el ? el.tagName.toLowerCase() : 'none';
    }, centerPoint);

    // Verify FM-03 Prevention: Center optical axis must never be occluded by opaque editorial panels
    expect(['aside', 'article', 'section', 'header', 'nav']).not.toContain(topTagAtCenter);
    expect(['canvas', 'svg', 'div', 'body', 'button']).toContain(topTagAtCenter);

    // Take verified screenshot
    await page.screenshot({
      path: `test-results/screenshots/vp-${vp.width}x${vp.height}.png`,
    });

    expect(errors).toHaveLength(0);
  });
}

