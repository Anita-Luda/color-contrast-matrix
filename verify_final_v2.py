import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1600, 'height': 1200})
        await page.goto(f'file:///app/Wcag tester FINAL-v7.html')
        await asyncio.sleep(2)

        # 1. Check Card Labels (BG: / FG:)
        await page.screenshot(path='/home/jules/verification/v2_matrix_labels.png')

        # 2. Check Typography collapsed when off
        await page.evaluate("() => { const h = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Typography')); if(h) h.click(); }")
        await asyncio.sleep(0.5)
        await page.screenshot(path='/home/jules/verification/v2_typo_off.png')

        # 3. Enable Font Test Mode & H1 Font Family
        await page.evaluate("() => { const label = Array.from(document.querySelectorAll('label')).find(l => l.innerText.includes('Font Test Mode')); if(label) label.parentElement.querySelector('button').click(); }")
        await asyncio.sleep(0.5)
        await page.screenshot(path='/home/jules/verification/v2_typo_on.png')

        # 4. Check proportional scaling (Grid Scale vs Card Size)
        # Visual Matrix section
        await page.evaluate("() => { const h = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Visual Matrix')); if(h) h.click(); }")
        await asyncio.sleep(0.5)
        await page.screenshot(path='/home/jules/verification/v2_visual_matrix_controls.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
