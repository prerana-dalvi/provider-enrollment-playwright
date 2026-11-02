# Provider Enrollment – Playwright + TypeScript Automation

End-to-end UI automation of a **Medicaid New Provider Enrollment** workflow, built with
[Playwright](https://playwright.dev) and TypeScript using the **Page Object Model (POM)**.

The scenario mirrors the enrollment flows I tested on state Medicaid / MMIS provider portals:
a provider logs in, completes a multi-step enrollment wizard, reviews the summary, attests,
submits, and receives an Application Tracking Number (ATN) with a *Pending Review* status.

> The repository includes a small **demo Provider Portal** (`demo-app/`) so the suite runs anywhere
> without access to a real MMIS environment. Playwright starts it automatically before the tests.

## Scenario covered

| Step | Action | Validation |
|------|--------|------------|
| 1 | Log in to the Provider Portal | Dashboard shows the logged-in user |
| 2 | Start *Enroll New Provider* | Enrollment wizard loads |
| 3 | Enrollment Type – Individual, Medicaid Fee-for-Service | No validation errors |
| 4 | Provider Info – name, **NPI (valid check digit)**, Tax ID, email, phone | NPI passes Luhn/80840 check |
| 5 | Practice Location – address, city, state, ZIP | Field formats accepted |
| 6 | Specialty & License – taxonomy code, license #, state, future expiration | Expiration must be a future date |
| 7 | Review & Submit | Summary matches every entered value |
| 8 | Attest & submit | ATN format `ATN##########`, status **Pending Review**, name and NPI match |

## Framework highlights

- **Page Object Model** – one class per screen in `pages/`
- **Dynamic test data** – a valid NPI generated on every run (CMS Luhn algorithm), unique last name, future license date (`utils/dataHelper.ts`)
- **Data-driven** – static values in `test-data/provider.json`
- **User-facing locators** – `getByRole` / `getByLabel` (resilient, accessibility-friendly)
- **`test.step`** blocks for readable HTML reports
- **Screenshots, video and trace** retained on failure
- **CI/CD** – GitHub Actions workflow runs the suite on every push (`.github/workflows/playwright.yml`)

## Project structure

```
provider-enrollment-playwright/
├── .github/workflows/playwright.yml   # CI pipeline
├── demo-app/                          # Demo Provider Portal (system under test)
│   ├── server.js
│   └── public/ (login, dashboard, enrollment pages)
├── pages/                             # Page Objects
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── EnrollmentPage.ts
│   └── ConfirmationPage.ts
├── test-data/provider.json            # Test data
├── tests/provider-enrollment.spec.ts  # Test scenario
├── utils/dataHelper.ts                # NPI generator & data helpers
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## How to run

Prerequisites: [Node.js](https://nodejs.org) 18+ (LTS recommended).

```bash
npm install                      # install dependencies
npx playwright install chromium  # download the browser (first time only)
npm test                         # run headless
npm run test:headed              # watch the browser
npm run test:ui                  # Playwright UI mode
npm run report                   # open the HTML report
```

To view the demo portal manually: `npm run start:app`, then open http://localhost:3000
(login: `provider.admin` / `Welcome@123`).

## Author

**Prerana Dalvi** – Senior Software Quality Engineer, Healthcare IT (Medicaid/MMIS)
[LinkedIn](https://linkedin.com/in/prerana-dalvi)
