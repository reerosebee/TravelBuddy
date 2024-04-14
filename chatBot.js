const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");


const API_KEY = "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"; // Securely store your API key
const API_URL = "https://api.openai.com/v1/chat/completions";
const initialInputHeight = chatInput.scrollHeight;

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
});

function attachEventListeners() {
  chatInput.addEventListener("input", adjustInputHeight);
  chatInput.addEventListener("keydown", handleEnterKeyPress);
  sendChatBtn.addEventListener("click", handleChat);
  closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
  chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
}

function adjustInputHeight() {
  chatInput.style.height = "auto";
  chatInput.style.height = `${chatInput.scrollHeight}px`;
}

function handleEnterKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
    event.preventDefault();
    handleChat();
  }
}

async function handleChat() {
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatInput.style.height = `${initialInputHeight}px`;
  chatbox.appendChild(createChatElement(userMessage, "outgoing"));

  // Simulate typing delay
  const thinkingMessage = createChatElement("Thinking...", "incoming");
  chatbox.appendChild(thinkingMessage);
  scrollToBottom();

  try {
    const response = await fetchChatbotResponse(userMessage);
    thinkingMessage.remove(); // Remove "Thinking..." message
    chatbox.appendChild(createChatElement(response, "incoming"));
  } catch (error) {
    console.error('Fetch error:', error);
    chatbox.appendChild(createChatElement("Error: Could not fetch response", "error"));
  }
  scrollToBottom();
}

function createChatElement(message, className) {
  const chatLi = document.createElement("li");
  chatLi.className = `chat ${className}`;
  chatLi.innerHTML = `<p>${message}</p>`;
  return chatLi;
}

async function fetchChatbotResponse(message) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    })
  };

  const response = await fetch(API_URL, requestOptions);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content.trim();
}

function scrollToBottom() {
  chatbox.scrollTop = chatbox.scrollHeight;
}
