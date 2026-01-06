  const input = document.getElementById('userInput');

function sendMessage() {

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  fetch('http://localhost:8000/api/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    addMessage(data.reply, 'bot');
  })
  .catch(err => console.error(err));
}

function addMessage(text, sender) {
  const messages = document.getElementById('messages');
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
