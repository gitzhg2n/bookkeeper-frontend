export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
}

export default formatCurrency;
