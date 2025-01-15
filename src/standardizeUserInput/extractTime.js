/*
 * getHourMinute
 * get hour and minute from string
 * @param {string} str
 * @return {object} {hour: number, minute: number}
 */
function getHourMinute(str) {
  const hasColon = IDENTIFIERS.COLON.some(colon => str.indexOf(colon) > -1);
  const hasHour = IDENTIFIERS.HOUR.some(hour => str.indexOf(String(hour)) > -1);
  const hasHhMm = str.match(/d{4}/gm)
  let hour = 0,
      minute = 0;

  if (hasColon) {
    hour = extractTime(str).hour;
    minute = extractTime(str).minute;
  } else if (hasHour) {
    hour = findTime(str).hour;
    minute = findTime(str).minute;
  } else if (hasHhMm) {
    hour = findTimeFromHhMm(str).hour;
    minute = findTimeFromHhMm(str).minute;
  }

  return { hour, minute };
}

/*
 * extractTime
 * extract time from string that contains colon
 * @param {string} str - string contains colon (:)
 * @return {object} {hour: number, minute: number}
 */
function extractTime(str) {
  // (\d{1,2})   - Captures 1-2 digits for hour
  // /           - Literal colon
  // (\d{1,2})   - Captures 1-2 digits for minute
  const timePattern = /(\d{1,2})\:(\d{1,2})/gm;
  const matched = str.match(timePattern);
  const hour = matched[0].split(':')[0];
  const minute = matched[0].split(':')[1];
  return {hour, minute}
}

/*
 * findTime
 * find time from string
 * @param {string} str
 * @return {object} {hour: number, minute: number}
 */
function findTime(str) {
  // (\d{1,2})   - Captures 1-2 digits for hour
  // (?:點|\.)   - Literal indicators for dot
  const hourPattern = /(\d{1,2})(?:點|\.)/;
  const matched = str.match(hourPattern);
  const isEvening = DATETIME_KEYWORDS.EVENING.some(eve => str.indexOf(eve) > -1);
  let hour = Number(matched[1]);
  let minute = str.indexOf(IDENTIFIERS.HALFHOUR) > -1 ? 30 : 0;

  if (isEvening && hour < 12) {
    hour += 12;
  }

  return { hour, minute };
}

/*
 * findTimeFromHhMm
 * find time from string that contains hhmm
 * @param {string} str
 * @return {object} {hour: number, minute: number}
 */
function findTimeFromHhMm(str) {
  const pattern = /(\d{4})/;
  const matched = str.match(pattern);

  const hour = Number(matched[0].substring(0, 2));
  const minute = Number(matched[0].substring(2));
  return { hour, minute };
}

/*
 * generateTwoDigitStr
 * generate two-digit string for month, day, hour, or minute
 * @param {number} num
 * @return {string} two-digit string
 */
function generateTwoDigitStr(num) {
  if (num < 10) {
    return `0${num}`
  }
  return `${num}`;
}
