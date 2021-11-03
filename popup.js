const checkbox = document.getElementById('repeat-chkbx')
const dateIn = document.getElementById('date-input')
const timeIn = document.getElementById('time-input')
const setBtn = document.getElementById('set-rmndr-btn')

chrome.storage.sync.get('repeat', ({ repeat }) => {
    checkbox.checked = repeat
})

// a listener for the messages from background.js that the alarm went off
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message received', sender)
    let success = false;
    if (message.data === 'alarm') {
        // TODO: make message configurable
        alert('You set a reminder for this time!')
        success = true;
    }
    sendResponse({ success })
})

// look for blur event because it's the only way to know when the user has finished selecting the date
dateIn.addEventListener('blur', (event) => {
    const date = event.target.value
    console.log(date)
    chrome.storage.sync.set({ date }, () => {
        console.log('date saved')
    })
})

// look for blur event because it's the only way to know when the user has finished selecting the time
timeIn.addEventListener('blur', (event) => {
    const time = event.target.value
    console.log(time)
    chrome.storage.sync.set({ time }, () => {
        console.log('time saved')
    })
})

checkbox.addEventListener('change', (event) => {
    const repeat = event.target.checked
    console.log('repeat', repeat)
    chrome.storage.sync.set({ repeat: repeat }, () => {
        console.log('repeat saved')
    })
})

setBtn.addEventListener('click', () => {
    // make sure the user has selected a date and time first
    if (!dateIn.value || !timeIn.value) return false;

    // fetch results from storage api
    chrome.storage.sync.get(['date', 'time', 'repeat'], ({ date, time, repeat }) => {
        //then tell background.js about the new reminder to create, and wait for the response
        chrome.runtime.sendMessage({ date: date, time: time, repeat: repeat }, (response) => {
            // check the response from background.js and create a notification on the outcome.
            let status = 'Reminder failed to set...'

            if (response.success) {
                status = 'Reminder set successfully!'
            }

            chrome.notifications.create('set-reminder', { title: 'Alarm status', message: status, priority: 2, type: 'basic', iconUrl: "/images/get_started128.png" }, () => {
                console.log('Still not seeing this notification pop up anywhere')
            })
        })
    })
})