chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'randomID',
    contexts: ['selection'],
    title: 'save note ฅ^•ﻌ•^ฅ',
  });
});

chrome.contextMenus.onClicked.addListener(info => {
  const note = info.selectionText;

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     address = tabs[0].url;
    });
  saveNote(note, address);
  
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === 'save-note') {
    chrome.tabs.executeScript({
      code: 'window.getSelection().toString();'
    }, selection => {
      const note = selection[0];
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
           address = tabs[0].url;
        });
      saveNote(note, address);
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

chrome.browserAction.onClicked.addListener(tab => {
  console.log('@ page action clicked');
  console.log(tab);
  chrome.tabs.create({
    url: 'notepage.html'
  }, () => {
    console.log('tab created');
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
          tmp = {
                  text : storedNote + '\n\n' + note,
                  adrs : address,
                  date : new Date()
          }
          updatedNote = tmp.text + '\n\n' + tmp.adrs +'\n\n'+ tmp.date;
        // updatedNote = storedNote + '\n\n' + note + '\n\n' + address;

      } else {
        //updatedNote = note + '\n\n' + address;
        tmp = {
          text : note,
          adrs : address,
          date : new Date()
          }
          updatedNote = tmp.text + '\n\n' + tmp.adrs +'\n\n'+ tmp.date;
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