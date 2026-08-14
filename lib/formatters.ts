/**
 * Formats monetary amounts using Intl.NumberFormat.
 * Hand-rolled string concatenation for money is strictly prohibited per spec.
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats decimals (e.g. 0.92) into percentage strings (e.g. "92%").
 */
export function formatPercentage(rate: number, decimalPlaces = 0): string {
  return `${(rate * 100).toFixed(decimalPlaces)}%`;
}

/**
 * Formats ISO date strings into readable human dates.
 */
export function formatDate(
  isoDateStr: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string {
  if (!isoDateStr) return "";
  const date = new Date(isoDateStr);
  if (isNaN(date.getTime())) return isoDateStr;
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
