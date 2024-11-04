import { expect, test } from '@playwright/test';

const openModal = async (page) => {
  await page.goto('/?action=help_money');
  const modal = page.locator('//div[contains(@class, "vkuiPopoutRoot__modal")]');
  expect(await modal.count()).toBeGreaterThan(0);
}

const checkStep = async (page, title) => {
  const modalTitle = await page.locator('//div[contains(@class, "vkuiPanelHeader__content")]/h2').innerText();
  const expectedModalTitle = title;
  expect(modalTitle).toContain(expectedModalTitle);
}

const checkStepAboutDobro = async (page) => {
  await checkStep(page, 'О VK Добре')
}

const checkStepRecipients = async (page) => {
  await checkStep(page, 'Сделать пожертвование')
}

const checkStepSettings = async (page) => {
  await checkStep(page, 'Помочь проекту')
}

test('Проверка шагов step_recipients и step_about_vk_dobro', async ({ page }) => {
  await openModal(page)

  // Проверяем верность шага
  await checkStepRecipients(page)

  // Проверяем наличие рандомного проекта
  const card = page.locator('div[class*="step-recipients_content"]>div');
  expect(await card.count()).toBeGreaterThan(0);

  const learnMoreBtn = page.locator('div[class*="step-recipients_footer"] button');
  await learnMoreBtn.click();

  // Проверяем переход на шаг с информацией про VK Добро
  await checkStepAboutDobro(page)

  let nextBtn = page.locator('div[class*="step-about-vk-dobro_btnGroup"] button');
  await nextBtn.click();

  // Проверяем верность шага
  await checkStepRecipients(page)
})

test('Проверка шага step_settings', async ({ page }) => {
  await openModal(page)

  // Проверяем переход с рандомного проекта в настройки платежа
  const cardBtn = page.locator('div[class*="step-recipients_content"] button');
  await cardBtn.click();

  // Ждем выполнения запроса
  await page.waitForTimeout(3000);
  // Проверяем верность шага
  checkStepSettings(page)

  const tabs = await page.locator('label[class*="vkuiSegmentedControlOption"]').all();
  // Перешли в раздел "Как компания"
  await tabs[1].click();
  // Вернулись в раздел "Деньгами"
  tabs[0].click();

  // Проверяем отправку пустой суммы
  const input = page.locator('div[class*="step-settings_content"] input[type="number"]');
  await input.fill('');

  const nextBtn = page.locator('div[class*="step-settings_footer"] div.vkuiButtonGroup button:nth-of-type(2)');
  await nextBtn.click();

  // Ждем выполнения запроса
  await page.waitForTimeout(2000);
  // Проверяем, что появился alert
  let alert = page.locator('div[class*="step-settings_content"] span[role="alert"]');
  expect(await alert.count()).toBeGreaterThan(0);

  await input.fill('300');
  const inputEmail = page.locator('input[placeholder="Введите e-mail"]')
  await inputEmail.fill('test@mail.ru');

  // Получаем чекбокс для регулярного платежа
  const regularPayLabel = page.locator('label[class*="step-settings_switch"]');
  await regularPayLabel.click();

  // Проверяем, что нельзя отправить регулярный платеж анониму. Перебрасываем на страницу с авторизацией
  await nextBtn.click();
  expect(page.url()).toContain('https://account.mail.ru/login');
})
