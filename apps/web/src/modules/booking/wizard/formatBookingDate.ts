/** Locale-aware formatting for booking wizard (no date-fns). */

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

const MONTH_TITLE_UK = [
  'січень',
  'лютий',
  'березень',
  'квітень',
  'травень',
  'червень',
  'липень',
  'серпень',
  'вересень',
  'жовтень',
  'листопад',
  'грудень',
];

const WEEKDAYS_UK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const WEEKDAY_LONG_UK = [
  'неділя',
  'понеділок',
  'вівторок',
  'середа',
  'четвер',
  'пʼятниця',
  'субота',
];

const WEEKDAY_LONG_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const isUk = (language: string) => language.toLowerCase().startsWith('uk');

export const weekdayLabels = (language: string) =>
  isUk(language) ? WEEKDAYS_UK : WEEKDAYS_EN;

export const formatMonthTitle = (year: number, monthIndex: number, language: string) => {
  if (isUk(language)) {
    return `${MONTH_TITLE_UK[monthIndex]} ${year}`;
  }
  return `${MONTHS_EN[monthIndex]} ${year}`;
};

export const formatSelectedDayHeading = (isoDate: string, language: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isUk(language)) {
    return `${d} ${MONTHS_UK[m - 1]} · ${WEEKDAY_LONG_UK[date.getDay()]}`;
  }
  return `${d} ${MONTHS_EN[m - 1]} · ${WEEKDAY_LONG_EN[date.getDay()]}`;
};

export const formatConfirmDate = (isoDate: string, language: string) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isUk(language)) {
    return `${d} ${MONTHS_UK[m - 1]} ${y} · ${WEEKDAY_LONG_UK[date.getDay()]}`;
  }
  return `${d} ${MONTHS_EN[m - 1]} ${y} · ${WEEKDAY_LONG_EN[date.getDay()]}`;
};

export const formatSlotTime = (startAt: string) => {
  const match = startAt.match(/T(\d{2}:\d{2})/);
  return match?.[1] ?? startAt;
};
