/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number as Indonesian Rupiah
 * @param value - The number to format
 * @returns Formatted Rupiah string
 */
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a number with thousand separators for Indonesian locale
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

/**
 * Format a percentage value for Indonesian locale
 * @param value - The decimal value (e.g., 0.25 for 25%)
 * @returns Formatted percentage string
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as currency with proper locale settings
 * @param value - The number to format
 * @param locale - The locale to use (defaults to 'id-ID')
 * @param currency - The currency code (defaults to 'IDR')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  locale: string = 'id-ID', 
  currency: string = 'IDR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};