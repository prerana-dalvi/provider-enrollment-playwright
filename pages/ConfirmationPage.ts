import { Page, Locator, expect } from '@playwright/test';

export class ConfirmationPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly trackingNumber: Locator;
  readonly status: Locator;
  readonly providerName: Locator;
  readonly providerNpi: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Enrollment Application Submitted' });
    this.trackingNumber = page.locator('#atn');
    this.status = page.locator('#appStatus');
    this.providerName = page.locator('#confName');
    this.providerNpi = page.locator('#confNpi');
  }

  async verifySubmitted(expectedName: string, expectedNpi: string): Promise<string> {
    await expect(this.heading).toBeVisible();
    await expect(this.trackingNumber).toHaveText(/^ATN\d{10}$/);
    await expect(this.status).toHaveText('Pending Review');
    await expect(this.providerName).toHaveText(expectedName);
    await expect(this.providerNpi).toHaveText(expectedNpi);
    return (await this.trackingNumber.textContent()) ?? '';
  }
}
