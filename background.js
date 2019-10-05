chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'randomID',
    contexts: ['selection'],
    title: 'asdfasdfasdf',
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  const note = info.selectionText;
  saveNote(note);
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'save-note') {
    chrome.tabs.executeScript({
      code: 'window.getSelection().toString();'
    }, selection => {
      const note = selection[0];
      console.log('test print!@####@');
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

function saveNote(note) {
  chrome.identity.getProfileUserInfo(userInfo => {
    const email = userInfo.email;
    const storageKey = email + ':notebuddy';
    chrome.storage.local.get([storageKey], result => {
      let updatedNote;
      if (result.storageKey) {
        updatedNote = result.storageKey + '\n' + note;
      } else {
        updatedNote = note;
      }
      chrome.storage.local.set({ [storageKey]: updatedNote }, () => {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: './images/389cd119.png',
          title: 'Note Buddy',
          message: 'Successfully saved note ✿',
        }, () => {
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
