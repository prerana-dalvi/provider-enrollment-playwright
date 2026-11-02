import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly enrollNewProviderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeading = page.getByRole('heading', { name: /Welcome/ });
    this.enrollNewProviderButton = page.getByRole('button', { name: 'Enroll New Provider' });
  }

  async verifyLoaded(username: string) {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.welcomeHeading).toContainText(username);
  }

  async startNewEnrollment() {
    await this.enrollNewProviderButton.click();
  }
}
