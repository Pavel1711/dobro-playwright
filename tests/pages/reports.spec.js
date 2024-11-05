// @ts-check
import { test } from '@playwright/test';
import BasePage from '../../framework/pages/BasePage';
import BlocksPage from '../../framework/pages/BlocksPage';

const url = '/reports';

test('Check title', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.visit(url, 'Отчёты VK Добра - VK Добро')
});

test('Check header', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.checkHeader(url)
});

test('Check more button', async ({ page }) => {
  const blockPage = BlocksPage({ page });
  await blockPage.checkMoreButton(url)
});

