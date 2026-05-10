import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load the file
        path = os.path.abspath("Wcag tester FINAL-v7.html")
        await page.goto(f"file://{path}")
        await page.wait_for_selector(".grid-wrapper")

        # Check centering
        wrapper_box = await page.locator(".grid-wrapper").bounding_box()
        grid_box = await page.locator(".inline-grid").bounding_box()

        print(f"Wrapper width: {wrapper_box['width']}")
        print(f"Grid width: {grid_box['width']}")
        print(f"Grid X: {grid_box['x']}")

        # Take screenshot
        await page.screenshot(path="verify_v3_main.png")

        # Set viewport small to trigger scroll
        await page.set_viewport_size({"width": 800, "height": 600})
        await page.wait_for_timeout(500)

        # Scroll right
        await page.evaluate("document.querySelector('.grid-area').scrollLeft = 500")
        await page.wait_for_timeout(500)

        # Take screenshot of sticky headers
        await page.screenshot(path="verify_v3_sticky.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
