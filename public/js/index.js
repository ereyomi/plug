// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
  const redirectToChat = (username) => {
    const constructUrl = new URLSearchParams({
      username,
    });
    const href = window.location?.origin;
    const chatUrl = `${href}/chat.html?${constructUrl.toString()}`;
    window.location.assign(chatUrl);
  };
  let usernameData = JSON.parse(localStorage.getItem('talkie'));
  if (usernameData) {
    redirectToChat(usernameData.id);
  }

  const loginBtn = document.querySelector('.login-btn');
  const textInput = document.querySelector('#usernameInput');
  loginBtn?.addEventListener('click', () => {
    const username = textInput?.value;
    if (username) {
      localStorage.setItem(
        'talkie',
        JSON.stringify({
          id: username,
          chatData: null,
        })
      );
      redirectToChat(username);
    } else {
      alert('You can not be empty');
    }
  });
});
