chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'randomID',
    contexts: ['selection'],
    title: 'save note ฅ^•ﻌ•^ฅ',
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  const note = info.selectionText;
  const address = window.location.href;
  saveNote(note, address);
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'save-note') {
    chrome.tabs.executeScript({
      code: 'window.getSelection().toString();'
    }, selection => {
      const note = selection[0];
      saveNote(note);
    });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.notifications.getAll(notifications => {
    for (let id in notifications) {
      chrome.notifications.clear(id);
    }
  });
});


function saveNote(note, address) {
  chrome.identity.getProfileUserInfo(userInfo => {
    const email = userInfo.email;
    const storageKey = email + ':notebuddy';
    chrome.storage.local.get(storageKey, result => {
      const storedNote = result[storageKey];
      let updatedNote;
      if (storedNote) {
        updatedNote = storedNote + '\n\n' + note + '\n\n' + address;
        //hashmap & object to pull out info again
      } else {
        updatedNote = note + '\n\n' + address;
      }
      chrome.storage.local.set({ [storageKey]: updatedNote }, () => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: './images/389cd119.png',
          title: 'Note Buddy',
          message: 'Successfully saved note ✿',
        }, () => {
          console.log('@ successfully stored note @@@');
          console.log(updatedNote);
          const notificationDuration = 1400;
          chrome.alarms.create(
            'notificationClearAlarm',
            { when: Date.now() + notificationDuration }
          );
        });
      });
    });
  });
}
