Course admin will update schedule every week or every 2-weeks for students to register for the upcoming courses.

## Schedule Sheet
In the [example_schedule](https://docs.google.com/spreadsheets/d/1ttMUhEpUvvrrrxgq1MsoADe6zaalyjrVj12pB4JJaFU/edit?usp=sharing) Google Sheet, editable columns are from Column C to Column H and the rest is calculated fields for the LINE bot.

## Student Record Folder
The [example folder](https://drive.google.com/drive/folders/1UDs6RcVO7lEZiphgDU4saItggqoG-w47?usp=drive_link) contains all studnet files. Those files are meant to keep track of the scheduled and remaining credits for the courses.

The name of the student record file follows the pattern `studentId_name_displayName`, where studnet id is the primary key. It matches with student's name and is maintained manually.

Display name is LINE display name and used by LINE bot to get LINE id in the codebase. However, it's possible that a student changes display name from time to time. The relation between display name and studnet id is maintained manually.

This project is intended to take over some of the scheduling work while not changing current process too much for course admin and studnets. Therefore user input from LINE group chat and schedule in Google Sheet for now.

## Current process
- New schedule is released every two weeks in Google Sheet.
  - One class at a given time since all classes share the same classroom.
- Students reserve/cancel class via LINE group chat.
  - It's understood that this group chat is only used to schedule class. Random chitchats don't usally happen here.
- Students can schedule multiple classes for self or others (family/friends those share the same billing account).
- Cancellation should be at least one hour prior the scheduled time.
