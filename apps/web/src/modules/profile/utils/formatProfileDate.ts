/** Locale-aware DOB formatting for SCR-07 (no date-fns). */

const MONTHS_UK = [
  'січня',
  'лютого',
  'березня',
  'квітня',
  'травня',
  'червня',
  'липня',
  'серпня',
  'вересня',
  'жовтня',
  'листопада',
  'грудня',
];

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatProfileDate = (isoDate: string, language: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) {
    return isoDate;
  }

  if (language.toLowerCase().startsWith('uk')) {
    return `${d} ${MONTHS_UK[m - 1]} ${y}`;
  }

  return `${d} ${MONTHS_EN[m - 1]} ${y}`;
};
