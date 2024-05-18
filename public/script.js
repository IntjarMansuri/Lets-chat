const socket = io();

document.querySelectorAll("#container")[1].style.display = "none";

const inputBox = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");

sendButton.addEventListener("click", sendMessage);
document
  .getElementById("messageInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value.trim();

  if (messageText) {
    socket.emit("send-msg", { msg: messageText });
    messageInput.value = "";
  }
}

socket.on("received-msg", (data) => {
  const chatMessages = document.getElementById("chatMessages");

  const newMessage = document.createElement("div");
  newMessage.classList.add("flex", "flex-col", "mb-2");

  const messageContent = document.createElement("div");
  messageContent.classList.add("p-2", "rounded-lg", "mt-1", "max-w-xs");

  if (data.id === socket.id) {
    // If the message is yours
    messageContent.classList.add("self-end", "bg-green-200", "text-gray-800");
    messageContent.textContent = data.msg;

    newMessage.appendChild(messageContent);
  } else {
    // If the message is from others
    messageContent.classList.add("self-start", "bg-blue-300", "text-gray-800");
    messageContent.textContent = data.msg;

    const senderName = document.createElement("span");
    senderName.classList.add("self-start", "text-sm", "text-gray-600", "mt-1");
    senderName.textContent = data.username;

    newMessage.appendChild(messageContent);
    newMessage.appendChild(senderName);
  }

  chatMessages.appendChild(newMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

const loginName = document.querySelector("#username");
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = loginName.value;
  loginName.value = "";

  if (username === "") {
    return;
  }

  const chatUsername = document.getElementById("usernameDisplay");
  chatUsername.textContent = username;

  socket.emit("login", { username });

  document.querySelectorAll("#container")[0].style.display = "none";
  document.querySelectorAll("#container")[1].style.display = "block";
});
