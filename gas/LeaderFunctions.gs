/**
 * LeaderFunctions.gs - Leader-specific administrative functions
 *
 * Contains functions for group leaders to manage and view team reports
 */

/**
 * Get weekly statistics summary
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {Object} Statistics object
 */
function getWeeklyStats(weekString, groupName) {
  const reports = getAllReports(weekString, groupName);
  const allMembers = getAllActiveMembers(groupName);
  const notReported = getNotReportedMembers(weekString, groupName);

  // Calculate totals
  let totalIntCount = 0;
  let totalExtCount = 0;
  let totalAmount = 0;
  let totalOneOnOne = 0;

  reports.forEach(report => {
    totalIntCount += report.intCount || 0;
    totalExtCount += report.extCount || 0;
    totalAmount += report.amount || 0;
    totalOneOnOne += report.oneOnOne || 0;
  });

  return {
    weekString: weekString || getIsoWeekString(),
    totalMembers: allMembers.length,
    reportedCount: reports.length,
    notReportedCount: notReported.length,
    completionRate: allMembers.length > 0
      ? Math.round((reports.length / allMembers.length) * 100)
      : 0,
    totalIntCount: totalIntCount,
    totalExtCount: totalExtCount,
    totalReferrals: totalIntCount + totalExtCount,
    totalAmount: totalAmount,
    totalOneOnOne: totalOneOnOne
  };
}

/**
 * Build weekly statistics message
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {string} Formatted statistics message
 */
function buildWeeklyStatsMessage(weekString, groupName) {
  const stats = getWeeklyStats(weekString, groupName);
  const groupLabel = groupName ? `【${groupName}】` : '';

  let message = `【本週統計總覽】${groupLabel}\n`;
  message += `週次：${stats.weekString}\n\n`;
  message += `回報進度：${stats.reportedCount}/${stats.totalMembers} 人 (${stats.completionRate}%)\n`;
  message += `未回報：${stats.notReportedCount} 人\n\n`;
  message += `--- 累計數據 ---\n`;
  message += `內部引薦：${stats.totalIntCount} 張\n`;
  message += `外部引薦：${stats.totalExtCount} 張\n`;
  message += `引薦總計：${stats.totalReferrals} 張\n`;
  message += `總金額：$${formatNumber(stats.totalAmount)}\n`;
  message += `121 次數：${stats.totalOneOnOne} 次\n`;

  return message;
}

/**
 * Get member ranking by total referrals
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {Array} Sorted array of members by total referrals
 */
function getMemberRanking(weekString, groupName) {
  const reports = getAllReports(weekString, groupName);

  // Calculate total referrals for each member
  const rankings = reports.map(report => ({
    memberName: report.memberName,
    intCount: report.intCount || 0,
    extCount: report.extCount || 0,
    totalReferrals: (report.intCount || 0) + (report.extCount || 0),
    amount: report.amount || 0
  }));

  // Sort by total referrals (descending)
  rankings.sort((a, b) => b.totalReferrals - a.totalReferrals);

  return rankings;
}

/**
 * Build member ranking message
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {string} Formatted ranking message
 */
function buildRankingMessage(weekString, groupName) {
  const rankings = getMemberRanking(weekString, groupName);
  const weekLabel = weekString || getIsoWeekString();
  const groupLabel = groupName ? `【${groupName}】` : '';

  if (rankings.length === 0) {
    return `【本週引薦排行】${groupLabel}\n${weekLabel}\n\n目前無回報記錄。`;
  }

  let message = `【本週引薦排行】${groupLabel}\n${weekLabel}\n`;

  rankings.forEach((member, index) => {
    const rank = index + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
    message += `\n${medal} ${member.memberName}`;
    message += ` - ${member.totalReferrals} 張`;
    message += ` (內${member.intCount}/外${member.extCount})`;
  });

  return message;
}

/**
 * Send reminder to members who haven't reported
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {number} Number of reminders sent
 */
