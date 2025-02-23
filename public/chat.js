class BusinessChatPlugin {
  constructor(config) {
    if (!config.apiKey) {
      console.error('API key is required');
      return;
    }

    this.config = {
      primaryColor: config.primaryColor || '#2563eb',
      businessName: config.businessName || 'Business Chat',
      apiKey: config.apiKey,
      serverUrl: config.serverUrl || 'https://your-backend-url'
    };

    // Generate unique session ID
    this.sessionId = 'session_' + Math.random().toString(36).substring(2);
    this.initialize();
  }

  initialize() {
    // Create and append styles
    const styles = document.createElement('style');
    styles.textContent = `
      .business-chat-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }
      .business-chat-message {
        animation: fadeIn 0.3s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .business-chat-typing {
        display: flex;
        gap: 3px;
        padding: 8px 12px;
        background: #f0f0f0;
        border-radius: 10px;
        width: fit-content;
      }
      .business-chat-typing span {
        width: 5px;
        height: 5px;
        background: #666;
        border-radius: 50%;
        animation: typing 1s infinite ease-in-out;
      }
      .business-chat-typing span:nth-child(2) { animation-delay: 0.2s; }
      .business-chat-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(styles);

    // Create chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.id = 'business-chat-widget';
    chatWidget.className = 'business-chat-widget';
    chatWidget.style.position = 'fixed';
    chatWidget.style.bottom = '20px';
    chatWidget.style.right = '20px';
    chatWidget.style.zIndex = '9999';
    
    // Create chat button
    const chatButton = document.createElement('button');
    chatButton.innerHTML = '💬';
    chatButton.style.width = '60px';
    chatButton.style.height = '60px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.border = 'none';
    chatButton.style.backgroundColor = this.config.primaryColor;
    chatButton.style.color = 'white';
    chatButton.style.fontSize = '24px';
    chatButton.style.cursor = 'pointer';
    chatButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    chatButton.style.transition = 'transform 0.2s ease';

    // Hover effect
    chatButton.onmouseover = () => chatButton.style.transform = 'scale(1.1)';
    chatButton.onmouseout = () => chatButton.style.transform = 'scale(1)';

    // Create chat container
    const chatContainer = document.createElement('div');
    chatContainer.style.display = 'none';
    chatContainer.style.position = 'absolute';
    chatContainer.style.bottom = '80px';
    chatContainer.style.right = '0';
    chatContainer.style.width = '350px';
    chatContainer.style.height = '500px';
    chatContainer.style.backgroundColor = 'white';
    chatContainer.style.borderRadius = '12px';
    chatContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    chatContainer.style.transition = 'all 0.3s ease';
    chatContainer.style.opacity = '0';
    chatContainer.style.transform = 'translateY(20px)';
    
    // Chat header
    const header = document.createElement('div');
    header.style.padding = '15px 20px';
    header.style.backgroundColor = this.config.primaryColor;
    header.style.color = 'white';
    header.style.borderTopLeftRadius = '12px';
    header.style.borderTopRightRadius = '12px';
    header.style.fontWeight = 'bold';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const headerTitle = document.createElement('div');
    headerTitle.textContent = this.config.businessName;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.style.padding = '0';

    header.appendChild(headerTitle);
    header.appendChild(closeButton);

    // Chat messages container
    const messagesContainer = document.createElement('div');
    messagesContainer.style.height = '380px';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.padding = '15px';
    messagesContainer.style.scrollBehavior = 'smooth';

    // Welcome message
    this.addMessage(messagesContainer, `Hi! 👋 How can I help you today?`, 'ai');

    // Chat input
    const inputContainer = document.createElement('div');
    inputContainer.style.padding = '15px';
    inputContainer.style.borderTop = '1px solid #eee';
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your message...';
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.border = '1px solid #ddd';
    input.style.borderRadius = '20px';
    input.style.outline = 'none';
    input.style.transition = 'border-color 0.3s ease';

    const sendButton = document.createElement('button');
    sendButton.innerHTML = '➤';
    sendButton.style.background = this.config.primaryColor;
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '50%';
    sendButton.style.width = '35px';
    sendButton.style.height = '35px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.transition = 'transform 0.2s ease';

    // Append elements
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(header);
    chatContainer.appendChild(messagesContainer);
    chatContainer.appendChild(inputContainer);
    chatWidget.appendChild(chatButton);
    chatWidget.appendChild(chatContainer);
    document.body.appendChild(chatWidget);

    // Event listeners
    const toggleChat = (show) => {
      chatContainer.style.display = show ? 'block' : 'none';
      if (show) {
        setTimeout(() => {
          chatContainer.style.opacity = '1';
          chatContainer.style.transform = 'translateY(0)';
        }, 50);
      } else {
        chatContainer.style.opacity = '0';
        chatContainer.style.transform = 'translateY(20px)';
      }
    };

    chatButton.addEventListener('click', () => {
      const isVisible = chatContainer.style.display === 'block';
      toggleChat(!isVisible);
      if (!isVisible) input.focus();
    });

    closeButton.addEventListener('click', () => toggleChat(false));

    const sendMessage = async () => {
      const message = input.value.trim();
      if (!message) return;
      
      input.value = '';
      input.disabled = true;
      sendButton.disabled = true;
      
      // Add user message
      this.addMessage(messagesContainer, message, 'user');
      
      // Show typing indicator
      const typingIndicator = this.showTypingIndicator(messagesContainer);
      
      try {
        // Send message to backend
        const response = await fetch(`${this.config.serverUrl}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Session-ID': this.sessionId
          },
          body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
          throw new Error('Server error');
        }

        const data = await response.json();
        
        // Remove typing indicator and add AI response
        typingIndicator.remove();
        this.addMessage(messagesContainer, data.response, 'ai');
      } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        this.addMessage(messagesContainer, 'Sorry, I encountered an error. Please try again.', 'ai');
      } finally {
        input.disabled = false;
        sendButton.disabled = false;
        input.focus();
      }
    };

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendButton.addEventListener('click', sendMessage);

    // Focus trap
    chatContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleChat(false);
      }
    });
  }

  addMessage(container, message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'business-chat-message';
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.padding = '10px 15px';
    messageDiv.style.borderRadius = '15px';
    messageDiv.style.maxWidth = '80%';
    messageDiv.style.wordWrap = 'break-word';
    messageDiv.style.lineHeight = '1.4';
    
    if (type === 'user') {
      messageDiv.style.backgroundColor = this.config.primaryColor;
      messageDiv.style.color = 'white';
      messageDiv.style.marginLeft = 'auto';
    } else {
      messageDiv.style.backgroundColor = '#f0f0f0';
      messageDiv.style.color = 'black';
    }
    
    messageDiv.textContent = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
  }

  showTypingIndicator(container) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'business-chat-typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    return typingDiv;
  }
}