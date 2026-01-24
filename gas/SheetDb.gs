/**
 * SheetDb.gs - Google Sheets database operations
 */

/**
 * Get the spreadsheet instance
 * @returns {Spreadsheet} Google Sheets spreadsheet
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Get or create the Member_List sheet
 * @returns {Sheet} Member_List sheet
 */
function getMemberListSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(MEMBER_LIST_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(MEMBER_LIST_SHEET_NAME);
    // Set headers with Group_Name column
    sheet.getRange(1, 1, 1, 5).setValues([['LINE用戶ID', '真實姓名', '小組名稱', '角色', '狀態']]);
    sheet.setFrozenRows(1);
    Logger.log('Created Member_List sheet with headers');
  }

  return sheet;
}

/**
 * Get or create the Group_List sheet
 * @returns {Sheet} Group_List sheet
 */
function getGroupListSheet() {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(GROUP_LIST_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(GROUP_LIST_SHEET_NAME);
    // Set headers
    sheet.getRange(1, 1, 1, 1).setValues([['小組名稱']]);
    sheet.setFrozenRows(1);
    Logger.log('Created Group_List sheet with headers');
  }

  return sheet;
}

/**
 * Get all groups from Group_List
 * @returns {Array} Array of group names
 */
function getAllGroups() {
  const sheet = getGroupListSheet();
  const data = sheet.getDataRange().getValues();
  const groups = [];

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].trim()) {
      groups.push(data[i][0].trim());
    }
  }

  return groups;
}

/**
 * Get member by LINE User ID
 * @param {string} userId - LINE user ID
 * @returns {Object|null} Member object or null if not found
 */
function getMemberByUserId(userId) {
  const sheet = getMemberListSheet();
  const data = sheet.getDataRange().getValues();

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        userId: data[i][0],
        realName: data[i][1],
        groupName: data[i][2],
        role: data[i][3],
        status: data[i][4],
        rowIndex: i + 1 // 1-indexed for sheet operations
      };
    }
  }

  return null;
}

/**
 * Check if member has admin privileges (Leader or Officer)
 * @param {Object} member - Member object
 * @returns {boolean} True if member has admin privileges
 */
function isAdmin(member) {
  return member && ADMIN_ROLES.includes(member.role);
}

/**
 * Get all members of a specific group
 * @param {string} groupName - Group name to filter
 * @returns {Array} Array of member objects in the group
 */
function getGroupMembers(groupName) {
  const sheet = getMemberListSheet();
  const data = sheet.getDataRange().getValues();
  const members = [];

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === groupName && data[i][4] === USER_STATUS.ACTIVE) {
      members.push({
        userId: data[i][0],
        realName: data[i][1],
        groupName: data[i][2],
        role: data[i][3],
        status: data[i][4]
      });
    }
  }

  return members;
}

/**
 * Get all active members
 * @param {string} [groupName] - Optional group name to filter
 * @returns {Array} Array of member objects
 */
function getAllActiveMembers(groupName) {
  const sheet = getMemberListSheet();
  const data = sheet.getDataRange().getValues();
  const members = [];

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][4] === USER_STATUS.ACTIVE) {
      // Filter by group if specified
      if (groupName && data[i][2] !== groupName) {
        continue;
      }
      members.push({
        userId: data[i][0],
        realName: data[i][1],
        groupName: data[i][2],
        role: data[i][3],
        status: data[i][4]
      });
    }
  }

  return members;
}

/**
 * Register a new member
 * @param {string} userId - LINE user ID
 * @param {string} realName - User's real name
 * @param {string} groupName - User's group name
 * @param {string} [role='Member'] - User role (Member, Officer, or Leader)
 * @returns {Object} Newly created member object
 */
function registerMember(userId, realName, groupName, role = ROLES.MEMBER) {
  const sheet = getMemberListSheet();

  // Check if already exists
  const existing = getMemberByUserId(userId);
  if (existing) {
    // Update existing member's name and group if re-binding
    const rowIndex = existing.rowIndex;
    sheet.getRange(rowIndex, 2).setValue(realName);
    sheet.getRange(rowIndex, 3).setValue(groupName);
    Logger.log(`Updated member ${userId} with name ${realName}, group ${groupName}`);
    return getMemberByUserId(userId);
  }

  // Append new member (with Group_Name column)
  const newRow = [userId, realName, groupName, role, USER_STATUS.ACTIVE];
  sheet.appendRow(newRow);

  Logger.log(`Registered new member: ${realName} in ${groupName} (${userId})`);

  return {
    userId: userId,
    realName: realName,
    groupName: groupName,
    role: role,
    status: USER_STATUS.ACTIVE
  };
}

/**
 * Get or create weekly report sheet
 * Sheet naming: YYYY-Www (e.g., 2024-W12)
 * New sheets are inserted at index 0 (leftmost)
 * @param {string} [weekString] - ISO week string (default: current week)
 * @returns {Sheet} Weekly report sheet
 */
