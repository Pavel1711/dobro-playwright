// @ts-check
import { test } from '@playwright/test';
import BasePage from '../framework/pages/BasePage';
import BlocksPage from '../framework/pages/BlocksPage';

const url = '/projects/done';

test('Check title', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.visit(url, 'Завершенные проекты - VK Добро')
});

test('Check header', async ({ page }) => {
  const basePage = BasePage({ page });
  await basePage.checkHeader(url)
});

test('Check more button', async ({ page }) => {
  const blockPage = BlocksPage({ page });
  await blockPage.checkMoreButton(url)
});
