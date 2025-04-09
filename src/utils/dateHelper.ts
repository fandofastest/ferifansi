import { format, isValid, parseISO } from 'date-fns';

/**
 * Formats a date string or Date object to a readable format
 * @param dateString Date string or Date object
 * @param formatString Format string for date-fns
 * @returns Formatted date string or '-' if invalid
 */
export const formatDate = (dateString: string | Date | undefined, formatString: string = 'dd MMM yyyy'): string => {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '-';
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};