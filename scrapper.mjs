import {chromium} from '@playwright/test'

async function scrap() {
    const browser = await chromium.launch({headless: false})
    const page = await browser.newPage()
    await page.goto('https://dobro.mail.ru/')
    const elements = await page.locator('a').all();
    const links = await Promise.all(elements.map(async (locator) => {
        const text = await locator.innerText();
        const href = await locator.getAttribute('href');
        return {text, href}
    }))
    console.table(links)
    await browser.close()
}

scrap()