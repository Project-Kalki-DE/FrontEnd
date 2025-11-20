import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto('http://localhost:8080');
  });

  test('should load the home page and display the main title', async ({ page }) => {
    // Expect the main heading in the hero section to be visible
    const mainHeading = page.locator('.hero-section h1');
    await expect(mainHeading).toBeVisible();

    // And to contain the correct text
    await expect(mainHeading).toHaveText('IHRE VISION,PERFEKT GEDRUCKT');
  });

  test('should be able to scroll down the page', async ({ page }) => {
    // Get the initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for a moment to ensure the scroll action completes
    await page.waitForTimeout(500);

    // Get the new scroll position
    const newScrollY = await page.evaluate(() => window.scrollY);

    // Expect the new scroll position to be greater than the initial one
    expect(newScrollY).toBeGreaterThan(initialScrollY);
  });

  test('should have a visible hero section', async ({ page }) => {
    // Check that the hero section is visible
    const heroSection = page.locator('.hero-section');
    await expect(heroSection).toBeVisible();
  });
});
