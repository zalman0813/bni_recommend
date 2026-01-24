/**
 * LineApi.gs - LINE Messaging API wrapper
 */

const LINE_API_BASE = 'https://api.line.me/v2/bot';

/**
 * Send a reply message to LINE
 * @param {string} replyToken - Reply token from webhook event
 * @param {Array|Object} messages - Message object(s) to send
 * @returns {Object} API response
 */
function replyMessage(replyToken, messages) {
  const payload = {
    replyToken: replyToken,
    messages: Array.isArray(messages) ? messages : [messages]
  };

  return callLineApi('/message/reply', payload);
}

/**
 * Push a message to a specific user
 * @param {string} userId - LINE user ID
 * @param {Array|Object} messages - Message object(s) to send
 * @returns {Object} API response
 */
function pushMessage(userId, messages) {
  const payload = {
    to: userId,
    messages: Array.isArray(messages) ? messages : [messages]
  };

  return callLineApi('/message/push', payload);
}

/**
 * Get user profile
 * @param {string} userId - LINE user ID
 * @returns {Object} User profile { displayName, userId, pictureUrl, statusMessage }
 */
function getUserProfile(userId) {
  const url = `${LINE_API_BASE}/profile/${userId}`;
  const options = {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 200) {
    return JSON.parse(response.getContentText());
  } else {
    Logger.log(`Failed to get user profile: ${response.getContentText()}`);
    return null;
  }
}

/**
 * Link a rich menu to a user
 * @param {string} userId - LINE user ID
 * @param {string} richMenuId - Rich menu ID
 * @returns {boolean} Success status
 */
function linkRichMenuToUser(userId, richMenuId) {
  if (!richMenuId) {
    Logger.log('Rich menu ID is empty, skipping link');
    return false;
  }

  const url = `${LINE_API_BASE}/user/${userId}/richmenu/${richMenuId}`;
  const options = {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 200) {
    Logger.log(`Rich menu ${richMenuId} linked to user ${userId}`);
    return true;
  } else {
    Logger.log(`Failed to link rich menu: ${response.getContentText()}`);
    return false;
  }
}

/**
 * Unlink rich menu from a user
 * @param {string} userId - LINE user ID
 * @returns {boolean} Success status
 */
function unlinkRichMenuFromUser(userId) {
  const url = `${LINE_API_BASE}/user/${userId}/richmenu`;
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
 * Create a text message object
 * @param {string} text - Message text
 * @returns {Object} Text message object
 */
function createTextMessage(text) {
  return {
    type: 'text',
    text: text
  };
}

/**
 * Create a text message with Quick Reply buttons
 * @param {string} text - Message text
 * @param {Array} items - Array of Quick Reply items { label: string, data: string }
 * @returns {Object} Text message object with Quick Reply
 */
function createQuickReplyMessage(text, items) {
  return {
    type: 'text',
    text: text,
    quickReply: {
      items: items.map(item => ({
        type: 'action',
        action: {
          type: 'postback',
          label: item.label,
          data: item.data,
          displayText: item.label
        }
      }))
    }
  };
}

/**
 * Build Quick Reply items for group selection
 * @param {Array} groups - Array of group names
 * @returns {Array} Array of Quick Reply items
 */
function buildGroupQuickReplyItems(groups) {
  // LINE Quick Reply limit: max 13 items, label max 20 chars
  return groups.slice(0, 13).map(groupName => ({
    label: groupName.substring(0, 20),
    data: `${POSTBACK_ACTIONS.SELECT_GROUP}&group=${encodeURIComponent(groupName)}`
  }));
}

/**
 * Create a URI action button message using Flex Message
 * @param {string} text - Button label
 * @param {string} uri - URI to open
 * @returns {Object} Flex message object with URI button
 */
function createUriButtonMessage(text, uri) {
  return {
    type: 'flex',
    altText: text,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: text,
              uri: uri
            },
            style: 'primary'
          }
        ]
      }
    }
  };
}

/**
 * Internal: Call LINE API
 * @param {string} endpoint - API endpoint path
 * @param {Object} payload - Request payload
 * @returns {Object} API response
 */
function callLineApi(endpoint, payload) {
  const url = `${LINE_API_BASE}${endpoint}`;
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode !== 200) {
    Logger.log(`LINE API Error [${endpoint}]: ${responseCode} - ${responseText}`);
  }

  return {
    success: responseCode === 200,
    code: responseCode,
    body: responseText ? JSON.parse(responseText) : null
  };
}

/**
 * Validate LINE signature (for webhook security)
 * @param {string} body - Request body string
 * @param {string} signature - X-Line-Signature header value
 * @returns {boolean} True if signature is valid
 */
function validateSignature(body, signature) {
  const hmac = Utilities.computeHmacSha256Signature(body, LINE_CHANNEL_SECRET);
  const expectedSignature = Utilities.base64Encode(hmac);
  return signature === expectedSignature;
}
