/**
 * RichMenu.gs - Rich Menu management
 *
 * Creates and manages three rich menus:
 * 1. Menu_Unbound - For users who haven't registered
 * 2. Menu_Member - For registered members
 * 3. Menu_Leader - For registered leaders (with admin functions)
 */

const RICH_MENU_API = 'https://api.line.me/v2/bot/richmenu';

/**
 * Create all three rich menus
 * Run this function once during initial setup
 */
function createAllRichMenus() {
  Logger.log('Creating all rich menus...');

  const unboundId = createUnboundRichMenu();
  const memberId = createMemberRichMenu();
  const leaderId = createLeaderRichMenu();

  // Save IDs to script properties
  setRichMenuIds(unboundId, memberId, leaderId);

  Logger.log('All rich menus created successfully!');
  Logger.log(`Unbound Menu ID: ${unboundId}`);
  Logger.log(`Member Menu ID: ${memberId}`);
  Logger.log(`Leader Menu ID: ${leaderId}`);

  return {
    unboundId: unboundId,
    memberId: memberId,
    leaderId: leaderId
  };
}

/**
 * Create unbound user rich menu (1 button)
 * Size: 2500 x 843
 * @returns {string} Rich menu ID
 */
function createUnboundRichMenu() {
  const menuData = {
    size: { width: 2500, height: 843 },
    selected: true,
    name: 'Menu_Unbound',
    chatBarText: '點擊開始',
    areas: [
      {
        bounds: { x: 0, y: 0, width: 2500, height: 843 },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.START_BINDING,
          displayText: '啟動姓名綁定'
        }
      }
    ]
  };

  return createRichMenu(menuData);
}

/**
 * Create member rich menu (3 buttons)
 * Size: 2500 x 843
 * Layout:
 *   Top: [回報時間提示] (full width)
 *   Bottom: [我要回報] [查看本週數據]
 * @returns {string} Rich menu ID
 */
function createMemberRichMenu() {
  const menuData = {
    size: { width: 2500, height: 843 },
    selected: true,
    name: 'Menu_Member',
    chatBarText: '選單',
    areas: [
      // Top area: Report time info (full width)
      {
        bounds: { x: 0, y: 0, width: 2500, height: 295 },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.SHOW_REPORT_TIME
        }
      },
      // Bottom left: Start report
      {
        bounds: { x: 0, y: 295, width: 1250, height: 548 },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.START_REPORT,
          displayText: '我要回報'
        }
      },
      // Bottom right: View my summary
      {
        bounds: { x: 1250, y: 295, width: 1250, height: 548 },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.VIEW_MY_SUMMARY,
          displayText: '查看本週數據'
        }
      }
    ]
  };

  return createRichMenu(menuData);
}

/**
 * Create leader rich menu (6 buttons)
 * Size: 2500 x 1686 (2 rows x 3 columns)
 * Row 1: [組長專區] [我要回報] [查看本週數據]
 * Row 2: [本週已回報] [本週未回報] [雲端總覽]
 * @returns {string} Rich menu ID
 */
function createLeaderRichMenu() {
  const rowHeight = 843;

  const menuData = {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: 'Menu_Leader',
    chatBarText: '組長選單',
    areas: [
      // Row 1: [回報時間] [我要回報] [查看本週數據]
      {
        bounds: { x: 0, y: 0, width: 833, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.SHOW_REPORT_TIME
        }
      },
      {
        bounds: { x: 833, y: 0, width: 834, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.START_REPORT,
          displayText: '我要回報'
        }
      },
      {
        bounds: { x: 1667, y: 0, width: 833, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.VIEW_MY_SUMMARY,
          displayText: '查看本週數據'
        }
      },
      // Row 2: [本週已回報] [本週未回報] [雲端總覽]
      {
        bounds: { x: 0, y: rowHeight, width: 833, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.VIEW_REPORTED_LIST,
          displayText: '本週已回報'
        }
      },
      {
        bounds: { x: 833, y: rowHeight, width: 834, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.VIEW_NOT_REPORTED,
          displayText: '本週未回報'
        }
      },
      {
        bounds: { x: 1667, y: rowHeight, width: 833, height: rowHeight },
        action: {
          type: 'postback',
          data: POSTBACK_ACTIONS.OPEN_SHEET,
          displayText: '雲端總覽'
        }
      }
    ]
  };

  return createRichMenu(menuData);
}

/**
 * Create a rich menu via LINE API
 * @param {Object} menuData - Rich menu configuration
 * @returns {string} Created rich menu ID
 */
function createRichMenu(menuData) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    payload: JSON.stringify(menuData),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(RICH_MENU_API, options);
  const responseCode = response.getResponseCode();
  const responseBody = JSON.parse(response.getContentText());

  if (responseCode === 200) {
    Logger.log(`Created rich menu: ${responseBody.richMenuId}`);
    return responseBody.richMenuId;
  } else {
    Logger.log(`Failed to create rich menu: ${JSON.stringify(responseBody)}`);
    throw new Error(`Failed to create rich menu: ${responseBody.message}`);
  }
}

/**
 * Upload image to a rich menu
 * Note: Image must be uploaded separately after menu creation
 * @param {string} richMenuId - Rich menu ID
 * @param {Blob} imageBlob - Image as blob (PNG or JPEG)
 * @returns {boolean} Success status
 */
function uploadRichMenuImage(richMenuId, imageBlob) {
  const url = `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`;

  const options = {
    method: 'post',
    contentType: imageBlob.getContentType(),
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    payload: imageBlob.getBytes(),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 200) {
    Logger.log(`Uploaded image to rich menu: ${richMenuId}`);
    return true;
  } else {
    Logger.log(`Failed to upload rich menu image: ${response.getContentText()}`);
    return false;
  }
}

/**
 * Set default rich menu for all users
 * @param {string} richMenuId - Rich menu ID to set as default
 * @returns {boolean} Success status
 */
function setDefaultRichMenu(richMenuId) {
  const url = `${RICH_MENU_API}/${richMenuId}/default`;

  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  return response.getResponseCode() === 200;
}

/**
 * Delete a rich menu
 * @param {string} richMenuId - Rich menu ID to delete
 * @returns {boolean} Success status
 */
function deleteRichMenu(richMenuId) {
  const url = `${RICH_MENU_API}/${richMenuId}`;

  const options = {
    method: 'delete',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  return response.getResponseCode() === 200;
}

/**
 * Get all existing rich menus
 * @returns {Array} Array of rich menu objects
 */
function getAllRichMenus() {
  const url = `${RICH_MENU_API}/list`;

  const options = {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() === 200) {
    const data = JSON.parse(response.getContentText());
    return data.richmenus || [];
  }

  return [];
}

/**
 * Delete all existing rich menus
 * Use with caution - for cleanup purposes
 */
function deleteAllRichMenus() {
  const menus = getAllRichMenus();

  menus.forEach(menu => {
    deleteRichMenu(menu.richMenuId);
    Logger.log(`Deleted rich menu: ${menu.richMenuId} (${menu.name})`);
  });

  Logger.log(`Deleted ${menus.length} rich menus`);
}

/**
 * Assign appropriate rich menu to a user based on their status
 * @param {string} userId - LINE user ID
 */
function assignRichMenuByStatus(userId) {
  const member = getMemberByUserId(userId);

  let richMenuId;
  if (!member) {
    richMenuId = RICH_MENU_UNBOUND_ID;
  } else if (isAdmin(member)) {
    richMenuId = RICH_MENU_LEADER_ID;
  } else {
    richMenuId = RICH_MENU_MEMBER_ID;
  }

  linkRichMenuToUser(userId, richMenuId);
}
