import { test, expect } from '@playwright/test';

test('visual verification v9.2', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Initial State (Cute Light)
  await page.screenshot({ path: 'v9_2_cute_light.png' });

  // 2. Switch to Pro Light
  await page.click('[title="Toggle Style"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v9_2_pro_light.png' });

  // 3. Pro Dark
  await page.click('[title="Toggle Dark Mode"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v9_2_pro_dark.png' });

  // 4. Test Top Dock
  await page.click('[title="Dock top"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'v9_2_pro_dark_top.png' });

  // 5. Test Stick Rows
  await page.click('text=Stick Row Labels to Screen');
  await page.screenshot({ path: 'v9_2_pro_dark_top_sticky.png' });
});
