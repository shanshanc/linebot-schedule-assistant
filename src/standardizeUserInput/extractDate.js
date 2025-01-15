var ONE_DAY_MILLISECONDS = 1000 * 60 * 60 * 24;

/*
 * findDate
 * get date timestamp from string
 * @param {string} str
 * @return {number} timestamp
 */
function findDate(str) {
  const hasSlash = IDENTIFIERS.SLASH.some(slash => str.indexOf(slash) > -1);
  const isToday = DATETIME_KEYWORDS.TODAY.some(keyword => str.indexOf(keyword) > -1);
  const isTmw = DATETIME_KEYWORDS.TOMORROW.some(keyword => str.indexOf(keyword) > -1);
  const weekdayIdx = getWeekdayIndex(str);
  let dateStamp = null;

  if (hasSlash) {
    dateStamp = extractDate(str);
  } else if (isToday) {
    dateStamp = getDateObj().valueOf();
  } else if (isTmw) {
    dateStamp = getTomorrowStamp();
  } else if (weekdayIdx > -1) {
    dateStamp = getLatestWeekdayStamp(weekdayIdx);
  }

  return dateStamp;
}

/*
 * extractDate
 * extract month and date from string that contains slash
 * return timestamp for the date
 * @param {string} str - string contains slash (/)
 * @return {number} timestamp
 */
function extractDate(str) {
  // (\d{1,2})   - Captures 1-2 digits for month
  // /           - Literal forward slash
  // (\d{1,2})   - Captures 1-2 digits for day
  const monthDatePattern = /(\d{1,2})\/(\d{1,2})/gm;
  const matched = str.match(monthDatePattern);

  if (!matched) {
    return null
  }

  const todayObj = getDateObj();
  const year = todayObj.getFullYear();

  const slash = findMatchedValue(str, IDENTIFIERS.SLASH);
  const monthStr = matched[0].split(slash)[0];
  const dayStr = matched[0].split(slash)[1];
  const targetDate = new Date(year, Number(monthStr) - 1, Number(dayStr));

  if (targetDate.getMonth() < todayObj.getMonth()) {
    targetDate.setFullYear(year + 1);
  }

  return targetDate.valueOf();
}

/*
 * getDateObj
 * returns Date object for today if no timestamp provided
 * @param {number} timestamp
 * @return {object} Date object
 */
function getDateObj(timestamp = null) {
  if (!timestamp) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(timestamp);
}

/*
 * increaesByN
 * increase timestamp by n number of days
 * @param {number} originalStamp - timestamp
 * @param {number} n - number of days to increase
 * @return {number} timestamp
 */
function increaesByN(originalStamp, n = 0) {
  return originalStamp + ( ONE_DAY_MILLISECONDS * n );
}

/*
 * getTomorrowStamp
 * @return {number} timestamp for tomorrow
 */
function getTomorrowStamp() {
  const todayObj = getDateObj();
  return increaesByN(todayObj.valueOf(), 1);
}

/*
 * getLatestWeekdayStamp
 * @param {number} targetIdx - 0-6 for Sunday-Saturday
 * @return {number} timestamp
 */
function getLatestWeekdayStamp(targetIdx) {
  const todayObj = getDateObj();
  const current = todayObj.getDay();
  let gap = targetIdx - current;

  if (gap < 0) {
    gap += 7;
  }

  return increaesByN(todayObj.valueOf(), gap);
}

/*
 * getWeekdayIndex
 * @param {string} str
 * @return {number} -1 if not found, 0-6 for Sunday-Saturday
 */
function getWeekdayIndex(str) {
  let targetIdx = -1;
  const keys = Object.keys(DATETIME_KEYWORDS.WEEKDAY);
  keys.forEach(key => {
    if (str.indexOf(key) > -1) {
      targetIdx = DATETIME_KEYWORDS.WEEKDAY[key];
    }
  });

  return targetIdx;
}
