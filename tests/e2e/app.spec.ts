import { test, expect } from '@playwright/test';

test.describe('AgentForge-XT E2E Tests', () => {
    const baseURL = 'http://localhost:3000';

    test.beforeEach(async ({ page }) => {
        await page.goto(baseURL);
    });

    test('Homepage loads correctly', async ({ page }) => {
        await expect(page).toHaveTitle(/AgentForge/i);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('Can navigate to sign up page', async ({ page }) => {
        await page.click('text=Sign Up');
        await expect(page).toHaveURL(/.*sign-up/);
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('Can navigate to sign in page', async ({ page }) => {
        await page.click('text=Sign In');
        await expect(page).toHaveURL(/.*sign-in/);
        await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('Dashboard requires authentication', async ({ page }) => {
        await page.goto(`${baseURL}/dashboard`);
        // Should redirect to sign-in
        await expect(page).toHaveURL(/.*sign-in/);
    });

    test('Workflow editor requires authentication', async ({ page }) => {
        await page.goto(`${baseURL}/workflow/test-id`);
        // Should redirect to sign-in
        await expect(page).toHaveURL(/.*sign-in/);
    });
});

test.describe('Authenticated User Tests', () => {
    const baseURL = 'http://localhost:3000';

    // Note: These tests require a test user to be set up
    test.skip('User can sign in and access dashboard', async ({ page }) => {
        await page.goto(`${baseURL}/auth/sign-in`);

        // Fill in test credentials
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'testpassword123');
        await page.click('button[type="submit"]');

        // Should redirect to dashboard
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.locator('text=Workflows')).toBeVisible();
    });

    test.skip('User can create a new workflow', async ({ page }) => {
        // Assumes user is logged in
        await page.goto(`${baseURL}/dashboard`);
        await page.click('text=New workflow');

        // Should open workflow editor
        await expect(page).toHaveURL(/.*workflow/);
        await expect(page.locator('[data-testid="workflow-canvas"]')).toBeVisible();
    });
});
