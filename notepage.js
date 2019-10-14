//메모한 내용

//date(계속 업데이트)
//event가 있을 때 
function updateClock() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    console.log(dateTime);

}


//url
//window.location.href

chrome.identity.getProfileUserInfo(userInfo => {
  const email = userInfo.email;
  const storageKey = email + ':notebuddy';
  chrome.storage.local.get(storageKey, result => {
    const storedNote = result[storageKey];
    const noteDiv = document.createElement('div');
    noteDiv.innerHTML = storedNote;
    document.body.appendChild(noteDiv);
    console.log(storedNote);
  });
});

// const noteDiv = document.createElement('div');
// noteDiv.innerHTML = 'hello this is a test';
// console.log('wat');
// document.body.appendChild(noteDiv);