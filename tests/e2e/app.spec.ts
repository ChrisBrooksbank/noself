import { expect, test } from '@playwright/test';

test('app starts without browser errors', async ({ page }) => {
    const browserErrors: string[] = [];

    page.on('console', (message) => {
        if (message.type() === 'error') {
            browserErrors.push(message.text());
        }
    });
    page.on('pageerror', (error) => {
        browserErrors.push(error.message);
    });

    await page.goto('/');

    await expect(page).toHaveTitle('noself');
    await expect(page.locator('#view-host')).not.toBeEmpty();
    expect(browserErrors).toEqual([]);
});
