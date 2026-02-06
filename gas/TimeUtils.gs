/**
 * TimeUtils.gs - Time control and ISO week utilities
 */

/**
 * Check if current time is within the allowed reporting period
 * Open: Thursday 09:30 ~ Wednesday 23:59 (Taiwan time)
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

  // Shift week boundary from Monday to Thursday:
  // Subtract 3 days so Thu-Wed all map to the same ISO week.
  const adjusted = new Date(taipeiTime);
  adjusted.setDate(adjusted.getDate() - 3);

  const weekInfo = getIsoWeekNumber(adjusted);
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
 * One-time migration: move rows in 2026-W05 and 2026-W06 to correct sheets
 * based on the corrected getIsoWeekString() (Thu-Wed business week).
 * Run once in GAS editor, then delete this function.
 */
function migrateWeekData() {
  const ss = getSpreadsheet();
  const sheetsToFix = ['2026-W05', '2026-W06'];

  let movedCount = 0;
  let skippedCount = 0;

  for (const sheetName of sheetsToFix) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log(`Sheet ${sheetName} not found, skipping.`);
      continue;
    }

    const data = sheet.getDataRange().getValues();
    // Collect row indices to delete (1-indexed), process bottom-up later
    const rowsToDelete = [];

    // Skip header (row 0)
    for (let i = 1; i < data.length; i++) {
      const timestamp = data[i][0];
      if (!timestamp) continue;

      // Sheet stores Date objects natively; handle both Date and string
      let dateObj;
      if (timestamp instanceof Date) {
        dateObj = timestamp;
      } else {
        // Fallback: try parsing formatted string "yyyy/MM/dd HH:mm:ss"
        const parts = String(timestamp).match(/(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
        if (!parts) {
          Logger.log(`Row ${i + 1} in ${sheetName}: cannot parse timestamp "${timestamp}", skipping.`);
          skippedCount++;
          continue;
        }
        dateObj = new Date(`${parts[1]}-${parts[2]}-${parts[3]}T${parts[4]}:${parts[5]}:${parts[6]}+08:00`);
      }

      const correctSheet = getIsoWeekString(dateObj);

      if (correctSheet === sheetName) {
        // Already in the correct sheet
        skippedCount++;
        continue;
      }

      // Need to move this row to correctSheet
      const targetSheet = getOrCreateWeeklySheet(correctSheet);
      const memberName = data[i][2];

      // Check if member already exists in target sheet (upsert)
      const targetData = targetSheet.getDataRange().getValues();
      let existingRow = -1;
      for (let j = 1; j < targetData.length; j++) {
        if (targetData[j][2] === memberName) {
          existingRow = j + 1; // 1-indexed
          break;
        }
      }

      const rowData = data[i];
      if (existingRow > 0) {
        targetSheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
      } else {
        targetSheet.appendRow(rowData);
      }

      rowsToDelete.push(i + 1); // 1-indexed for sheet
      movedCount++;
      Logger.log(`Moved row ${i + 1} (${memberName}, ${dateObj}) from ${sheetName} → ${correctSheet}`);
    }

    // Delete moved rows bottom-up to preserve indices
    rowsToDelete.sort((a, b) => b - a);
    for (const row of rowsToDelete) {
      sheet.deleteRow(row);
    }

    Logger.log(`${sheetName}: moved ${rowsToDelete.length} rows, kept ${data.length - 1 - rowsToDelete.length} rows.`);
  }

  Logger.log(`\n=== Migration complete: ${movedCount} moved, ${skippedCount} unchanged ===`);
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

  Logger.log(`\nReporting Period Test Cases:`);
  Logger.log(`Thursday 06:00 should be open: ${isReportingPeriodOpen(thursday6am)}`);
  Logger.log(`Wednesday 23:00 should be closed: ${isReportingPeriodOpen(wednesday11pm)}`);
  Logger.log(`Wednesday 22:00 should be open: ${isReportingPeriodOpen(wednesday10pm)}`);

  // Test business period alignment (Thu-Wed = same sheet)
  Logger.log(`\n=== Business Period Alignment Tests ===`);

  // Period 3: Thu 2/5 ~ Wed 2/11 → should all be 2026-W06
  const thu = new Date('2026-02-05T10:00:00+08:00');
  const fri = new Date('2026-02-06T10:00:00+08:00');
  const sat = new Date('2026-02-07T10:00:00+08:00');
  const sun = new Date('2026-02-08T10:00:00+08:00');
  const mon = new Date('2026-02-09T10:00:00+08:00');
  const tue = new Date('2026-02-10T10:00:00+08:00');
  const wed = new Date('2026-02-11T20:00:00+08:00');

  Logger.log(`Period 3 (expect all 2026-W06):`);
  Logger.log(`  Thu 2/5:  ${getIsoWeekString(thu)}`);
  Logger.log(`  Fri 2/6:  ${getIsoWeekString(fri)}`);
  Logger.log(`  Sat 2/7:  ${getIsoWeekString(sat)}`);
  Logger.log(`  Sun 2/8:  ${getIsoWeekString(sun)}`);
  Logger.log(`  Mon 2/9:  ${getIsoWeekString(mon)}`);
  Logger.log(`  Tue 2/10: ${getIsoWeekString(tue)}`);
  Logger.log(`  Wed 2/11: ${getIsoWeekString(wed)}`);

  // Period 2: Thu 1/29 ~ Wed 2/4 → should all be 2026-W05
  const prevThu = new Date('2026-01-29T10:00:00+08:00');
  const prevWed = new Date('2026-02-04T20:00:00+08:00');

  Logger.log(`Period 2 (expect all 2026-W05):`);
  Logger.log(`  Thu 1/29: ${getIsoWeekString(prevThu)}`);
  Logger.log(`  Wed 2/4:  ${getIsoWeekString(prevWed)}`);

  // Period 1: Thu 1/22 ~ Wed 1/28 → should all be 2026-W04
  const p1Thu = new Date('2026-01-22T10:00:00+08:00');
  const p1Wed = new Date('2026-01-28T20:00:00+08:00');

  Logger.log(`Period 1 (expect all 2026-W04):`);
  Logger.log(`  Thu 1/22: ${getIsoWeekString(p1Thu)}`);
  Logger.log(`  Wed 1/28: ${getIsoWeekString(p1Wed)}`);
}
