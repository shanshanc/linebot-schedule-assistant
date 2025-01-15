function composeActionObj(str, displayName) {
  const actionType = getUserAction(str);
  const isMultipleRequest = isMultiple(str);
  const courseKeyArr = [];

  if (!actionType) {
    return null;
  }

  if (isMultipleRequest) {
    const lines = str.split('\n');
    lines.forEach((line) => {
      const hasSlash = IDENTIFIERS.SLASH.some(slash => str.indexOf(slash) > -1);
      if (hasSlash) {
        const courseKey = createCourseKey(line);
        if (courseKey) {
          courseKeyArr.push(courseKey);
        }
      }
    });
  } else {
    const courseKey = createCourseKey(str);
    if (courseKey) {
      courseKeyArr.push(courseKey);
    }
  }

  return {
    type: actionType,
    reserveName: displayName,
    courseKeys: courseKeyArr
  };
}

/*
 * createCourseKey
 * create course key using date, time, and course name from input string
 * @param {string} str
 * @return {object} {keyType: string, courseKey: string}
 */
function createCourseKey(str) {
  // course date
  const dateStamp = findDate(str);
  if (!dateStamp) {
    return null;
  }

  // course name
  const courseName = findMatchedValue(str, COURSE_NAMES);

  // course hour and minute
  const { hour, minute } = getHourMinute(str, dateStamp);
  const hasDateTime = dateStamp && hour && minute !== null;
  const timeSlot = findMatchedValue(str, DATETIME_KEYWORDS.TIMESLOT);
  const quantity = findRequestedUserNumber(str);

  let keyType = '',
      courseKey = '';
  
  if (hasDateTime && courseName !== null) {
    // primaryKey: date, time, and course name
    const targetDatetime = new Date(dateStamp);
    targetDatetime.setHours(hour, minute);
    keyType = COURSE_KEY_TYPE.PRIMARY;
    courseKey = generatePrimaryKey(targetDatetime.valueOf(), courseName);

  } else if (hasDateTime) {
    // secondaryKey: date + time
    keyType = COURSE_KEY_TYPE.SECONDARY;
    courseKey = generateSecondaryKey(dateStamp, hour, minute);

  } else if (timeSlot !== null && courseName !== null) {
    // tertiaryKey: timeSlot + courseName
    keyType = COURSE_KEY_TYPE.TERTIARY;
    courseKey = generateTertiaryKey(dateStamp, timeSlot, courseName);
  }

  if (courseKey === '' || keyType === '') {
    return null;
  }
  return {
    keyType: keyType,
    courseKey: courseKey,
    quantity
  };
}

/*
 * @param {string} str
 * @return {string} actionType - 'add' or 'cancel' 
 */
function getUserAction(str) {
  const isAdd = USER_REQUEST.ADD.some((val) => str.indexOf(val) > -1);
  const isCancel = USER_REQUEST.CANCEL.some((val) => str.indexOf(val) > -1);
  let type = null;

  if (isAdd) {
    type = ACTION.ADD;
  } else if (isCancel) {
    type = ACTION.CANCEL;
  }

  return type;
}

/*
 * isMultiple
 * @param {string} str 
 * @return {boolean} true if str contains multiple lines; false otherwise
 */
function isMultiple(str) {
  const regex = /(\r?\n)+/gm;
  const matched = str.match(regex);
  return matched ? matched.length > 1 : false;
}

// message: 日期 時間 課程 +/-1, 暱稱
function generateActionObj(message, userName) {
  const splitted = message.split(' ');
  const isAdd = splitted.some(word => USER_REQUEST.ADD_ONE.includes(word));
  const reserveClass = splitted[2];
  const timestamp = getTimestamp(splitted.slice(0, 2));
  
  if (splitted.length !== 4) {
    return null;
  }

  const courseKey = generatePrimaryKey(timestamp, reserveClass)
  const action = {
    type: isAdd ? ACTION.ADD : ACTION.CANCEL,
    quantity: 1,
    reserveClass: reserveClass,
    timestamp: timestamp,
    reserveName: userName,
    courseKey: courseKey
  }

  return action;
}

function getTimestamp(arr) {
  const date = arr[0];
  const time = arr[1];
  if (!date || !time) {
    return null;
  }

  const month = Number(date.split('/')[0]) - 1;
  const day = Number(date.split('/')[1]);
  const hour = Number(time.split(':')[0]);
  const minute = Number(time.split(':')[1]);

  const datetime = new Date('2024', month, day, hour, minute);
  return datetime.valueOf();
}

/*
 * findRequestedUserNumber
 * find the number of user specified in input string. For example: 1位, 2位, 一位, 兩位
 * param {string} str
 * return {number}
 */
function findRequestedUserNumber(str) {
  const isMoreThanOne = str.indexOf(USER_REQUEST.MULTIPLE_USER) > -1;
  const defaultQuantity = 1;

  if (!isMoreThanOne) {
    return defaultQuantity;
  }

  // pattern for a number or a Chinese character before the indicator "位"
  const pattern = /([0-9]|[\u4e00-\u9fa5])位/;
  const matched = str.match(pattern);
  const matchedTerm = matched[1];

  if (Number(matchedTerm)) {
    return Number(matchedTerm);
  }

  return QUANTITY_KEYWORDS[matchedTerm.normalize()] ?? defaultQuantity;
}

/*
 * @param {timestamp} timestamp
 * @param {string} courseName
 * @return {string} yyyy-mm-dd_hhmm_courseName
 */
function generatePrimaryKey(timestamp, courseName) {
  const d = new Date(timestamp);

  const month = generateTwoDigitStr(d.getMonth()+1),
        day = generateTwoDigitStr(d.getDate()),
        hrs = generateTwoDigitStr(d.getHours()),
        mins = generateTwoDigitStr(d.getMinutes());

  const courseId = `${d.getFullYear()}-${month}-${day}_${hrs}${mins}_${courseName}`;
  return courseId;
}

/*
 * @param {timestamp} dateStamp - timestamp which has date information
 * @param {number} hour - hour value
 * @param {number} minute - minute value
 * @return {string} yyyy-mm-dd_hhmm
 */
function generateSecondaryKey(dateStamp, hour, minute) {
  const d = new Date(dateStamp);
  d.setHours(hour, minute);

  let result = '';
  const month = generateTwoDigitStr(d.getMonth()+1),
        day = generateTwoDigitStr(d.getDate()),
        hrs = generateTwoDigitStr(d.getHours()),
        mins = generateTwoDigitStr(d.getMinutes());

  result = `${d.getFullYear()}-${month}-${day}_${hrs}${mins}`;
  return result;
}

/*
 * @param {timestamp} dateStamp - timestamp which has date information
 * @param {string} timeSlot - time slot value in DATETIME_KEYWORDS.TIMESLOT
 * @param {string} courseName
 * @return {string} yyyy-mm-dd_{timeslot}{courseName}
 */
function generateTertiaryKey(dateStamp, timeSlot, courseName) {
  const d = new Date(dateStamp);
  const month = generateTwoDigitStr(d.getMonth()+1),
        day = generateTwoDigitStr(d.getDate());

  return `${d.getFullYear()}-${month}-${day}_${timeSlot}${courseName}`;
}
