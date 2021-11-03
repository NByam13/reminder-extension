// on install of the extension, check to see if checked has been set
// if it has then do nothing, other wise set it to false
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('repeat', (data) => {
        if (typeof data.checked === 'undefined') {
            chrome.storage.sync.set({ checked: false })
        }
    })
})

// add a listener for browser messages coming from popup.js
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    let success = false

    // grab the date and time from the request
    const { date, time } = request

    // create a new date object from the date and time
    const dtString = `${date} ${time}`
    const reminderDate = new Date(dtString)
    const when = reminderDate.getTime()


    // make sure the time is after the current time
    if (when > Date.now()) {
        // create alarmInfo config object
        const alarmInfo = { when: when }

        // set a new alarm for the date object
        chrome.alarms.create('reminder', alarmInfo)
        success = true
    }

    // send a response to the popup.js that the alarm has been set
    sendResponse({ success })
})

// create a listener for alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    // send a message to popup.js that the alarm went off
    chrome.runtime.sendMessage({ data: 'alarm' }, (response) => {
        console.log('alarm status:' + response.success)

        // check if repeat is clicked or not and set the alarm accordingly
        chrome.storage.sync.get('repeat', ({ repeat }) => {
            if (repeat) {
                const reminderDate = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)) // timezone problem because daylight savings time sucks
                const when = reminderDate.getTime()
                chrome.alarms.create('reminder', { when: when })
            }
        })
    })
})