function sendReminderToNotReported(weekString, groupName) {
  const notReportedNames = getNotReportedMembers(weekString, groupName);
  const allMembers = getAllActiveMembers(groupName);

  // Find user IDs for not-reported members
  const notReportedMembers = allMembers.filter(m =>
    notReportedNames.includes(m.realName)
  );

  const reminderMessage = createTextMessage(
    `提醒：本週引薦回報尚未完成。\n\n請點擊選單「我要回報」進行填寫。\n\n回報截止時間：週三 23:00`
  );

  let sentCount = 0;

  notReportedMembers.forEach(member => {
    try {
      pushMessage(member.userId, reminderMessage);
      sentCount++;
      Logger.log(`Sent reminder to ${member.realName}`);
    } catch (e) {
      Logger.log(`Failed to send reminder to ${member.realName}: ${e.message}`);
    }
  });

  return sentCount;
}

/**
 * Export weekly data to a formatted string (for copy-paste)
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {string} Tab-separated data string
 */
function exportWeeklyData(weekString, groupName) {
  const reports = getAllReports(weekString, groupName);
  const weekLabel = weekString || getIsoWeekString();
  const groupLabel = groupName ? ` - ${groupName}` : '';

  let output = `${weekLabel}${groupLabel} 週報資料匯出\n\n`;
  output += `小組\t姓名\t內部張數\t內部對象\t外部張數\t外部項目\t總金額\t121次數\n`;

  reports.forEach(report => {
    output += `${report.groupName || '-'}\t`;
    output += `${report.memberName}\t`;
    output += `${report.intCount}\t`;
    output += `${report.intMemo || '-'}\t`;
    output += `${report.extCount}\t`;
    output += `${report.extMemo || '-'}\t`;
    output += `${report.amount}\t`;
    output += `${report.oneOnOne}\n`;
  });

  return output;
}

/**
 * Handle Member_List sheet edit event (Installable Trigger)
 * Auto-updates Rich Menu when Role column is changed
 *
 * Setup: Run setupMemberListTrigger() once to install this trigger
 *
 * @param {Object} e - Edit event object
 */
function onMemberListEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;

    // Only process Member_List sheet
    if (sheet.getName() !== MEMBER_LIST_SHEET_NAME) {
      return;
    }

    // Role is in column 4 (D)
    const ROLE_COLUMN = 4;
    if (range.getColumn() !== ROLE_COLUMN) {
      return;
    }

    // Get the edited row
    const row = range.getRow();
    if (row === 1) return; // Skip header

    // Get user ID from column A
    const userId = sheet.getRange(row, 1).getValue();
    if (!userId) return;

    // Get new role value
    const newRole = e.value;
    Logger.log(`[AUTO] Role changed for row ${row}: ${newRole}`);

    // Update Rich Menu based on new role
    const richMenuId = ADMIN_ROLES.includes(newRole) ? RICH_MENU_LEADER_ID : RICH_MENU_MEMBER_ID;
    const result = linkRichMenuToUser(userId, richMenuId);

    Logger.log(`[AUTO] Rich Menu updated: ${result ? 'OK' : 'FAILED'}`);
  } catch (error) {
    Logger.log(`[AUTO ERROR] ${error.message}`);
  }
}

/**
 * Setup installable trigger for Member_List edits
 * Run this function ONCE to enable auto Rich Menu updates
 */
function setupMemberListTrigger() {
  // Remove existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onMemberListEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger
  ScriptApp.newTrigger('onMemberListEdit')
    .forSpreadsheet(SPREADSHEET_ID)
    .onEdit()
    .create();

  Logger.log('Trigger installed: onMemberListEdit');
}

/**
 * Update member role (Leader can promote/demote members)
 * @param {string} targetUserId - Target member's LINE user ID
 * @param {string} newRole - New role (Leader, Officer, or Member)
 * @returns {boolean} Success status
 */
function updateMemberRole(targetUserId, newRole) {
  if (newRole !== ROLES.LEADER && newRole !== ROLES.OFFICER && newRole !== ROLES.MEMBER) {
    Logger.log(`Invalid role: ${newRole}`);
    return false;
  }

  const sheet = getMemberListSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === targetUserId) {
      sheet.getRange(i + 1, 4).setValue(newRole); // Column D = Role (after Group_Name)

      // Update rich menu based on admin status
      const richMenuId = ADMIN_ROLES.includes(newRole) ? RICH_MENU_LEADER_ID : RICH_MENU_MEMBER_ID;
      linkRichMenuToUser(targetUserId, richMenuId);

      Logger.log(`Updated role for ${data[i][1]} to ${newRole}`);
      return true;
    }
  }

  return false;
}
