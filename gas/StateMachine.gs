/**
 * StateMachine.gs - Conversation state management
 *
 * Uses CacheService for state storage with 6-hour expiration
 */

const STATE_CACHE_PREFIX = 'state_';
const STATE_EXPIRATION_SECONDS = 6 * 60 * 60; // 6 hours

/**
 * Get user's current state
 * @param {string} userId - LINE user ID
 * @returns {Object} State object { state: string, data: Object }
 */
function getUserState(userId) {
  const cache = CacheService.getScriptCache();
  const key = STATE_CACHE_PREFIX + userId;
  const cached = cache.get(key);

  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      Logger.log(`Failed to parse cached state: ${e}`);
    }
  }

  return { state: STATES.IDLE, data: {} };
}

/**
 * Set user's state
 * @param {string} userId - LINE user ID
 * @param {string} state - New state
 * @param {Object} [data={}] - State data to persist
 */
function setUserState(userId, state, data = {}) {
  const cache = CacheService.getScriptCache();
  const key = STATE_CACHE_PREFIX + userId;
  const stateObj = { state: state, data: data };

  cache.put(key, JSON.stringify(stateObj), STATE_EXPIRATION_SECONDS);
  Logger.log(`Set state for ${userId}: ${state}`);
}

/**
 * Clear user's state (reset to IDLE)
 * @param {string} userId - LINE user ID
 */
function clearUserState(userId) {
  const cache = CacheService.getScriptCache();
  const key = STATE_CACHE_PREFIX + userId;
  cache.remove(key);
  Logger.log(`Cleared state for ${userId}`);
}

/**
 * Handle user message based on current state
 * @param {string} userId - LINE user ID
 * @param {string} text - User's message text
 * @param {string} replyToken - Reply token
 * @returns {boolean} Whether the message was handled
 */
function handleStateMessage(userId, text, replyToken) {
  const userState = getUserState(userId);
  const state = userState.state;
  const data = userState.data;

  switch (state) {
    case STATES.BINDING:
      return handleBindingState(userId, text, replyToken, data);

    case STATES.BINDING_SELECT_GROUP:
      // Group selection is handled via postback, not text message
      replyMessage(replyToken, createTextMessage('請使用下方按鈕選擇您的小組。'));
      return true;

    case STATES.Q1_INT_COUNT:
      return handleQ1(userId, text, replyToken, data);

    case STATES.Q2_INT_MEMO:
      return handleQ2(userId, text, replyToken, data);

    case STATES.Q3_EXT_COUNT:
      return handleQ3(userId, text, replyToken, data);

    case STATES.Q4_EXT_MEMO:
      return handleQ4(userId, text, replyToken, data);

    case STATES.Q5_AMOUNT:
      return handleQ5(userId, text, replyToken, data);

    case STATES.Q6_ONE_ON_ONE:
      return handleQ6(userId, text, replyToken, data);

    case STATES.IDLE:
    default:
      // Not in any flow, let Code.gs handle it
      return false;
  }
}

/**
 * Start binding flow
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 */
function startBindingFlow(userId, replyToken) {
  setUserState(userId, STATES.BINDING, {});
  replyMessage(replyToken, createTextMessage('請輸入您的真實姓名：'));
}

/**
 * Handle binding state - user is entering their name
 * @param {string} userId - LINE user ID
 * @param {string} name - User's entered name
 * @param {string} replyToken - Reply token
 * @param {Object} data - Current state data
 * @returns {boolean} Success
 */
function handleBindingState(userId, name, replyToken, data) {
  try {
    // Validate name (at least 2 characters, no special chars)
    if (!name || name.trim().length < 2) {
      replyMessage(replyToken, createTextMessage('姓名至少需要2個字，請重新輸入：'));
      return true;
    }

    const cleanName = name.trim();

    // Get available groups
    const groups = getAllGroups();

    if (groups.length === 0) {
      // No groups defined, register without group
      completeBinding(userId, cleanName, '', replyToken);
      return true;
    }

    // Save name and move to group selection state
    data.realName = cleanName;
    setUserState(userId, STATES.BINDING_SELECT_GROUP, data);

    // Send Quick Reply with group options
    const quickReplyItems = buildGroupQuickReplyItems(groups);
    const msg = createQuickReplyMessage('請選擇您的小組：', quickReplyItems);
    replyMessage(replyToken, msg);

    return true;
  } catch (error) {
    Logger.log(`Binding error: ${error.message}`);
    try {
      replyMessage(replyToken, createTextMessage('綁定過程發生錯誤，請稍後再試。'));
    } catch (e) {
      // Silently fail if reply fails
    }
    return true;
  }
}

/**
 * Handle group selection from postback
 * @param {string} userId - LINE user ID
 * @param {string} groupName - Selected group name
 * @param {string} replyToken - Reply token
 */
function handleGroupSelection(userId, groupName, replyToken) {
  const userState = getUserState(userId);

  if (userState.state !== STATES.BINDING_SELECT_GROUP) {
    Logger.log(`Unexpected state for group selection: ${userState.state}`);
    return;
  }

  const realName = userState.data.realName;
  completeBinding(userId, realName, groupName, replyToken);
}

/**
 * Complete the binding process
 * @param {string} userId - LINE user ID
 * @param {string} realName - User's real name
 * @param {string} groupName - User's group name
 * @param {string} replyToken - Reply token
 */
