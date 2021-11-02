const checkbox = document.getElementById('checkbox')

chrome.storage.sync.get('checked', ({ checked }) => {
    checkbox.checked = checked
})

checkbox.addEventListener('change', () => {
    // console.log('checked', checkbox.checked)

    // // send message to update the checked status
    // chrome.runtime.sendMessage({ message: 'update', checked: checkbox.checked }, () => {
    //     console.log('update message sent')
    // })

    // // send message if checked on to set the timeout and calculate time till monday at 935
    // if (checkbox.checked) {
    //     chrome.runtime.sendMessage({
    //         message: 'monday'
    //     }, () => { console.log('monday message sent') })
    // }
})
