// on install of the extension, check to see if checked has been set
// if it has then do nothing, other wise set it to false
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('checked', (data) => {
        if (typeof data.checked === 'undefined') {
            chrome.storage.sync.set({ checked: false })
        }
    })
})

// adds a listener for a message from the popup script saying its monday.
chrome.runtime.onMessage.addListener((message) => {
    // check for the message that wants to set an alarm




    // if (message.message === 'monday') {
    //     chrome.tabs.query({ active: true }, (tabs) => {
    //         console.log('scripting call', tabs[0].id)
    //         chrome.scripting.executeScript({
    //             target: { tabId: tabs[0].id },
    //             function: meetingReminder,
    //         });
    //     })
    //     console.log('monday!')
    //     return;
    // }

    // if (message.message === 'update') {
    //     chrome.storage.sync.set({ checked: message.checked })
    //     if (!message.checked) {
    //         chrome.alarms.clear('meetingReminder')
    //     }
    // }
})

// const calcTimeTillMonday = () => {
//     const diff = ((7 - (new Date()).getDay()) % 7) + 1
//     let monday = new Date()
//     monday.setDate(monday.getDay + diff).setHours(9, 30, 0, 0)
//     return monday.getTime()
// }

// function meetingReminder() {
//     const diff = ((7 - (new Date()).getDay()) % 7) + 1
//     let monday = new Date()
//     monday = new Date(monday.setDate(monday.getDay + diff)).setHours(9, 30, 0, 0)
//     let temp = monday.getTime()
//     console.log(temp)
//     let msTillMonday = 100000 + (new Date).now()
//     const alarmCreateInfo = { when: msTillMonday }

//     // set a chrome alert for the given timeout
//     chrome.alarms.create('meetingReminder', { ...alarmCreateInfo }, () => {
//         console.log('alarm created')
//     })
// }

