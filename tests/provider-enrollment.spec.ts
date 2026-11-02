import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EnrollmentPage, ProviderData } from '../pages/EnrollmentPage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { generateNpi, futureDate, uniqueSuffix } from '../utils/dataHelper';
import testData from '../test-data/provider.json';

test.describe('Provider Enrollment', () => {
  test('Enroll a new Individual provider in Medicaid Fee-for-Service @smoke', async ({ page }) => {
    // Unique, valid test data for every run
    const provider: ProviderData = {
      ...testData.individualProvider,
      lastName: `${testData.individualProvider.lastName}${uniqueSuffix()}`,
      npi: generateNpi(),
      licenseExpiration: futureDate(2),
    };
    const { username, password } = testData.credentials;

    const loginPage = new LoginPage(page);
    const dashboard = new DashboardPage(page);
    const enrollment = new EnrollmentPage(page);
    const confirmation = new ConfirmationPage(page);

    await test.step('Log in to the Provider Portal', async () => {
      await loginPage.goto();
      await loginPage.login(username, password);
      await dashboard.verifyLoaded(username);
    });

    await test.step('Start a new provider enrollment', async () => {
      await dashboard.startNewEnrollment();
      await enrollment.verifyLoaded();
    });

    await test.step('Step 1 - Select enrollment type and Medicaid program', async () => {
      await enrollment.fillEnrollmentType(provider);
    });

    await test.step('Step 2 - Enter provider information (name, NPI, Tax ID, contact)', async () => {
      await enrollment.fillProviderInformation(provider);
    });

    await test.step('Step 3 - Enter practice location', async () => {
      await enrollment.fillPracticeLocation(provider);
    });

    await test.step('Step 4 - Enter taxonomy and license details', async () => {
      await enrollment.fillSpecialtyAndLicense(provider);
    });

    await test.step('Step 5 - Verify review summary matches entered data', async () => {
      await enrollment.verifyReviewSummary(provider);
    });

    await test.step('Attest and submit the application', async () => {
      await enrollment.attestAndSubmit();
    });

    await test.step('Verify confirmation: tracking number and Pending Review status', async () => {
      const atn = await confirmation.verifySubmitted(
        `${provider.firstName} ${provider.lastName}`,
        provider.npi,
      );
      test.info().annotations.push({ type: 'Application Tracking Number', description: atn });
      console.log(`Enrollment submitted. ATN: ${atn} | NPI: ${provider.npi}`);
    });
  });
});
