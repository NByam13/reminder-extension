# Reminder Extension

A toy chrome extension that I'm building using [this tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/) as a guide, to understand the fundamentals and capabilities of the chrome browser's many helpful APIs.

It's still a WIP and largely just some code to play around with for my own exploration.

### Nov 3, 2021 Edit

As of now, the extension works as intended, entering a time and date will set an alarm that triggers an alert when the onAlert event handler is tripped. Repeat alarm functionality works as well but for testing purposes, it only creates alarms one minute in the future until the checkbox is unchecked for repeating alarms.

TODO: 
- <s>Move Alert logic to the background script so the reminder will display even when the extension popup is closed</s>
- <s>Allow a message to be added that will be displayed on the alert when the alarm goes off</s>
- Allow the amount of time in between repeating alarms to be configurable (here be dragons)
- <s>Figure out why notifications arent being displayed in the corner of the browser when an alarm is set, despite not seeing any runtime errors</s>
- replace console logs with actual event logging
- Allow for multiple alarms to be set at once
- display list of alarms in a drop down

