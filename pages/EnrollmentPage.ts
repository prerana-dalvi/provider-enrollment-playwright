import { Page, Locator, expect } from '@playwright/test';

export interface ProviderData {
  providerType: string;
  program: string;
  firstName: string;
  lastName: string;
  npi: string;
  taxId: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  taxonomy: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration: string;
}

/** Multi-step New Provider Enrollment wizard. */
export class EnrollmentPage {
  readonly page: Page;
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;
  readonly reviewTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.submitButton = page.getByRole('button', { name: 'Submit Application' });
    this.formError = page.locator('#formError');
    this.reviewTable = page.getByRole('table', { name: 'Enrollment summary' });
  }

  async verifyLoaded() {
    await expect(this.page.getByRole('heading', { name: 'New Provider Enrollment' })).toBeVisible();
  }

  private async goNext(nextSectionHeading: string) {
    await this.nextButton.click();
    await expect(this.formError).toBeHidden();
    await expect(this.page.getByRole('heading', { name: nextSectionHeading })).toBeVisible();
  }

  async fillEnrollmentType(data: ProviderData) {
    await expect(this.page.getByRole('heading', { name: 'Enrollment Type' })).toBeVisible();
    await this.page.getByLabel(data.providerType, { exact: true }).check();
    await this.page.getByLabel('Medicaid Program').selectOption(data.program);
    await this.goNext('Provider Information');
  }

  async fillProviderInformation(data: ProviderData) {
    await this.page.getByLabel('First Name').fill(data.firstName);
    await this.page.getByLabel('Last Name').fill(data.lastName);
    await this.page.getByLabel('NPI').fill(data.npi);
    await this.page.getByLabel('Tax ID (EIN)').fill(data.taxId);
    await this.page.getByLabel('Email').fill(data.email);
    await this.page.getByLabel('Phone').fill(data.phone);
    await this.goNext('Practice Location');
  }

  async fillPracticeLocation(data: ProviderData) {
    await this.page.getByLabel('Street Address').fill(data.address1);
    await this.page.getByLabel('City').fill(data.city);
    await this.page.getByLabel('State', { exact: true }).selectOption(data.state);
    await this.page.getByLabel('ZIP Code').fill(data.zip);
    await this.goNext('Specialty & License');
  }

  async fillSpecialtyAndLicense(data: ProviderData) {
    await this.page.getByLabel('Taxonomy / Specialty').selectOption(data.taxonomy);
    await this.page.getByLabel('License Number').fill(data.licenseNumber);
    await this.page.getByLabel('License State').selectOption(data.licenseState);
    await this.page.getByLabel('License Expiration').fill(data.licenseExpiration);
    await this.goNext('Review & Submit');
  }

  /** Returns the value shown on the Review page for a given field label. */
  reviewValue(label: string): Locator {
    return this.reviewTable.getByRole('row').filter({ hasText: label }).getByRole('cell').nth(1);
  }

  async verifyReviewSummary(data: ProviderData) {
    await expect(this.reviewValue('Provider Type')).toHaveText(data.providerType);
    await expect(this.reviewValue('Medicaid Program')).toHaveText(data.program);
    await expect(this.reviewValue('Provider Name')).toHaveText(`${data.firstName} ${data.lastName}`);
    await expect(this.reviewValue('NPI')).toHaveText(data.npi);
    await expect(this.reviewValue('Tax ID')).toHaveText(data.taxId);
    await expect(this.reviewValue('Practice Address')).toHaveText(
      `${data.address1}, ${data.city}, ${data.state} ${data.zip}`,
    );
    await expect(this.reviewValue('Taxonomy')).toHaveText(data.taxonomy);
  }

  async attestAndSubmit() {
    await this.page.getByLabel(/I attest that the information provided/).check();
    await this.submitButton.click();
  }
}
