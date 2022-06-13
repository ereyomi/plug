// @ts-nocheck
const formatDate = (date) => {
  // sometimes even the US needs 24-hour time
  options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };
  // console.log(new Intl.DateTimeFormat('en-US', options).format(date));
  // → "12/19/2012, 19:00:00"

  // to specify options but use the browser's default locale, use 'default'
  return new Intl.DateTimeFormat('default', options).format(new Date(date));
  // → "12/19/2012, 19:00:00"
};
document.addEventListener( 'DOMContentLoaded', () => {
  console.log( 'okau' );
  const socket = io(); // io('ws://localhost:3000');
  let usernameData = JSON.parse(localStorage.getItem('talkie'));
  let username = '';
  let chatData = [];
  let isLoggedinBefore = false;
  if (usernameData) {
    username = usernameData.id;
    chatData = usernameData.chatData || [];
    isLoggedinBefore = true;
  } else {
    isLoggedinBefore = false;
    // check if username exist in url
    const urlSearchParams = new URLSearchParams(window.location.search);
    // const params = Object.fromEntries( urlSearchParams.entries() );
    username = urlSearchParams.get('username');
  }
  if (!username) {
    window.location.assign(window.location.origin);
  }
  // Join chatroom
  socket.emit( 'joinRoom', { username, isLoggedinBefore } );
  
  const ourChatsDiv = document.querySelector('.our-chats');
  // read about arrow functions in Javascript
  const updateUI = () => {
    // clear the dom
    ourChatsDiv.innerHTML = '';
    chatData.forEach((data) => {
      // creat the div with class
      const chatDiv = document.createElement('div');
      // i added classs here
      chatDiv.setAttribute(
        'class',
        `chat ${
          data.id === 'bot' ? 'join' : data.isSender ? 'sender' : 'receiver'
        }`
      );
      chatDiv.innerHTML = `
         <div>
            <p>
                ${data?.text}
            </p>
           ${
             data.id === 'bot'
               ? ''
               : !data.isSender
               ? ` <p class="sender-time-div">
               @${data.id} ${data?.time}
            </p>`
               : ''
           }
        </div>
      `;
      ourChatsDiv?.appendChild(chatDiv);
      // Scroll down
      ourChatsDiv.scrollTop = ourChatsDiv.scrollHeight;
    });
  };

  const textInput = document.querySelector('#text-input');
  const sendBtn = document.querySelector('.send-btn');
  sendBtn?.addEventListener('click', () => {
    const text = textInput?.value;
    if (text) {
      socket.emit('message', {
        id: username.toLowerCase(),
        text: text,
      });
      textInput.value = '';
    }
  });
  socket.on('message', (data) => {
    console.log('push', data);
    chatData.push({
      ...data,
      time: formatDate(data?.time || new Date()),
      isSender: data?.id === username,
    });
    localStorage.setItem(
      'talkie',
      JSON.stringify({
        id: username,
        chatData: chatData.filter(
          (v) => v.id !== 'bot' || v.id !== 'welcome-back-bot'
        ),
      })
    );
    updateUI();
  });
  document.querySelector('#logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('talkie');
    window.location.assign(window.location.origin);
  });
});
