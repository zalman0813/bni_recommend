/**
 * Config.gs - Configuration and environment variables
 *
 * IMPORTANT: Replace placeholder values before deployment
 */

// LINE Bot Configuration
const LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN') || 'YOUR_CHANNEL_ACCESS_TOKEN';
const LINE_CHANNEL_SECRET = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_SECRET') || 'YOUR_CHANNEL_SECRET';

// Google Sheets Configuration
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || 'YOUR_SPREADSHEET_ID';
const MEMBER_LIST_SHEET_NAME = 'Member_List';
const GROUP_LIST_SHEET_NAME = 'Group_List';

// Rich Menu IDs (will be set after creation)
const RICH_MENU_UNBOUND_ID = PropertiesService.getScriptProperties().getProperty('RICH_MENU_UNBOUND_ID') || '';
const RICH_MENU_MEMBER_ID = PropertiesService.getScriptProperties().getProperty('RICH_MENU_MEMBER_ID') || '';
const RICH_MENU_LEADER_ID = PropertiesService.getScriptProperties().getProperty('RICH_MENU_LEADER_ID') || '';

// Postback action data constants
const POSTBACK_ACTIONS = {
  START_BINDING: 'action=start_binding',
  START_REPORT: 'action=start_report',
  VIEW_MY_SUMMARY: 'action=view_my_summary',
  VIEW_REPORTED_LIST: 'action=view_reported_list',
  VIEW_NOT_REPORTED: 'action=view_not_reported',
  OPEN_SHEET: 'action=open_sheet',
  SELECT_GROUP: 'action=select_group',
  SHOW_REPORT_TIME: 'action=show_report_time'
};

// State machine states
const STATES = {
  IDLE: 'IDLE',
  BINDING_ENTER_CODE: 'BINDING_ENTER_CODE',
  BINDING: 'BINDING',
  BINDING_SELECT_GROUP: 'BINDING_SELECT_GROUP',
  Q1_INT_COUNT: 'Q1_INT_COUNT',
  Q2_INT_MEMO: 'Q2_INT_MEMO',
  Q3_EXT_COUNT: 'Q3_EXT_COUNT',
  Q4_EXT_MEMO: 'Q4_EXT_MEMO',
  Q5_AMOUNT: 'Q5_AMOUNT',
  Q6_ONE_ON_ONE: 'Q6_ONE_ON_ONE'
};

// User roles (Chinese)
const ROLES = {
  LEADER: '組長',
  OFFICER: '幹部',
  MEMBER: '組員'
};

// Roles with admin privileges (can view group reports)
const ADMIN_ROLES = [ROLES.LEADER, ROLES.OFFICER];

// Invite code (passphrase) for binding verification
const INVITE_CODE = '長盛軍';

// User status (Chinese)
const USER_STATUS = {
  ACTIVE: '啟用',
  INACTIVE: '停用'
};

/**
 * Get the Google Sheets URL for opening in browser
 * @returns {string} Google Sheets URL
 */
function getSpreadsheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;
}

/**
 * Initialize script properties (run once during setup)
 * @param {Object} config - Configuration object with keys to set
 */
function initializeScriptProperties(config) {
  const props = PropertiesService.getScriptProperties();

  if (config.channelAccessToken) {
    props.setProperty('LINE_CHANNEL_ACCESS_TOKEN', config.channelAccessToken);
  }
  if (config.channelSecret) {
    props.setProperty('LINE_CHANNEL_SECRET', config.channelSecret);
  }
  if (config.spreadsheetId) {
    props.setProperty('SPREADSHEET_ID', config.spreadsheetId);
  }

  Logger.log('Script properties initialized successfully');
}

/**
 * Set Rich Menu IDs in script properties
 * @param {string} unboundId - Rich Menu ID for unbound users
 * @param {string} memberId - Rich Menu ID for members
 * @param {string} leaderId - Rich Menu ID for leaders
 */
function setRichMenuIds(unboundId, memberId, leaderId) {
  const props = PropertiesService.getScriptProperties();

  if (unboundId) props.setProperty('RICH_MENU_UNBOUND_ID', unboundId);
  if (memberId) props.setProperty('RICH_MENU_MEMBER_ID', memberId);
  if (leaderId) props.setProperty('RICH_MENU_LEADER_ID', leaderId);

  Logger.log('Rich Menu IDs saved successfully');
}

/**
 * Get current configuration for debugging
 * @returns {Object} Current configuration (with masked tokens)
 */
function getConfigDebug() {
  return {
    hasChannelToken: !!LINE_CHANNEL_ACCESS_TOKEN && LINE_CHANNEL_ACCESS_TOKEN !== 'YOUR_CHANNEL_ACCESS_TOKEN',
    hasChannelSecret: !!LINE_CHANNEL_SECRET && LINE_CHANNEL_SECRET !== 'YOUR_CHANNEL_SECRET',
    hasSpreadsheetId: !!SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_SPREADSHEET_ID',
    hasRichMenuUnbound: !!RICH_MENU_UNBOUND_ID,
    hasRichMenuMember: !!RICH_MENU_MEMBER_ID,
    hasRichMenuLeader: !!RICH_MENU_LEADER_ID
  };
}
