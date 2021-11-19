const checkbox = document.getElementById("repeat-chkbx");
const dateIn = document.getElementById("date-input");
const timeIn = document.getElementById("time-input");
const setBtn = document.getElementById("set-rmndr-btn");
const msgBox = document.getElementById("msg-box");

window.onload = function () {
  updateAlarmList();
};

const updateAlarmList = () => {
  chrome.alarms.getAll((alarms) => {
    let alarmList = "<ul>";
    alarms
      .sort((first, second) => first.scheduledTime - second.scheduledTime)
      .forEach((element) => {
        alarmList += `<li>${new Date(
          element.scheduledTime
        ).toLocaleString()}</li>`;
      });
    alarmList += "</ul>";

    document.getElementById("alarm-list").innerHTML = alarmList;
  });
};

// grab the stored value for repeat, let the other values reset when popup is closed
chrome.storage.sync.get(["repeat"], ({ repeat }) => {
  checkbox.checked = repeat;
});

// look for blur event because it's the only way to know when the user has finished selecting the date
dateIn.addEventListener("blur", (event) => {
  const date = event.target.value;
  chrome.storage.sync.set({ date }, () => {
    console.log("date saved");
  });
});

// look for blur event because it's the only way to know when the user has finished selecting the time
timeIn.addEventListener("blur", (event) => {
  const time = event.target.value;
  chrome.storage.sync.set({ time }, () => {
    console.log("time saved");
  });
});

checkbox.addEventListener("change", (event) => {
  const repeat = event.target.checked;
  chrome.storage.sync.set({ repeat }, () => {
    console.log("repeat saved");
  });
});

// listen for blur event so we know when text area loses focus
msgBox.addEventListener("blur", (event) => {
  const msg = event.target.value;
  chrome.storage.sync.set({ msg }, () => {
    console.log("msg saved");
  });
});

setBtn.addEventListener("click", () => {
  // make sure the user has selected a date and time first

  if (!dateIn.value || !timeIn.value) {
    chrome.notifications.create(
      `reminder-failed-${Date.now()}`,
      {
        title: "Reminder Failed",
        message: "Please enter a date and time first to set a reminder",
        priority: 2,
        type: "basic",
        iconUrl: "/images/get_started48.png",
      },
      () => {
        console.log("notification failed");
      }
    );
    return false;
  }

  // make sure reminder date and time is in the future
  const date = new Date(`${dateIn.value} ${timeIn.value}`);

  if (date.getTime() < Date.now()) {
    chrome.notifications.create(
      `reminder-failed-${Date.now()}`,
      {
        title: "Reminder Failed",
        message: "I can't remind you in the past... yet.",
        priority: 2,
        type: "basic",
        iconUrl: "/images/get_started48.png",
      },
      () => {
        console.log("notification failed");
      }
    );
    return false;
  }

  // fetch results from storage api
  chrome.storage.sync.get(
    ["date", "time", "repeat", "msg"],
    ({ date, time, repeat, msg }) => {
      //then tell background.js about the new reminder to create, and wait for the response
      chrome.runtime.sendMessage({ date, time, repeat, msg }, ({ success }) => {
        // check the response from background.js and create a notification on the outcome.
        let status = `A reminder has been created for ${date} ${time}`;

        if (msg.length > 0) {
          status += ` with message: ${msg}`;
        }

        chrome.notifications.create(
          `reminder-created-${Date.now()}`,
          {
            title: "Reminder Created",
            message: status,
            priority: 2,
            type: "basic",
            iconUrl: "/images/get_started48.png",
          },
          () => {
            console.log("notification created");
          }
        );
        if (success) {
          updateAlarmList();
        }
      });
    }
  );
});
