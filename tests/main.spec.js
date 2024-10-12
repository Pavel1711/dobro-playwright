// @ts-check
import { chromium, expect, test } from '@playwright/test';
import BasePage from '../framework/pages/BasePage';
import BlocksPage from '../framework/pages/BlocksPage';

const url = '/';

test('Check title', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.visit(url, 'VK Добро - благотворительность в России - сервис добрых дел')
});

test('Check header', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.checkHeader(url)
});

test('Check banner', async ({ page }) => {
  const blocksPage = BlocksPage({ page });
  await blocksPage.checkBanner(url);
});

test('Check subscribe block', async () => {
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()

  const blocksPage = BlocksPage({ page });
  await blocksPage.checkSubscribeBlock(url);
  await browser.close()
})

test('Check subscribe popup', async ({ page }) => {
  await page.goto(`/?subscribe=true`);

  const modal = page.locator('//div[contains(@class, "vkuiPopoutRoot__modal")]');
  expect(await modal.count()).toBeGreaterThan(0);

  const containerTitle = await page.locator('//div[contains(@class, "vkuiModalCardBase__container")]/h2').textContent();
  const expectedContainerTitle = 'Сработало! Вы подписались на рассылку';
  expect(containerTitle).toBe(expectedContainerTitle);

  const containerSubtitle = await page.locator('//div[contains(@class, "vkuiModalCardBase__container")]/h5').textContent();
  const expectedContainerSubtitle = 'Ждите хороших новостей. Изменить настройки подписки можно в личном кабинете';
  expect(containerSubtitle).toBe(expectedContainerSubtitle);

  const buttons = await page.locator('//div[contains(@class, "vkuiModalCardBase__actions")]/div[contains(@class, "vkuiButtonGroup")]/*').all();
  const BUTTONS_DATA = [{
    tag: 'A',
    text: 'Перейти в кабинет'
  },
  {
    tag: 'BUTTON',
    text: 'Закрыть'
  }];

  for (const [i, item] of buttons.entries()) {
    const text = await item.innerText();
    const tagName = await item.evaluate(el => el.tagName);

    expect(tagName).toBe(BUTTONS_DATA[i].tag);
    expect(text).toBe(BUTTONS_DATA[i].text);
  };

  await buttons[1].click();
});
