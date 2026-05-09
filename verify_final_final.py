import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        path = "file://" + os.path.abspath("Wcag tester FINAL-v7.html")
        await page.goto(path)
        await page.wait_for_selector("aside")
        await page.set_viewport_size({"width": 1600, "height": 1200})

        # Click "Global Modes"
        await page.click("text=Global Modes")

        # Find all buttons and click the one next to "Hide Empty"
        # Since I can't easily target by structure, I'll use text proximity or nth
        await page.screenshot(path="final_final_debug_before.png")

        # Test 2: Top Docking Layout
        await page.select_option("select", "top")
        await asyncio.sleep(1)
        await page.screenshot(path="final_final_top_dock.png")

        # Test 3: Filter Typography & Resets
        await page.select_option("select", "right")
        await page.click("text=Visual Matrix")
        await page.screenshot(path="final_final_resets.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
