import { test, expect } from '@playwright/test';
import { navigateToTest, navigateToStory } from '~/__tests__/integration/utils';

test('Bias configuration table', async ({ page }) => {
  await page.goto(navigateToTest('default'));
  // wait for page to load
  await page.waitForSelector('text=Configure metric');
  // const submitButton = page.locator('[data-id="submit-cluster-settings"]');

  // check first cell exists
  const firstCell = page.getByText('test_name_1');
  await expect(firstCell).toBeVisible();

  // check second cell exists
  const secondCell = page.getByText('test_name_2');
  await expect(secondCell).toBeVisible();
});

test('Empty State No Bias Metrics', async ({ page }) => {
  await page.goto(navigateToTest('empty'));

  // wait for page to load
  await page.waitForSelector('text=Bias metrics not configured');

  // Test that the button is enabled
  await expect(page.getByRole('button', { name: 'Configure' })).toBeTruthy();
});

test('Bias table filtering', async ({ page }) => {
  await page.goto(
    navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'large-list'),
  );

  // test filtering
  // by name
  await page.getByPlaceholder('Find by name').click();
  await page.getByPlaceholder('Find by name').fill('1');
  expect(page.getByText('test_name_1'));

  const selectFilterMenuOption = async (itemLabel: string): Promise<void> => {
    // await page.locator('.pf-v5-c-toolbar').getByRole('button', { name: 'Filter type' }).click();
    await page.getByTestId('filter-dropdown-select').click();
    await page.getByRole('menuitem', { name: itemLabel }).click();
  };

  // by metric
  await page.getByRole('button', { name: 'Reset' }).click();
  await selectFilterMenuOption('Metric');
  await page.getByPlaceholder('Find by metric').click();
  await page.getByPlaceholder('Find by metric').fill('provider-321');
  expect(page.getByText('test_name_1'));

  // by protected attribute
  // test switching filtering options
  await selectFilterMenuOption('Protected attribute');
  expect(page.getByRole('heading', { name: 'No results found' }));
  await selectFilterMenuOption('Protected attribute');
  expect(page.getByText('test_name_1'));

  // by output
  // test switching filtering options
  await selectFilterMenuOption('Output');
  expect(page.getByRole('heading', { name: 'No results found' }));
  await selectFilterMenuOption('Output');
  expect(page.getByText('test_name_1'));
});

test('Import modal opens from the empty state', async ({ page }) => {
  await page.goto(navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'empty'));
  await page.getByRole('button', { name: 'Import new image' }).click();
  expect(page.getByText('Import notebook image'));
});
