
/*
 * createStudentIdMap
 * create student id map to save user display name and file url for later usage
 * return {object}
 */
function createStudentIdMap() {
  const studentFiles = getStudentFiles();
  const studentMap = {};
  
  while (studentFiles.hasNext()) {
    const file = studentFiles.next();
    const fileUrl = file.getUrl();
    const filename = file.getName();
    const fields = filename.split("_")

    if (fields.length !== 3) {
      continue;
    }

    const studentId = fields[0];
    const displayName = fields[2];

    if (!studentMap[studentId]) {
      studentMap[studentId] = {
        displayName: displayName,
        url: fileUrl
      }
    }

    return studentMap;
  }
}

function addRecord(list, name) {
  const studentMap = createStudentIdMap();
  const url = findStudentFileUrl(name, studentMap);

  if (!url) {
    return createErrorResponse();
  }
  const recordSheet = getTargetSheet(url, STUDENT.SHEET_NAME);
  
  const results = list.map((item) => {
    const { courseKey } = item.details;
    const reservationData = { courseKey, quantity: 1 };
    const isUpdated = addToRecord(reservationData, recordSheet);
    if (isUpdated) {
      return createUserActionResponse(CODE.SUCCESS_RESERVE, { courseKey });
    }

    return createErrorResponse();
  })

  return results;
}

function removeRecord(list, name) {
  const studentMap = createStudentIdMap();
  const url = findStudentFileUrl(name, studentMap);
  
  if (!url) {
    return createErrorResponse();
  }
  const recordSheet = getTargetSheet(url, STUDENT.SHEET_NAME);

  const results = list.map((item) => {
    const { courseKey } = item.details;
    const cancelData = { courseKey, quantity: 1 }
    const isUpdated = removeFromRecord(cancelData, recordSheet);
    if (isUpdated) {
      return createUserActionResponse(CODE.SUCCESS_RESERVE, { courseKey });
    }

    return createErrorResponse();
  })

  return results;
}

/*
 * getStudentFiles
 * get all student files in the user folder.
 * The value of USER_FOLDER_ID is stored in script properties
 * @return {object} studentFiles - Google Drive file iterator
 */
function getStudentFiles() {
  const folderId = PropertiesService.getScriptProperties().getProperties()['USER_FOLDER_ID'];
  const studentFolder = DriveApp.getFolderById(folderId);
  const studentFiles = studentFolder.getFiles();
  return studentFiles;
}

/*
 * findStudentFileUrl
 * find student file url by display name
 * @param {string} displayName - student Line display name
 * @return {string} url - student file url
 */
function findStudentFileUrl(displayName, studentMap) {
  const keys = Object.keys(studentMap);
  let matched = null;

  keys.forEach((key) => {
    const file = studentMap[key];
    if (file.displayName === displayName) {
      matched = file;
    }
  });

  return matched.url;
}

/*
 * addToRecord
 * add reservation to student file in Google Sheet
 * @param {object} data. courseKey: string and quantity: number
 * @param {object} studentSheet - Google Sheet object
 * @return {boolean} true if the courseKey from updated sheet is the same as input courseKey; otherwise, false
 */
function addToRecord(data, studentSheet) {
  const { courseKey, quantity } = data;
  let targetRow = findTargetRowNum(courseKey, studentSheet);

  if (!targetRow) {
    // add a new record if no existing one
    targetRow = studentSheet.getLastRow() + 1;

    studentSheet.getRange(targetRow, STUDENT.RECORD_COURSEKEY_COL).setValue(courseKey);
    studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).setValue(quantity);
  } else {
    // update existing record
    const currentQuantity = studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).getValue();
    studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).setValue(currentQuantity + quantity);
  }

  // get row data for verification
  const updatedData = studentSheet.getRange(targetRow, 1).getValue();
  return updatedData === courseKey;
}

/*
 * removeFromRecord
 * remove reservation from student file in Google Sheet
 * @param {object} data. courseKey: string and quantity: number
 * @param {object} studentSheet - Google Sheet object
 * @return {boolean} true reservation is removed; otherwise, false
 */
function removeFromRecord(data, studentSheet) {
  const { courseKey, quantity } = data;
  let targetRow = findTargetRowNum(courseKey, studentSheet);

  if (!targetRow) {
    return null;
  }

  const currentQuantity = studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).getValue();
  const updatedQuantity = currentQuantity - quantity;
  
  if (updatedQuantity > 0) {
    studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).setValue(updatedQuantity);
    const res = studentSheet.getRange(targetRow, STUDENT.RECORD_QUANTITY_COL).getValue();
    return res === updatedQuantity;
  } else {
    studentSheet.deleteRow(targetRow);
    return targetRow > studentSheet.getLastRow();
  }
}

/*
 * findTargetRowNum
 * find target row number in student file by courseKey
 * @param {string} target - courseKey
 * @param {object} studentSheet - Google Sheet object
 * @return {number} row number; otherwise, null
 */
function findTargetRowNum(target, studentSheet) {
  const lastRowNum = studentSheet.getLastRow();
  const rows = studentSheet.getRange(STUDENT.ROW_OFFSET, 1, lastRowNum - STUDENT.ROW_OFFSET + 1, 1).getValues();

  for (let i = 0; i < rows.length; i++) {
    const recordKey = rows[i][0];

    if (recordKey === target) {
      return i + STUDENT.ROW_OFFSET;
    }
  }

  return null;
}
