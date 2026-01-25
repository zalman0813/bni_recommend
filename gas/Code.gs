/**
 * Code.gs - Main entry point for LINE Bot webhook
 *
 * This is the primary entry point that handles all incoming webhook events
 */

/**
 * Handle POST requests from LINE webhook
 * @param {Object} e - Event object from Google Apps Script
 * @returns {Object} Response object
 */
function doPost(e) {
  try {
    // Parse incoming webhook data
    const data = JSON.parse(e.postData.contents);

    // Process each event
    if (data.events && data.events.length > 0) {
      data.events.forEach(event => handleEvent(event));
    }

    // Return 200 OK
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(`Error in doPost: ${error.message}`);
    Logger.log(`Stack: ${error.stack}`);

    // Still return 200 to prevent LINE from retrying
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle a single webhook event
 * @param {Object} event - LINE webhook event
 */
function handleEvent(event) {
  const userId = event.source.userId;
  const replyToken = event.replyToken;

  Logger.log(`Received event type: ${event.type} from user: ${userId}`);

  switch (event.type) {
    case 'follow':
      handleFollowEvent(userId, replyToken);
      break;

    case 'message':
      handleMessageEvent(event, userId, replyToken);
      break;

    case 'postback':
      handlePostbackEvent(event, userId, replyToken);
      break;

    default:
      Logger.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle follow event (user adds bot as friend)
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleFollowEvent(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (member) {
    // Already registered, show appropriate menu
    const richMenuId = isAdmin(member) ? RICH_MENU_LEADER_ID : RICH_MENU_MEMBER_ID;
    linkRichMenuToUser(userId, richMenuId);

    replyMessage(replyToken, createTextMessage(
      `歡迎回來，${member.realName}！\n\n您的帳號已綁定，可直接使用選單功能。`
    ));
  } else {
    // New user, show unbound menu
    linkRichMenuToUser(userId, RICH_MENU_UNBOUND_ID);

    replyMessage(replyToken, createTextMessage(
      '歡迎加入！\n\n請點擊下方選單「啟動姓名綁定」來開始使用。'
    ));
  }
}

/**
 * Handle message event (text messages)
 * @param {Object} event - Message event object
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleMessageEvent(event, userId, replyToken) {
  if (event.message.type !== 'text') {
    replyMessage(replyToken, createTextMessage('請輸入文字訊息。'));
    return;
  }

  const text = event.message.text;

  // First, check if user is in a flow (state machine handles it)
  if (handleStateMessage(userId, text, replyToken)) {
    return;
  }

  // Not in any flow - check if user is registered
  const member = getMemberByUserId(userId);

  if (!member) {
    // Prompt to bind
    replyMessage(replyToken, createTextMessage(
      '您尚未綁定帳號。\n請點擊下方選單「啟動姓名綁定」來開始使用。'
    ));
    return;
  }

  // Default response for unrecognized messages
  replyMessage(replyToken, createTextMessage(
    '請使用下方選單操作。\n\n如需回報，請點擊「我要回報」。'
  ));
}

/**
 * Handle postback event (button clicks from rich menu or flex messages)
 * @param {Object} event - Postback event object
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handlePostbackEvent(event, userId, replyToken) {
  const postbackData = event.postback.data;

  // Parse postback data (format: action=xxx)
  const params = parsePostbackData(postbackData);
  const action = params.action;

  switch (action) {
    case 'start_binding':
      startBindingFlow(userId, replyToken);
      break;

    case 'start_report':
      handleStartReport(userId, replyToken);
      break;

    case 'view_my_summary':
      handleViewMySummary(userId, replyToken);
      break;

    case 'view_reported_list':
      handleViewReportedList(userId, replyToken);
      break;

    case 'view_not_reported':
      handleViewNotReported(userId, replyToken);
      break;

    case 'open_sheet':
      handleOpenSheet(userId, replyToken);
      break;

    case 'select_group':
      const groupName = decodeURIComponent(params.group || '');
      handleGroupSelection(userId, groupName, replyToken);
      break;

    case 'show_report_time':
      handleShowReportTime(userId, replyToken);
      break;

    default:
      Logger.log(`Unknown postback action: ${action}`);
      replyMessage(replyToken, createTextMessage('未知的操作。'));
  }
}

/**
 * Handle "start report" action
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleStartReport(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (!member) {
    replyMessage(replyToken, createTextMessage(
      '您尚未綁定帳號。\n請先點擊「啟動姓名綁定」。'
    ));
    return;
  }

  startReportFlow(userId, replyToken, member);
}

/**
 * Handle "view my summary" action
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleViewMySummary(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (!member) {
    replyMessage(replyToken, createTextMessage('您尚未綁定帳號。'));
    return;
  }

  const report = getMemberReport(member.realName);

  if (!report) {
    replyMessage(replyToken, createTextMessage(
      `${member.realName}，您本週尚未回報。\n\n請點擊「我要回報」進行填寫。`
    ));
    return;
  }

  const summary = buildFullSummaryMessage(member.realName, report);
  replyMessage(replyToken, createTextMessage(summary));
}

/**
 * Handle "view reported list" action (Leader/Officer only)
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleViewReportedList(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (!member || !isAdmin(member)) {
    replyMessage(replyToken, createTextMessage('此功能僅限組長/幹部使用。'));
    return;
  }

  // Filter by member's group
  const reportList = buildReportedListMessage(null, member.groupName);
  replyMessage(replyToken, createTextMessage(reportList));
}

/**
 * Handle "view not reported" action (Leader/Officer only)
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleViewNotReported(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (!member || !isAdmin(member)) {
    replyMessage(replyToken, createTextMessage('此功能僅限組長/幹部使用。'));
    return;
  }

  // Filter by member's group
  const notReportedList = buildNotReportedMessage(null, member.groupName);
  replyMessage(replyToken, createTextMessage(notReportedList));
}

/**
 * Handle "open sheet" action (Leader/Officer only)
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleOpenSheet(userId, replyToken) {
  const member = getMemberByUserId(userId);

  if (!member || !isAdmin(member)) {
    replyMessage(replyToken, createTextMessage('此功能僅限組長/幹部使用。'));
    return;
  }

  const sheetUrl = getSpreadsheetUrl();
  replyMessage(replyToken, createUriButtonMessage('開啟雲端總覽', sheetUrl));
}

/**
 * Handle "show report time" action
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function handleShowReportTime(userId, replyToken) {
  replyMessage(replyToken, createTextMessage(
    '📅 回報時間：週四 09:30 至 週三 21:00'
  ));
}

/**
 * Parse postback data string to object
 * @param {string} dataString - Postback data string (e.g., "action=start_report&param=value")
 * @returns {Object} Parsed parameters object
 */
function parsePostbackData(dataString) {
  const params = {};
  const pairs = dataString.split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[key] = value || '';
    }
  });

  return params;
}

/**
 * Test function for debugging
 */
function testDoPost() {
  // Simulate a message event
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        events: [{
          type: 'message',
          replyToken: 'test_reply_token',
          source: { userId: 'test_user_id' },
          message: { type: 'text', text: 'Hello' }
        }]
      })
    }
  };

  Logger.log('Testing doPost...');
  // Note: This won't actually send messages without a real reply token
  // doPost(testEvent);
}
