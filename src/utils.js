/*
 * findMatchedValue
 * check if input string contains value in the list
 * @param {string} str
 * @param {array} list - array of string values
 * @return {string} matched string value in list; otherwise, null
 */
function findMatchedValue(str, list) {
  const targetIdx = list.findIndex((item) => str.indexOf(item) > -1);
  const matchedValue = targetIdx > -1 ? list[targetIdx] : null;
  return matchedValue;
}

/*
 * getTargetSheet
 * get target Google Sheet by url and sheet name
 * @param {string} url
 * @param {string} sheetName
 * @return {object} Google Sheet object
 */
function getTargetSheet(url, sheetName) {
  const sheetFile = SpreadsheetApp.openByUrl(url);
  const sheet = sheetFile.getSheetByName(sheetName);
  return sheet;
}
