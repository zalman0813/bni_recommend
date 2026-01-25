/**
 * MessageBuilder.gs - Message construction utilities
 *
 * Builds formatted messages for summaries and lists
 */

/**
 * Build personal summary message with conditional display logic
 *
 * Display Logic:
 * - Referral section:
 *   - If (int > 0, ext > 0): Show both lines
 *   - If (int > 0, ext = 0): Show only internal line
 *   - If (int = 0, ext > 0): Show only external line
 *   - If (int = 0, ext = 0): Show "請準備感謝詞"
 * - Amount section:
 *   - If (amount > 10000): Show amount line
 *   - If (amount <= 10000): Hide amount line
 * - 121 section: Always hidden
 *
 * @param {string} memberName - Member's name
 * @param {Object} reportData - Report data object
 * @returns {string} Formatted summary message
 */
function buildSummaryMessage(memberName, reportData) {
  const intCount = reportData.intCount || 0;
  const intMemo = reportData.intMemo || '';
  const extCount = reportData.extCount || 0;
  const extMemo = reportData.extMemo || '';
  const amount = reportData.amount || 0;

  let message = `【引薦回報完成確認】\n`;
  message += `回報人：${memberName}\n\n`;

  // Build referral section
  if (intCount === 0 && extCount === 0) {
    message += `本週無引薦，請準備感謝詞。\n`;
  } else {
    if (intCount > 0) {
      const memoDisplay = intMemo ? `（給：${intMemo}）` : '';
      message += `本週內部引薦：${intCount} 張 ${memoDisplay}\n`;
    }
    if (extCount > 0) {
      const memoDisplay = extMemo ? `（給：${extMemo}）` : '';
      message += `外部引薦：${extCount} 張 ${memoDisplay}\n`;
    }
  }

  // Amount section (only show if > 10000)
  if (amount > 10000) {
    message += `金額：$${formatNumber(amount)}\n`;
  }

  message += `\n系統已自動更新數據。若需修改，請重新填寫即可覆蓋舊紀錄。`;

  return message;
}

/**
 * Build complete personal summary message (for "View My Data" action)
 * Shows ALL fields without any filtering logic
 *
 * @param {string} memberName - Member's name
 * @param {Object} reportData - Report data object
 * @returns {string} Formatted complete summary message
 */
function buildFullSummaryMessage(memberName, reportData) {
  const intCount = reportData.intCount || 0;
  const intMemo = reportData.intMemo || '';
  const extCount = reportData.extCount || 0;
  const extMemo = reportData.extMemo || '';
  const amount = reportData.amount || 0;
  const oneOnOne = reportData.oneOnOne || 0;

  let message = `【本週回報數據】\n`;
  message += `回報人：${memberName}\n\n`;

  // Internal referral (always show)
  const intMemoDisplay = intMemo ? `（給：${intMemo}）` : '';
  message += `內部引薦：${intCount} 張 ${intMemoDisplay}\n`;

  // External referral (always show)
  const extMemoDisplay = extMemo ? `（給：${extMemo}）` : '';
  message += `外部引薦：${extCount} 張 ${extMemoDisplay}\n`;

  // Amount (always show)
  message += `內外總金額：$${formatNumber(amount)}\n`;

  // 121 count (always show)
  message += `1對1 (121)：${oneOnOne} 次\n`;

  message += `\n如需修改，請點擊「我要回報」重新填寫。`;

  return message;
}

/**
 * Build detailed reported list message for leaders
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {string} Formatted list message
 */
function buildReportedListMessage(weekString, groupName) {
  const reports = getAllReports(weekString, groupName);
  const weekLabel = weekString || getIsoWeekString();
  const groupLabel = groupName ? `【${groupName}】` : '';

  if (reports.length === 0) {
    return `【本週已回報詳情】${groupLabel}\n${weekLabel}\n\n目前無回報記錄。`;
  }

  let message = `【本週已回報詳情】${groupLabel}\n${weekLabel}\n`;

  reports.forEach((report, index) => {
    message += `\n${index + 1}. ${report.memberName}\n`;

    // Internal referral
    const intMemoDisplay = report.intMemo || '/';
    message += `   內部引薦：${report.intCount} 張（給：${intMemoDisplay}）\n`;

    // External referral
    const extMemoDisplay = report.extMemo || '/';
    message += `   外部引薦：${report.extCount} 張（給：${extMemoDisplay}）\n`;

    // Amount and 121
    message += `   內外總金額：$${formatNumber(report.amount)} | 121：${report.oneOnOne} 次\n`;
  });

  return message;
}

/**
 * Build not reported members list message for leaders
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {string} Formatted list message
 */
function buildNotReportedMessage(weekString, groupName) {
  const notReported = getNotReportedMembers(weekString, groupName);
  const weekLabel = weekString || getIsoWeekString();
  const groupLabel = groupName ? `【${groupName}】` : '';

  if (notReported.length === 0) {
    return `【本週未回報名單】${groupLabel}\n${weekLabel}\n\n所有成員皆已回報！`;
  }

  let message = `【本週未回報名單】${groupLabel}\n${weekLabel}\n\n`;
  message += notReported.join('、');
  message += `\n\n共 ${notReported.length} 人尚未回報。`;

  return message;
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Build week status message (for debugging)
 * @returns {string} Current week status
 */
function buildWeekStatusMessage() {
  const weekString = getIsoWeekString();
  const isOpen = isReportingPeriodOpen();
  const reports = getAllReports();
  const notReported = getNotReportedMembers();

  let message = `【本週狀態】\n`;
  message += `週次：${weekString}\n`;
  message += `回報期間：${isOpen ? '開放中' : '已關閉'}\n`;
  message += `已回報：${reports.length} 人\n`;
  message += `未回報：${notReported.length} 人\n`;

  return message;
}
