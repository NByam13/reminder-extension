// on install of the extension, check to see if checked has been set
// if it has then do nothing, other wise set it to false
chrome.runtime.onInstalled.addListener(() => {
    // on install, check to see if there is any existing data which is not needed
    chrome.storage.sync.get(['date', 'time', 'repeat', 'msg'], ({ date, time, repeat, msg }) => {
        if (date || time || repeat || msg) {
            // remove storage keys if they exist
            chrome.storage.sync.remove(['date', 'time', 'repeat', 'msg']);
        }

        // reset storage keys to defaults
        chrome.storage.sync.set({ date: '' })
        chrome.storage.sync.set({ time: '' })
        chrome.storage.sync.set({ repeat: false })
        chrome.storage.sync.set({ msg: '' })
    })
})

// add a listener for browser messages coming from popup.js
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    let success = false

    // grab the date and time from the request
    const { date, time } = request

    // create a new date object from the date and time
    const reminderDate = new Date(`${date} ${time}`)
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
chrome.alarms.onAlarm.addListener(() => {
    let status = 'You set a reminder for this time!'

    chrome.storage.sync.get(['msg'], ({ msg }) => {
        if (msg.length > 0) {
            status = msg
        }

        chrome.notifications.create(`reminder-${Date.now()}`,
            {
                title: 'Reminder!',
                message: status,
                priority: 2,
                type: 'basic',
                iconUrl: "/images/get_started48.png"
            }, () => {
                console.log('notification created')
            })
    })

    // check if repeat is clicked or not and set the alarm accordingly
    chrome.storage.sync.get(['repeat'], ({ repeat }) => {
        console.log('repeat: ' + repeat)

        if (repeat) {
            // re-set the alarm for a time period of 1 minute, TODO: make repeat time configurable
            const reminderDate = new Date(Date.now() + (60 * 1000)) // adding 1m for testing's sake 
            const when = reminderDate.getTime()
            let repeatMsg = `A reminder was created for ${reminderDate} with message: ${status}`
            chrome.alarms.create('reminder', { when: when })
            chrome.notifications.create(`repeat-reminder-${Date.now()}`,
                {
                    title: 'Reminder Created',
                    message: repeatMsg,
                    priority: 2,
                    type: 'basic',
                    iconUrl: "/images/get_started48.png"
                }, () => {
                    console.log('notification created')
                })
        }
    })
})


