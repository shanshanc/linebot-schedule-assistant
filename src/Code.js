/*
 * Inspired and modifed based on https://github.com/jschang19/plusone-linebot (加一 LINE 紀錄機器人)
 * Description : Listen and handle received messsages in Line chat in order to add or cancel Yoga class reservation in Google Sheets
 */

function doPost(e) {
    // initizlize env variables (sheet name, cell position, etc)
    initConfig();

    // parse Line Message API post content
    const msg = JSON.parse(e.postData.contents);

    // debugging
    Logger.log('msg: ', msg);

    /* 
    * LINE Message API
    * message-event
    * https://developers.line.biz/en/reference/messaging-api/#message-event
    * replyToken : one-time token used to send reply message to this event
    * userId     : id of the source used to look for line username (display name)
    * userMessage: content of the message
    * eventType  : source type: user or group chat
    */
    const replyToken = msg.events[0].replyToken;
    const userId = msg.events[0].source.userId;
    const groupId = msg.events[0].source.groupId;
    const userMessage = msg.events[0].message.text;
    const eventType = msg.events[0].source.type;

    let username = '';
    let scheduleResult = null;
    let userResult = null;

    if (!userId || !userMessage || !eventType || !replyToken) {
      return;
    }
    
    // user id and display name
    username = getUsername(eventType, {
      userId: userId,
      groupId: groupId
    });

    const action = composeActionObj(userMessage, username);

    if (!action) {
      return;
    }

    // update course schedule and student file
    if (action.type === ACTION.ADD) {
      scheduleResult = makeReservation(action);
      if (scheduleResult && scheduleResult.length > 0) {
        userResult = addRecord(scheduleResult, username);
      }
    } else if (action.type === ACTION.CANCEL) {
      scheduleResult = cancelReservation(action);
      if (scheduleResult && scheduleResult.length > 0) {
        userResult = removeRecord(scheduleResult, username);
      }
    }

    Logger.log('scheduleResult: ', scheduleResult, ' userResult: ', userResult);
    // reply reservation results
    replyMessage = getReplyMessage(username, scheduleResult);
    sendToLine(replyToken, replyMessage);
}
