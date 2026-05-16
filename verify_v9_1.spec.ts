import { test, expect } from '@playwright/test';
import path from 'path';

test('visual verification v9.1', async ({ page }) => {
  const filePath = 'file://' + path.resolve('dist/index.html');
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1400, height: 900 });

  // 1. Initial State (Cute Light)
  await page.screenshot({ path: 'v9_1_cute_light.png' });

  // 2. Switch to Pro Light
  await page.click('[title="Toggle Style"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v9_1_pro_light.png' });

  // 3. Pro Dark
  await page.click('[title="Toggle Dark Mode"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v9_1_pro_dark.png' });

  // 4. Test Horizontal layout
  await page.click('[title="Dock top"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v9_1_pro_dark_top.png' });

  // 5. Test Stick Rows
  await page.click('text=Stick Row Labels to Screen');
  await page.screenshot({ path: 'v9_1_pro_dark_top_sticky.png' });
});