function completeBinding(userId, realName, groupName, replyToken) {
  // Register member with group
  const member = registerMember(userId, realName, groupName);

  // Clear state
  clearUserState(userId);

  // Switch rich menu based on role
  const richMenuId = isAdmin(member) ? RICH_MENU_LEADER_ID : RICH_MENU_MEMBER_ID;
  linkRichMenuToUser(userId, richMenuId);

  // Send confirmation
  const groupInfo = groupName ? `\n小組：${groupName}` : '';

  replyMessage(replyToken, createTextMessage(
    `綁定成功！\n\n您好，${realName}！${groupInfo}\n已成功綁定您的 LINE 帳號。\n\n您現在可以使用選單進行回報。`
  ));
}

/**
 * Start report flow
 * @param {string} userId - LINE user ID
 * @param {string} replyToken - Reply token
 * @param {Object} member - Member object
 */
function startReportFlow(userId, replyToken, member) {
  // Check time restriction
  if (!isReportingPeriodOpen()) {
    replyMessage(replyToken, createTextMessage(getBlockedMessage()));
    return;
  }

  // Initialize report data and move to Q1
  setUserState(userId, STATES.Q1_INT_COUNT, {
    memberName: member.realName,
    groupName: member.groupName
  });
  replyMessage(replyToken, createTextMessage('請問本週 內部引薦 張數？（僅輸入數字）'));
}

/**
 * Handle Q1 - Internal referral count
 */
function handleQ1(userId, text, replyToken, data) {
  const count = parseNumber(text);

  if (count === null) {
    replyMessage(replyToken, createTextMessage('格式錯誤，請輸入半形數字（例如：2）'));
    return true;
  }

  data.intCount = count;

  // If count is 0, skip Q2 (internal memo) and go to Q3
  if (count === 0) {
    data.intMemo = '';
    setUserState(userId, STATES.Q3_EXT_COUNT, data);
    replyMessage(replyToken, createTextMessage('請問本週 外部引薦 張數？（僅輸入數字）'));
  } else {
    setUserState(userId, STATES.Q2_INT_MEMO, data);
    replyMessage(replyToken, createTextMessage('請問內部引薦對象？'));
  }

  return true;
}

/**
 * Handle Q2 - Internal referral memo
 */
function handleQ2(userId, text, replyToken, data) {
  data.intMemo = text.trim() === '/' ? '' : text.trim();
  setUserState(userId, STATES.Q3_EXT_COUNT, data);
  replyMessage(replyToken, createTextMessage('請問本週 外部引薦 張數？（僅輸入數字）'));

  return true;
}

/**
 * Handle Q3 - External referral count
 */
function handleQ3(userId, text, replyToken, data) {
  const count = parseNumber(text);

  if (count === null) {
    replyMessage(replyToken, createTextMessage('格式錯誤，請輸入半形數字（例如：2）'));
    return true;
  }

  data.extCount = count;

  // If count is 0, skip Q4 (external memo) and go to Q5
  if (count === 0) {
    data.extMemo = '';
    setUserState(userId, STATES.Q5_AMOUNT, data);
    replyMessage(replyToken, createTextMessage('請問本週 內外總金額？（僅輸入數字）'));
  } else {
    setUserState(userId, STATES.Q4_EXT_MEMO, data);
    replyMessage(replyToken, createTextMessage('請問外部引薦對象？'));
  }

  return true;
}

/**
 * Handle Q4 - External referral memo
 */
function handleQ4(userId, text, replyToken, data) {
  data.extMemo = text.trim() === '/' ? '' : text.trim();
  setUserState(userId, STATES.Q5_AMOUNT, data);
  replyMessage(replyToken, createTextMessage('請問本週 內外總金額？（僅輸入數字）'));

  return true;
}

/**
 * Handle Q5 - Total amount
 */
function handleQ5(userId, text, replyToken, data) {
  const amount = parseNumber(text);

  if (amount === null) {
    replyMessage(replyToken, createTextMessage('格式錯誤，請輸入半形數字（例如：5000）'));
    return true;
  }

  data.amount = amount;
  setUserState(userId, STATES.Q6_ONE_ON_ONE, data);
  replyMessage(replyToken, createTextMessage('請問本週 1對1 (121) 次數？（僅輸入數字）'));

  return true;
}

/**
 * Handle Q6 - 121 count (final question)
 */
function handleQ6(userId, text, replyToken, data) {
  try {
    const count = parseNumber(text);

    if (count === null) {
      replyMessage(replyToken, createTextMessage('格式錯誤，請輸入半形數字（例如：1）'));
      return true;
    }

    data.oneOnOne = count;

    // Save report to sheet
    const reportData = {
      intCount: data.intCount,
      intMemo: data.intMemo,
      extCount: data.extCount,
      extMemo: data.extMemo,
      amount: data.amount,
      oneOnOne: data.oneOnOne
    };

    // Check if memberName exists
    if (!data.memberName) {
      replyMessage(replyToken, createTextMessage('系統錯誤：無法取得會員資料，請重新開始回報。'));
      clearUserState(userId);
      return true;
    }

    upsertReport(data.memberName, data.groupName, reportData);

    // Clear state
    clearUserState(userId);

    // Build and send summary
    const summary = buildSummaryMessage(data.memberName, reportData);
    replyMessage(replyToken, createTextMessage(summary));

    return true;
  } catch (error) {
    Logger.log(`Report error: ${error.message}`);

    // Try to notify user about the error
    try {
      pushMessage(userId, createTextMessage('系統錯誤，請稍後再試。'));
    } catch (e) {
      // Silently fail if push fails
    }

    clearUserState(userId);
    return true;
  }
}

/**
 * Parse text as a non-negative integer
 * @param {string} text - Text to parse
 * @returns {number|null} Parsed number or null if invalid
 */
function parseNumber(text) {
  const trimmed = text.trim();

  // Check if it's a valid non-negative integer
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  const num = parseInt(trimmed, 10);
  return isNaN(num) ? null : num;
}
