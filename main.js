import './style.css'

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const sidebarContainer = document.getElementById('sidebarContainer');
const botStatusText = document.querySelector('#botStatus .status-text');

let messagesHistory = [];

// Improved markdown to HTML parser for rich, premium lists and text formatting
function parseMarkdown(text) {
  // Replace bold
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Format line lists starting with "-" or "*"
  const lines = html.split('\n');
  let inList = false;
  let parsedLines = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        parsedLines.push('<ul>');
        inList = true;
      }
      // Strip leading bullet point
      const content = trimmed.substring(2);
      parsedLines.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        parsedLines.push('</ul>');
        inList = false;
      }
      parsedLines.push(line);
    }
  }
  
  if (inList) {
    parsedLines.push('</ul>');
  }
  
  // Combine lines with linebreaks, ignoring empty elements that occur directly adjacent to tags
  return parsedLines.join('\n').replace(/\n/g, '<br>');
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}-message`;
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.innerHTML = parseMarkdown(content);
  
  messageDiv.appendChild(bubbleDiv);
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
}

function addTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typingIndicator';
  indicator.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  chatMessages.appendChild(indicator);
  scrollToBottom();
  return indicator;
}

function removeTypingIndicator(indicator) {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

// -----------------------------------------------------------------------------
// ROBOT STATE CONTROL
// -----------------------------------------------------------------------------
function setRobotState(state) {
  if (state === 'thinking') {
    sidebarContainer.classList.add('is-thinking');
    if (botStatusText) botStatusText.textContent = 'Thinking...';
  } else {
    sidebarContainer.classList.remove('is-thinking');
    if (botStatusText) botStatusText.textContent = 'Online';
  }
}

// -----------------------------------------------------------------------------
// CHAT FORM SUBMIT TRIGGER
// -----------------------------------------------------------------------------
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const content = messageInput.value.trim();
  if (!content) return;
  
  // Disable input while processing
  messageInput.value = '';
  messageInput.disabled = true;
  sendButton.disabled = true;
  
  // Display user message
  appendMessage('user', content);
  messagesHistory.push({ role: 'user', content });
  
  // Show typing indicator and set robot visual state to thinking
  const typingIndicator = addTypingIndicator();
  setRobotState('thinking');
  
  const API_URL = import.meta.env.DEV ? 'http://localhost:8000' : '';
  
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: messagesHistory })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const botReply = data.reply;
    
    removeTypingIndicator(typingIndicator);
    appendMessage('assistant', botReply);
    messagesHistory.push({ role: 'assistant', content: botReply });
    
  } catch (error) {
    console.error('Error:', error);
    removeTypingIndicator(typingIndicator);
    appendMessage('system', 'Sorry, I encountered an error. Please try again.');
    // Pop the user message so they can try again if they want
    messagesHistory.pop();
  } finally {
    // Restore robot visual state to idle/online and re-enable input
    setRobotState('idle');
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
  }
});

// -----------------------------------------------------------------------------
// WELLNESS TOPICS / CHIPS INTERACTION
// -----------------------------------------------------------------------------
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const question = chip.getAttribute('data-question');
    if (question && !messageInput.disabled) {
      messageInput.value = question;
      chatForm.dispatchEvent(new Event('submit'));
      
      // On mobile viewports, auto-collapse sidebar drawer after selecting a topic
      if (sidebarContainer.classList.contains('active')) {
        sidebarContainer.classList.remove('active');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
          overlay.classList.remove('active');
        }
      }
    }
  });
});

// -----------------------------------------------------------------------------
// MOBILE DRAWER NAVIGATION INTERACTION
// -----------------------------------------------------------------------------
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const appContainer = document.querySelector('.app-container');

if (mobileMenuBtn && appContainer) {
  // Create off-canvas backdrop overlay element dynamically
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  appContainer.appendChild(overlay);

  mobileMenuBtn.addEventListener('click', () => {
    sidebarContainer.classList.add('active');
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', () => {
    sidebarContainer.classList.remove('active');
    overlay.classList.remove('active');
  });
}
