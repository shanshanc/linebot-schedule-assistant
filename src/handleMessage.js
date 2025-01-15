function formatTextMessage(input) {
    const text_json = [{
        "type": "text",
        "text": String(input)
    }]

    return text_json;
}

function createScheduleActionResponse(code, {idx = -1, courseKey = ''}) {
  return {
    code: code,
    details: {
      idx: idx,
      courseKey: courseKey
    }
  }
}

function createUserActionResponse(code, { courseKey = ''}) {
  return {
    code: code,
    details: {
      courseKey: courseKey
    }
  }
}

function createErrorResponse() {
  return {
    code: CODE.ERROR
  }
}

/*
 * getReplyMessage
 * get replay message for user based on action results
 * @param {object} action - { reserveName: string }
 * @return {string} reply message
 */
function getReplyMessage(name, details) {
  const info = getListItemInfo(details);
  const replyMsg = formatTextMessage(name + ' ' + info.trim());

  return replyMsg;
}

/*
 * getListItemInfo
 * @param {array} listData - array of reservation result object { courseKey: string, idx: number }
 * @return {string} 'courseDate courseTime courseName spotIndex'
 */
function getListItemInfo(resultList) {
  let info = resultList.reduce((acc, res) => {
    const { code, details } = res;
    const actionItemResult = getActionResultStr(code);

    if (!Object.keys(details).length) {
      return acc += `${actionItemResult}`;
    }

    const { courseKey, idx } = res.details;
    // courseKey: yyyy-mm-dd_hhmm_courseName
    const info = courseKey.split('_');
    if (idx && idx >= 0) {
      return acc += `${actionItemResult} ${info[0]} ${info[1]} ${info[2]} 第${idx}位\n`;
    }
    return acc += `${actionItemResult} ${info[0]} ${info[1]} ${info[2]}`;
  }, '');

  return info
}

/*
 * getActionStrType
 * get matched string basedo on code number
 * @param {number} code - reserve/cancel status
 * @return {string} msg - corresponding string 
 */
function getActionResultStr(code) {
  let str = '';

  switch (code) {
    case CODE.SUCCESS_RESERVE:
      str = '預約成功';
      break;
    case CODE.SUCCESS_WAIT:
      str = '候補';
      break;
    case CODE.SUCCESS_CANCEL:
      str = '已取消';
      break;
    default:
      str = '沒有成功 QQ';
      break;
  }

  return str;
}