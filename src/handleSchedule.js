function getCourseIdMap() {
  const schedule = getScheduleSheet();
  // Google Sheet range is 1-based index; get 3 columns of data starting from the 2nd row
  const data = schedule.getRange(SCHEDULE.START_ROW, SCHEDULE.COURSE_KEY_COL, schedule.getLastRow() - 1, 3).getValues();
  const courseIdMap = {};
  
  for (let i = 0; i < data.length; i++) {
    const key = data[i][0];
    const secondaryKey = data[i][1];
    const tertiaryKey = data[i][2];

    if (!courseIdMap[key]) {
      courseIdMap[key] = {
        rowNum: i + SCHEDULE.ROW_OFFSET,
        secondaryKey: secondaryKey,
        tertiaryKey: tertiaryKey
      }
    }
  }

  return courseIdMap;
}

function getCourseData(courseKey, keyType, courseMap) {
  let matchedCourse = null;

  switch (keyType) {
    case COURSE_KEY_TYPE.PRIMARY:
      matchedCourse = courseMap[courseKey];
      break;
    case COURSE_KEY_TYPE.SECONDARY:
    case COURSE_KEY_TYPE.TERTIARY:
      for (let key in courseMap) {
        if (
          courseMap[key].secondaryKey === courseKey
          || courseMap[key].tertiaryKey === courseKey
        ) {
          matchedCourse = courseMap[key];
          break;
        }
      }
      break;
    default:
      break;
  }

  if (!matchedCourse) {
    return null;
  }

  const schedule = getScheduleSheet();
  const reservations = schedule.getRange(matchedCourse.rowNum, SCHEDULE.RESERVED_LIST_COL).getValue();
  const waiting = schedule.getRange(matchedCourse.rowNum, SCHEDULE.WAITING_LIST_COL).getValue();
  const capacity = schedule.getRange(matchedCourse.rowNum, SCHEDULE.CAPACITY_COL).getValue();

  const reservedList = strToArr(reservations);
  const waitingList = strToArr(waiting);
  
  return {
    reservedList: reservedList,
    waitingList: waitingList,
    capacity: capacity,
    rowNum: matchedCourse.rowNum
  }
}

function makeReservation(action) {
  const { reserveName, courseKeys } = action;
  const courseMap = getCourseIdMap();

  const results = courseKeys.reduce((acc, item) => {
    const { courseKey, keyType, quantity } = item;

    for (let i = 0; i < quantity; i++) {
      const { reservedList, waitingList, capacity, rowNum } = getCourseData(courseKey, keyType, courseMap);

      const isAvailable = reservedList.length < capacity;
      const targetColumn = isAvailable ? SCHEDULE.RESERVED_LIST_COL : SCHEDULE.WAITING_LIST_COL;
      const targetList = isAvailable ? reservedList : waitingList;
      const successCode = isAvailable ? CODE.SUCCESS_RESERVE : CODE.SUCCESS_WAIT;

      const content = addToList(reserveName, targetList);
      const res = updateScheduleSheet({ content, rowNum, colNum: targetColumn });

      let idx = null,
          code = CODE.ERROR;

      if (res === content) {
        idx = strToArr(res).length;
        code = successCode;
      }

      const details = {
        idx: idx,
        courseKey: courseKey
      }

      const itemResponse = createScheduleActionResponse(code, details);
      acc.push(itemResponse);
    }

    return acc;
  }, []);

  return results;
}

function strToArr(str) {
  if (str === '') {
    return []
  }
  return str.split(',').map(item => item.trim());
}

function cancelReservation(action) {
  const { reserveName, courseKeys } = action;
  const courseMap = getCourseIdMap();

  const results = courseKeys.map(item => {
    const { courseKey, keyType } = item;
    const { reservedList, waitingList, rowNum } = getCourseData(courseKey, keyType, courseMap);

    const inReserveList = reservedList.findLastIndex(ele => ele === reserveName) > -1;
    const inWaitingList = waitingList.findLastIndex(ele => ele === reserveName) > -1;

    if (!inReserveList && !inWaitingList) {
      return createErrorResponse();
    }

    const targetColumn = inWaitingList ? SCHEDULE.WAITING_LIST_COL : SCHEDULE.RESERVED_LIST_COL;
    const targetList = inWaitingList ? waitingList : reservedList;

    const content = removeFromList(reserveName, targetList);
    const res = updateScheduleSheet({ content, rowNum, colNum: targetColumn });
    let code = CODE.ERROR;

    if (res === content) {
      code = CODE.SUCCESS_CANCEL;
    }

    const details = {
      courseKey: courseKey
    }
  
    return createScheduleActionResponse(code, details);
  });

  return results;
}

/*
 * addToList
 * @param {string} name
 * @param {array} list
 * @return {string} joined string
 */
function addToList(name, list) {
  const arr = [...list];
  arr.push(name);
  return arr.join(',');
}

/*
 * removeFromList
 * Remove name from the list in reversed order
 * @param {string} name
 * @param {array} list
 * @return {string} filtered string
 */
function removeFromList(name, list) {
  const arr = [...list];
  const targetIdx = arr.findLastIndex(ele => ele === name);
  return arr.filter((name, idx) => idx !== targetIdx).join(',')
}

/*
 * updateScheduleSheet
 * @param {string} content
 * @param {number} rowNum
 * @param {number} colNum
 * @return {string} updated string results from schedule sheet
 */
function updateScheduleSheet({ content, rowNum, colNum }) {
  if (!content || !rowNum || !colNum) {
    return null;
  }
  const schedule = getScheduleSheet();
  const res = schedule.getRange(rowNum, colNum).setValue(content).getValues()[0][0];
  return res;
}

function getScheduleSheet() {
  const scheduleUrl = PropertiesService.getScriptProperties().getProperties()[SCHEDULE_URL];
  const scheduleSheet = SpreadsheetApp.openByUrl(scheduleUrl);
  const schedule = scheduleSheet.getSheetByName(SCHEDULE.SHEET_NAME);
  return schedule;
}
