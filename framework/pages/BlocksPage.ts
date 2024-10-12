//@ts-check
import { expect, Page } from '@playwright/test'

const BlocksPage = ({ page }: { page: Page }) => {
  const checkBanner = async (url: string) => {
    await page.goto(url);

    const title = await page.locator('//div[contains(@class, "shortStatistic")]/p[contains(@class, "title")]').textContent();
    const expectedTitle = 'Добро — место,где легко помогать';
    expect(title).toBe(expectedTitle);

    const infoBannerElements = await page.locator('//a[contains(@class, "statistic")]/div[contains(@class, "info")]/p[contains(@class, "title4")]').all();
    expect(await infoBannerElements[0].textContent()).not.toBe('0 честных фондов');
    expect(await infoBannerElements[1].textContent()).not.toBe('0 раз');

    const closeBannerEl = page.locator('//div[contains(@class, "shortStatistic")]/*[contains(@class, "close")]');
    expect(await closeBannerEl.isEnabled()).toBe(true);
  }

  const checkSubscribeBlock = async (url: string) => {
    await page.goto(url);

    const subscribeBlock = page.locator('//div[contains(@class, "subscribe")]');
    await expect(subscribeBlock).toBeVisible();

    const title = await page.locator('//div[contains(@class, "subscribe")]/div/p[contains(@class, "title")]').textContent();
    const expectedTitle = 'Любите добро, как любим его мы?';
    expect(title).toBe(expectedTitle);

    const subtitle = await page.locator('//div[contains(@class, "subscribe")]/div/span[contains(@class, "subTitle")]').textContent();
    const expectedSubtitle = 'Подпишитесь на нашу рассылку и меняйте мир вместе с нами!';
    expect(subtitle).toBe(expectedSubtitle);

    const input = page.locator('//div[contains(@class, "subscribe")]/div[contains(@class, "formItemBox")]/form/div/span/input[@type="email"]');
    await input.fill('test');

    const button = page.locator('//div[contains(@class, "subscribe")]/div[contains(@class, "formItemBox")]/button');
    expect(await button.isEnabled()).toBe(true);
    await button.waitFor({ state: 'visible' });
    await button.click();

    const alert = page.locator('//div[contains(@class, "subscribe")]/div[contains(@class, "formItemBox")]/form/div/span[@role="alert"]');
    // Ждем выполнения запроса
    await page.waitForTimeout(2000);
    await expect(alert).toBeVisible();
    if (!(await alert.innerText()).includes('Запрос был проигнорирован')) {
      await expect(alert).toHaveText('Введите корректный e-mail');
      await input.fill('test@mail.ru');
      await button.click();
      if (!(await alert.innerText()).includes('Запрос был проигнорирован')) {
        await expect(input).toHaveValue('');
      }
    }
  }

  const checkMoreButton = async (url: string) => {
    await page.goto(url);

    const cardListContainer = await page.locator('//div[contains(@class, "cardListContainer")]').all();
    for (let i in cardListContainer) {
      const cardsCountPrev = await cardListContainer[i].locator('div[class*="cardList"]>div').count();
      await cardListContainer[i].locator('div[class*="moreBtn"] button').click();
      // Ждем выполнения запроса
      await page.waitForTimeout(3000);

      const cardsCountNew = await cardListContainer[i].locator('div[class*="cardList"]>div').count();
      expect(cardsCountNew).toBeGreaterThan(cardsCountPrev);
    }
  }

  return {
    checkBanner,
    checkSubscribeBlock,
    checkMoreButton
  }
}

export default BlocksPage
