chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'randomID',
    contexts: ['selection'],
    title: 'save note ฅ^•ﻌ•^ฅ',
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

//hashmap : key가 다르게 key&value 묶어서 
//new object for date, address




/*const abc = {
  date: new Date(),
  address: window.location.href
};

info에 date, address, 
    saveNote --> info
    object로 처리해서 같은  url이면 한번만 뜨게 


*/

chrome.browserAction.onClicked.addListener(tab => {
  console.log('@ page action clicked');
  console.log(tab);
  chrome.tabs.create({
    url: 'notepage.html'
  }, () => {
    console.log('tab created');
  });
});

function saveNote(note) {
  chrome.identity.getProfileUserInfo(userInfo => {
    const email = userInfo.email;
    const storageKey = email + ':notebuddy';
    chrome.storage.local.get(storageKey, result => {
      const storedNote = result[storageKey];
      let updatedNote;
      if (storedNote) {
        updatedNote = storedNote + '\n\n' + note;
       
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
