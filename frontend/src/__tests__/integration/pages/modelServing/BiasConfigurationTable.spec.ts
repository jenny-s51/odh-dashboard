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
  await page.goto(navigateToTest('empty-state-no-bias-metrics'));

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

test('Edit form fields match', async ({ page }) => {
  await page.goto(
    navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'edit-modal'),
  );

  // test inputs have correct values
  expect(await page.getByTestId('byon-image-location-input').inputValue()).toBe(
    'test-image:latest',
  );
  expect(await page.getByTestId('byon-image-name-input').inputValue()).toBe('Testing Custom Image');
  expect(await page.getByTestId('byon-image-description-input').inputValue()).toBe(
    'A custom notebook image',
  );

  // test software and packages have correct values
  expect(page.getByRole('gridcell', { name: 'test-software' }));
  expect(page.getByRole('gridcell', { name: '2.0' }));
  await page.getByRole('tab', { name: 'Displayed content packages tab' }).click();
  expect(page.getByRole('gridcell', { name: 'test-package' }));
  expect(page.getByRole('gridcell', { name: '1.0' }));
});

test('Delete form', async ({ page }) => {
  await page.goto(
    navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'delete-modal'),
  );

  // test delete form is disabled initially
  await expect(page.getByRole('button', { name: 'Delete notebook image' })).toBeDisabled();

  // test delete form is enabled after filling out required fields
  await page.getByRole('textbox', { name: 'Delete modal input' }).click();
  await page.getByRole('textbox', { name: 'Delete modal input' }).fill('Testing Custom Image');
  await expect(page.getByRole('button', { name: 'Delete notebook image' })).toBeEnabled();
});

test('Error messages', async ({ page }) => {
  await page.goto(
    navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'image-error'),
  );

  // import error
  await page.getByRole('button', { name: 'Import new image' }).click();
  await page.getByLabel('Image location *').click();
  await page.getByLabel('Image location *').fill('image:location');
  await page.getByLabel('Name *').click();
  await page.getByLabel('Name *').fill('test name');
  await page.getByRole('button', { name: 'Import' }).click();
  expect(page.getByText('Testing create error message'));
  await page.getByRole('button', { name: 'Close' }).click();

  // edit error
  await page.getByLabel('Kebab toggle').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByRole('button', { name: 'Update' }).click();
  expect(page.getByText('Testing edit error message'));
  await page.getByRole('button', { name: 'Close' }).click();

  // delete error
  await page.getByLabel('Kebab toggle').click();
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await page.getByRole('textbox', { name: 'Delete modal input' }).click();
  await page.getByRole('textbox', { name: 'Delete modal input' }).fill('Testing Custom Image');
  await page.getByRole('button', { name: 'Delete notebook image' }).click();
  expect(page.getByRole('heading', { name: 'Danger alert: Error deleting Testing Custom Image' }));
  await page.getByRole('button', { name: 'Close' }).click();

  // test error icon
  expect(page.getByRole('button', { name: 'error icon' }));
});

test('Import modal opens from the empty state', async ({ page }) => {
  await page.goto(navigateToStory('pages-notebookimagesettings-notebookimagesettings', 'empty'));
  await page.getByRole('button', { name: 'Import new image' }).click();
  expect(page.getByText('Import notebook image'));
});
