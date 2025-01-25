## Getting Started

### Environment
It's easier to develop and test this project in local environment. Node.js (>= v20) is needed.

Fork and clone this repo, then
`npm install`

#### Create App Script Project & Set gas-local
[Create an App Script Project](https://developers.google.com/apps-script/guides/projects#create-and-delete) from UI or using [clasp](https://developers.google.com/apps-script/guides/clasp)

**Find and copy the proejct id**
Open your Google Apps Script project, go to Project settings, and under "IDs", copy the Script ID

![image](/assets/images/projectId.png)

**Set `.clasp.json`**
Set the copied Script ID to the `scriptId` property in `.clasp.json` file in the root foler of the project.

Also, specifiy project path in the `rootDir` property.

Example:
```json
// .clasp.json
{
  "scriptId":"scriptIdxxxxxxx",
  "rootDir":"/Users/username/path/projectname/src/"
}
```

Enter `clasp push` from command line to push to App Script project.

![image](/assets/images/appScriptFiles.png)

Deploy the project and grab web app url
![image](/assets/images/webappUrl.png)

### LINE/Google Service Access and Permissions
We'll be using the following servicesa and set them in App Script Properties.

- LINE Message API token & Webhook
- Course Schedule Sheet URL (Google Sheet)
- Studient Record File in Gogole Folder (Google Folder)

#### LINE Message API Token & Webhook
Log in LINE developer console
https://developers.line.biz/en/

**Channel Access Token**
Channel Access Token can be found in the bottom of the Message API settings.

Create an Official LINE accounta and enable Message API if there is no chnnel in LINE developer console following this [doc](https://developers.line.biz/en/news/2024/09/04/no-longer-possible-to-create-messaging-api-channels-from-console/).

Copy and set it to the CHANNEL_ACCESS_TOKEN field under Script Properties in App Script settings
![image](/assets/images/channelAccessToken.png)

![image](/assets/images/gasScriptProperties.png)

**Webhook**
Enable webhook
![image](/assets/images/webHook.png)

Paste the web app url in webhook and click update
![image](/assets//images/webhookUrl.png)

**Add LINE bot to a group chat**
Invite your LINE bot to a group chat.

#### Google Sheet & Folder

**Course Schedule Sheet**
Copy the [example sheet](https://docs.google.com/spreadsheets/d/1ttMUhEpUvvrrrxgq1MsoADe6zaalyjrVj12pB4JJaFU/edit?usp=sharing) and set the permission to be "Edit for Everyone with Link" so that App Script can edit it ([Share a file in Drive](https://support.google.com/a/users/answer/9310248?hl=en#Drive_share_files)).

Copy the shared link and set it to the SCHEDULE_URL feild under Script Properties in App Script settings.

![image](/assets/images/gasScriptProperties.png)

**Student Record Folder**
Copy teh [example folder](https://drive.google.com/drive/folders/1UDs6RcVO7lEZiphgDU4saItggqoG-w47?usp=sharing) and set the folder permission to be "Edit for Everyone with Link" so that App Script can parse all files in this folder and make necessary changes.

Copy [folder ID](https://ploi.io/documentation/database/where-do-i-get-google-drive-folder-id) and set it to the USER_FOLDER_ID field under Script Properties in App Script settings.

![image](/assets/images/gasScriptProperties.png)

### Logging
This project uses Google Cloud Service for logging. [Create a Cloud Project](https://developers.google.com/workspace/guides/create-project), get its [project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects), and set it to Script Project

![image](https://github.com/shanshanc/linebot-schedule-assistant/blob/master/assets/images/settings_gcp.png)

Use `console.log` where it's needed in App Script and see logs in Cloud Log Explorer
![image](/assets/images/logExplorer.png)

### Testing
`npm run test` to run unit tests in local environment.

### Try It
Type an example string in the group chat where your chat bot is at. It shall respond if the string can be interpreted. If not, check logs to see where it doesn't go as expected.

Example string: "預約1/12 10:00哈達"