function getOrCreateWeeklySheet(weekString) {
  const sheetName = weekString || getIsoWeekString();
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    // Create new sheet at index 0 (leftmost)
    sheet = ss.insertSheet(sheetName, 0);

    // Set headers with Group_Name column (Chinese)
    const headers = [
      '更新時間',
      '小組名稱',
      '成員姓名',
      '內部引薦',
      '內部備註',
      '外部引薦',
      '外部備註',
      '總金額',
      '121次數'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);

    // Set column widths for better readability
    sheet.setColumnWidth(1, 150); // 更新時間
    sheet.setColumnWidth(2, 100); // 小組名稱
    sheet.setColumnWidth(3, 100); // 成員姓名
    sheet.setColumnWidth(4, 80);  // 內部引薦
    sheet.setColumnWidth(5, 150); // 內部備註
    sheet.setColumnWidth(6, 80);  // 外部引薦
    sheet.setColumnWidth(7, 150); // 外部備註
    sheet.setColumnWidth(8, 100); // 總金額
    sheet.setColumnWidth(9, 80);  // 121次數

    Logger.log(`Created weekly sheet: ${sheetName}`);
  }

  return sheet;
}

/**
 * Upsert (insert or update) a report record
 * @param {string} memberName - Member's real name
 * @param {string} groupName - Member's group name
 * @param {Object} reportData - Report data object
 * @returns {boolean} Success status
 */
function upsertReport(memberName, groupName, reportData) {
  const sheet = getOrCreateWeeklySheet();
  const data = sheet.getDataRange().getValues();

  // Find existing row for this member (check Member_Name in column 3, index 2)
  let existingRow = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === memberName) {
      existingRow = i + 1; // 1-indexed
      break;
    }
  }

  const timestamp = formatTimestamp();
  const rowData = [
    timestamp,
    groupName,
    memberName,
    reportData.intCount || 0,
    reportData.intMemo || '',
    reportData.extCount || 0,
    reportData.extMemo || '',
    reportData.amount || 0,
    reportData.oneOnOne || 0
  ];

  if (existingRow > 0) {
    // Update existing row
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Append new row
    sheet.appendRow(rowData);
  }

  return true;
}

/**
 * Get a member's report for the current week
 * @param {string} memberName - Member's real name
 * @param {string} [weekString] - ISO week string (default: current week)
 * @returns {Object|null} Report data or null if not found
 */
function getMemberReport(memberName, weekString) {
  const sheetName = weekString || getIsoWeekString();
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return null;
  }

  const data = sheet.getDataRange().getValues();

  // Skip header row (index 0), Member_Name is in column 3 (index 2)
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === memberName) {
      return {
        timestamp: data[i][0],
        groupName: data[i][1],
        memberName: data[i][2],
        intCount: data[i][3],
        intMemo: data[i][4],
        extCount: data[i][5],
        extMemo: data[i][6],
        amount: data[i][7],
        oneOnOne: data[i][8]
      };
    }
  }

  return null;
}

/**
 * Get all reports for the current week
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {Array} Array of report objects
 */
function getAllReports(weekString, groupName) {
  const sheetName = weekString || getIsoWeekString();
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return [];
  }

  const data = sheet.getDataRange().getValues();
  const reports = [];

  // Skip header row (index 0), Member_Name is in column 3 (index 2)
  for (let i = 1; i < data.length; i++) {
    if (data[i][2]) { // Has member name
      // Filter by group if specified
      if (groupName && data[i][1] !== groupName) {
        continue;
      }
      reports.push({
        timestamp: data[i][0],
        groupName: data[i][1],
        memberName: data[i][2],
        intCount: data[i][3],
        intMemo: data[i][4],
        extCount: data[i][5],
        extMemo: data[i][6],
        amount: data[i][7],
        oneOnOne: data[i][8]
      });
    }
  }

  return reports;
}

/**
 * Get list of members who haven't reported this week
 * @param {string} [weekString] - ISO week string (default: current week)
 * @param {string} [groupName] - Optional group name to filter
 * @returns {Array} Array of member names who haven't reported
 */
function getNotReportedMembers(weekString, groupName) {
  const allMembers = getAllActiveMembers(groupName);
  const reports = getAllReports(weekString, groupName);

  // Create a Set of reported member names
  const reportedNames = new Set(reports.map(r => r.memberName));

  // Filter members who haven't reported
  const notReported = allMembers
    .filter(m => !reportedNames.has(m.realName))
    .map(m => m.realName);

  return notReported;
}

/**
 * Test function for SheetDb operations
 */
function testSheetDb() {
  Logger.log('=== SheetDb Test ===');

  // Test getMemberListSheet
  const memberSheet = getMemberListSheet();
  Logger.log(`Member_List sheet exists: ${!!memberSheet}`);

  // Test getOrCreateWeeklySheet
  const weeklySheet = getOrCreateWeeklySheet();
  Logger.log(`Weekly sheet name: ${weeklySheet.getName()}`);

  // Test getAllActiveMembers
  const members = getAllActiveMembers();
  Logger.log(`Active members count: ${members.length}`);

  // Test getAllReports
  const reports = getAllReports();
  Logger.log(`Current week reports count: ${reports.length}`);

  // Test getNotReportedMembers
  const notReported = getNotReportedMembers();
  Logger.log(`Not reported members: ${notReported.join(', ')}`);
}

/**
 * Test function for Group_List - run this manually in GAS editor
 */
function testGetAllGroups() {
  Logger.log('=== Testing getAllGroups ===');

  try {
    const groups = getAllGroups();
    Logger.log(`Found ${groups.length} groups:`);
    groups.forEach((g, i) => Logger.log(`  ${i + 1}. ${g}`));

    if (groups.length > 0) {
      const quickReplyItems = buildGroupQuickReplyItems(groups);
      Logger.log('Quick Reply items:');
      Logger.log(JSON.stringify(quickReplyItems, null, 2));
    }
  } catch (error) {
    Logger.log(`ERROR: ${error.message}`);
    Logger.log(error.stack);
  }
}
