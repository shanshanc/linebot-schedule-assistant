function getUsername(eventType, data) {
    const { userId, groupId } = data;
    let username = '';

    switch (eventType) {
        case "user":
            nameurl = "https://api.line.me/v2/bot/profile/" + userId;
            break;
        case "group":
            nameurl = "https://api.line.me/v2/bot/group/" + groupId + "/member/" + userId;
            break;
    }

    try {
        //  get username from Line User Info API
        const accessToken = PropertiesService.getScriptProperties().getProperties()[CHANNEL_ACCESS_TOKEN];
        const response = UrlFetchApp.fetch(nameurl, {
            "method": "GET",
            "headers": {
                "Authorization": "Bearer " + String(accessToken),
                "Content-Type": "application/json"
            },
        });
        const namedata = JSON.parse(response);
        username = namedata.displayName;
    }
    catch {
        username = '';
    }
    return String(username)
}

function sendToLine(token, message) {
  const accessToken = PropertiesService.getScriptProperties().getProperties()[CHANNEL_ACCESS_TOKEN];
  const url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + String(accessToken),
      },
      'method': 'post',
      'payload': JSON.stringify({
          'replyToken': token,
          'messages': message
      }),
  });
}
