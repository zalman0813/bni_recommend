/**
 * TimeUtils.gs - Time control and ISO week utilities
 */

/**
 * Check if current time is within the allowed reporting period
 * Open: Thursday 09:30 ~ Wednesday 21:00 (Taiwan time)
 * @returns {boolean} True if within allowed period
 */
function isReportingPeriodOpen() {
  const now = new Date();
  const taipeiTime = getTaipeiTime(now);

  const dayOfWeek = taipeiTime.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, ..., 6=Sat
  const hour = taipeiTime.getHours();
  const minute = taipeiTime.getMinutes();

  // Wednesday (3): only open until 23:59
  if (dayOfWeek === 3) {
    return hour < 23 || (hour === 23 && minute < 59);
  }

  // Thursday (4): open from 09:30
  if (dayOfWeek === 4) {
    return hour > 9 || (hour === 9 && minute >= 30);
  }

  // Friday (5), Saturday (6), Sunday (0), Monday (1), Tuesday (2): always open
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0 ||
      dayOfWeek === 1 || dayOfWeek === 2) {
    return true;
  }

  return false;
}

/**
 * Get the blocked message for non-reporting period
 * @returns {string} Blocked message text
 */
function getBlockedMessage() {
  return '目前非回報時段。請於 週四 09:30 至 週三 21:00 之間進行回報。';
}

/**
 * Get the current ISO week string (YYYY-Www format)
 * @param {Date} [date] - Date to calculate from (default: now)
 * @returns {string} ISO week string, e.g., "2024-W12"
 */
function getIsoWeekString(date) {
  const taipeiTime = getTaipeiTime(date || new Date());
  const weekInfo = getIsoWeekNumber(taipeiTime);
  const weekStr = weekInfo.week.toString().padStart(2, '0');
  return `${weekInfo.year}-W${weekStr}`;
}

/**
 * Calculate ISO week number
 * ISO week: Monday is first day, first week contains Jan 4th
 * @param {Date} date - Date to calculate
 * @returns {Object} { year: number, week: number }
 */
function getIsoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

  return {
    year: d.getUTCFullYear(),
    week: weekNo
  };
}

/**
 * Convert a date to Taiwan timezone
 * @param {Date} date - Date to convert
 * @returns {Date} Date adjusted to Taiwan timezone
 */
function getTaipeiTime(date) {
  // Get the timezone offset for Taiwan (UTC+8)
  const taipeiOffset = 8 * 60; // Taiwan is UTC+8

  // Get the current UTC time
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

  // Apply Taiwan offset
  return new Date(utc + (taipeiOffset * 60000));
}

/**
 * Format timestamp for display in sheets
 * @param {Date} [date] - Date to format (default: now)
 * @returns {string} Formatted timestamp "yyyy/MM/dd HH:mm:ss"
 */
function formatTimestamp(date) {
  const taipeiTime = getTaipeiTime(date || new Date());

  const year = taipeiTime.getFullYear();
  const month = (taipeiTime.getMonth() + 1).toString().padStart(2, '0');
  const day = taipeiTime.getDate().toString().padStart(2, '0');
  const hours = taipeiTime.getHours().toString().padStart(2, '0');
  const minutes = taipeiTime.getMinutes().toString().padStart(2, '0');
  const seconds = taipeiTime.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Test function for time utilities
 */
function testTimeUtils() {
  Logger.log('=== TimeUtils Test ===');
  Logger.log(`Current Taipei Time: ${getTaipeiTime(new Date())}`);
  Logger.log(`Is Reporting Period Open: ${isReportingPeriodOpen()}`);
  Logger.log(`Current ISO Week: ${getIsoWeekString()}`);
  Logger.log(`Formatted Timestamp: ${formatTimestamp()}`);

  // Test specific dates
  const thursday6am = new Date('2024-03-14T06:00:00+08:00');
  const wednesday11pm = new Date('2024-03-13T23:00:00+08:00');
  const wednesday10pm = new Date('2024-03-13T22:00:00+08:00');

  Logger.log(`\nTest Cases:`);
  Logger.log(`Thursday 06:00 should be open: ${isReportingPeriodOpen(thursday6am)}`);
  Logger.log(`Wednesday 23:00 should be closed: ${isReportingPeriodOpen(wednesday11pm)}`);
  Logger.log(`Wednesday 22:00 should be open: ${isReportingPeriodOpen(wednesday10pm)}`);
}
