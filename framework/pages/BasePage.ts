//@ts-check
import { expect, Page } from '@playwright/test'
import { NAVS_DATA } from '../../constants'

const BasePage = ({ page }: { page: Page }) => {
  const visit = async (url: string, title: string) => {
    await page.goto(url)
    await expect(page).toHaveTitle(title)
  }

  const checkHeader = async (url: string) => {
    await page.goto(url);

    const logo = page.locator('//div[contains(@class, "desktopMenu")]/a');
    expect(await logo.isEnabled()).toBe(true);

    const navItems = await page.locator('//div[contains(@class, "navs")]/a').all();

    for (const [i, item] of navItems.entries()) {
      const text = await item.innerText();
      const href = await item.getAttribute('href');
      expect(text).toBe(NAVS_DATA[i].text);
      expect(href).toBe(NAVS_DATA[i].url);
    }

    const helpNowButton = page.locator('//button[contains(@class, "helpNowPopup")]');
    expect(await helpNowButton.isEnabled()).toBe(true);

    const notificationButton = page.locator('//div[contains(@class, "rightBlock")]/button[@title="Поиск"]')
    expect(await notificationButton.isEnabled()).toBe(true);

    const loginIcon = page.locator('//div[contains(@class, "styles_rightBlock__TQTq1")]/*[contains(@class, "loginIcon")]')
    expect(await loginIcon.isEnabled()).toBe(true);
  }

  return {
    visit,
    checkHeader
  }
}

export default BasePage
