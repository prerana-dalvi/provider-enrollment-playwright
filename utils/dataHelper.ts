/**
 * Test-data helpers.
 */

/** Generates a random NPI with a valid CMS check digit (Luhn algorithm with the 80840 prefix). */
export function generateNpi(): string {
  // NPIs for individual providers start with 1
  const base = '1' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  let sum = 24; // constant for the 80840 prefix
  base
    .split('')
    .map(Number)
    .reverse()
    .forEach((digit, i) => {
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    });
  const checkDigit = (10 - (sum % 10)) % 10;
  return base + checkDigit;
}

/** Returns a date N years from today in yyyy-mm-dd format (for date inputs). */
export function futureDate(yearsAhead = 2): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + yearsAhead);
  return d.toISOString().slice(0, 10);
}

/** Short unique suffix so every run uses distinct data. */
export function uniqueSuffix(): string {
  return Date.now().toString().slice(-6);
}
