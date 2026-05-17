import { test, expect } from '@playwright/test';

test('verify grid scaling and row heights', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('.app-layout');

  // Helper to set scale
  const setScale = async (scale) => {
    // We assume the range slider for grid scale is accessible
    // In our sidebar, it's a range input
    const slider = page.locator('.slider-group:has-text("Grid Scale") input');
    await slider.fill(scale.toString());
    await page.waitForTimeout(500);
  };

  await setScale(50);
  await page.screenshot({ path: 'scale_50.png' });

  await setScale(100);
  await page.screenshot({ path: 'scale_100.png' });

  await setScale(150);
  await page.screenshot({ path: 'scale_150.png' });
});
