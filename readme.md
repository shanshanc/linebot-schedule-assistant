The purpose of this project is to help my Yoga class instructor to manage bi-weekly schedule on Google Sheet.

This LINE Bot utilizes Line Message API and Google App Script. It reads user message in a group chat, interprete user's actions by rules, and update Google Sheets (course schedule and user files).

![image](https://github.com/shanshanc/linebot-schedule-assistant/blob/a504a36d03d709484e07b2fca8da4b867bf00072/assets/images/lineGroupChat.jpg)

Ideally, LINE Bot will be able to take over the workflow shown above and handle course scheduling. A flowchart below illustrates what this project does on the high level.

```mermaid
flowchart TD
    A[Receive User Message] --> B{Contains Add/Cancel?}
    B -->|No| C[Ignore Message]
    B -->|Yes| D[Extract Action]
    D --> E[Extract Course Key]
    E --> F[Compose Target Key<br/>yyyy-mm-dd_hhmm_courseName]
    
    F --> G{Action Type?}
    G -->|Add| H[Add to Schedule Sheet]
    G -->|Cancel| I[Remove from Schedule Sheet]
    
    H --> J[Update User Sheet]
    I --> J
    
    J --> K[Compose Response Message]
    K --> L[Reply to User]
    
    style C fill:#FFE6E6
    style H fill:#E6FFE6
    style I fill:#FFE6E6
    style L fill:#E6F3FF
```

A screenshot of this project (seal is the bot):
![image](https://github.com/shanshanc/linebot-schedule-assistant/blob/master/assets/images/example.jpg)

In additional to the project codebase, a LINE Access Token, Google Sheet ([example](https://docs.google.com/spreadsheets/d/1ttMUhEpUvvrrrxgq1MsoADe6zaalyjrVj12pB4JJaFU/edit?usp=sharing)) and a Google Drive folder ([example](https://drive.google.com/drive/folders/1UDs6RcVO7lEZiphgDU4saItggqoG-w47?usp=sharing)) that contains user files are needed. They are defined as, `CHANNEL_ACCESS_TOKEN`, `SCHEDULE_URL` and `USER_FOLDER_ID`, respectively, in Google App Script script properties or the local `.env` file.

![image](https://github.com/shanshanc/linebot-schedule-assistant/blob/master/assets/images/gasScriptProp.png)


## Development & Testing

Tests are done in local Node.js environment with the help of [clasp](https://developers.google.com/apps-script/guides/clasp) and [gas-local](https://www.npmjs.com/package/gas-local) library.

Logs are sent to Google Cloud Platform. Set it in App Script project setttings -> Google Cloud Platform
![image](https://github.com/shanshanc/linebot-schedule-assistant/blob/master/assets/images/settings_gcp.png)
