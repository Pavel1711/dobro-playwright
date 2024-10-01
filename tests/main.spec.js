// @ts-check
const { test, expect } = require('@playwright/test');
const { DOMAIN, NAVS_DATA } = require('../constants');

test('Check title', async ({ page }) => {
  await page.goto(DOMAIN);
  await expect(page).toHaveTitle(/VK Добро - благотворительность в России - сервис добрых дел/);
});

test('Check navigation', async ({ page }) => {
  await page.goto(DOMAIN);

  const navItems = await page.locator('//div[contains(@class, "navs")]/a').all();
  for (const [i, item] of navItems.entries()) {
    const text = await item.innerText();
    const href = await item.getAttribute('href');
    if (text !== NAVS_DATA[i].text) {
      throw new Error(`Текст элемента не равен ${NAVS_DATA[i].text}, а равен '${text}'.`);
    }
    if (href !== NAVS_DATA[i].url) {
      throw new Error(`Ссылка элемента не равна ${NAVS_DATA[i].url}, а равна '${href}'.`);
    }
  }
});

test('Check banner', async ({ page }) => {
  await page.goto(DOMAIN);

  const titleBannerContent = await page.locator('//div[contains(@class, "shortStatistic")]/p[contains(@class, "title")]').textContent();
  const expectedTitleBanner = 'Добро — место,где легко помогать';
  if (titleBannerContent !== expectedTitleBanner) {
    throw new Error(`Текст элемента не равен ${expectedTitleBanner}, а равен '${titleBannerContent}'.`);
  }

  const infoBannerElements = await page.locator('//a[contains(@class, "statistic")]/div[contains(@class, "info")]/p[contains(@class, "title4")]').all();
  if (await infoBannerElements[0].textContent() === '0 честных фондов') {
    throw new Error('Данные по количеству фондов отсутствуют')
  }
  if (await infoBannerElements[1].textContent() === '0 раз') {
    throw new Error('Данные по количеству помощи отсутствуют')
  }

  const closeBannerEl = page.locator('//div[contains(@class, "shortStatistic")]/*[contains(@class, "close")]');
  if (!await closeBannerEl.isEnabled()) {
    throw new Error('Баннер нельзя закрыть')
  }
});

test('Check help now button', async ({ page }) => {
  await page.goto(DOMAIN);

  const button = await page.waitForSelector('//button[contains(@class, "helpNowPopup")]');
  if (!await button.isEnabled()) {
    throw new Error('Кнопка для открытия платежного окна не кликабельна')
  }
})

test('Check subscribe popup', async ({ page }) => {
  await page.goto(`${DOMAIN}?subscribe=true`);

  const modal = page.locator('//div[contains(@class, "vkuiPopoutRoot__modal")]');
  if (!await modal.count()) {
    throw new Error('Модальное окно не открылось')
  }

  const containerTitle = await page.locator('//div[contains(@class, "vkuiModalCardBase__container")]/h2').textContent();
  const expectedContainerTitle = 'Сработало! Вы подписались на рассылку';
  if (containerTitle !== expectedContainerTitle) {
    throw new Error(`Текст элемента не равен ${expectedContainerTitle}, а равен '${containerTitle}'.`);
  }

  const containerSubtitle = await page.locator('//div[contains(@class, "vkuiModalCardBase__container")]/h5').textContent();
  const expectedContainerSubtitle = 'Ждите хороших новостей. Изменить настройки подписки можно в личном кабинете';

  if (containerSubtitle !== expectedContainerSubtitle) {
    throw new Error(`Текст элемента не равен ${expectedContainerSubtitle}, а равен '${containerSubtitle}'.`);
  }

  const buttons = await page.locator('//div[contains(@class, "vkuiModalCardBase__actions")]/div[contains(@class, "vkuiButtonGroup")]/*').all();
  const BUTTONS_DATA = [{
    tag: 'A',
    text: 'Перейти в кабинет'
  },
  {
    tag: 'BUTTON',
    text: 'Закрыть'
  }]
  for (const [i, item] of buttons.entries()) {
    const text = await item.innerText();
    const tagName = await item.evaluate(el => el.tagName);

    if (tagName !== BUTTONS_DATA[i].tag) {
      throw new Error(`Тег кнопки не равен ${BUTTONS_DATA[i].tag}, а равен '${tagName}'.`);
    }
    if (text !== BUTTONS_DATA[i].text) {
      throw new Error(`Текст кнопки не равен ${BUTTONS_DATA[i].text}, а равен '${text}'.`);
    }
  };
  await buttons[1].click()
})
