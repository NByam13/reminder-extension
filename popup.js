const checkbox = document.getElementById('repeat-chkbx')
const dateIn = document.getElementById('date-input')
const timeIn = document.getElementById('time-input')
const setBtn = document.getElementById('set-rmndr-btn')

chrome.storage.sync.get('checked', ({ checked }) => {
    checkbox.checked = checked
})

// look for blur event because it's the only way to know when the user has finished selecting the date
dateIn.addEventListener('blur', (event) => {
    const date = event.target.value
    console.log(date)
    chrome.storage.sync.set({ date }, () => {
        console.log('date saved')
    })
})

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
            console.log('Response Received', response)
        })
    })
})