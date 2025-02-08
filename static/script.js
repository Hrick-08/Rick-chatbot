document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';

            // Show typing animation
            showTypingIndicator();

            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message }),
                });

                if (response.ok) {
                    const data = await response.json();
                    removeTypingIndicator(); // Remove animation
                    addMessage('bot', data.response);
                } else {
                    throw new Error('Failed to get response from server');
                }
            } catch (error) {
                console.error('Error:', error);
                removeTypingIndicator(); // Remove animation
                addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            }
        }
    });

    function addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        // Convert Markdown-style formatting + clickable links
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*?)/gm, '<li>$1</li>')
            .replace(/\n/g, '<br>')
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        if (formattedText.includes('<li>')) {
            formattedText = `<ul>${formattedText}</ul>`;
        }

        messageElement.innerHTML = formattedText;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('message', 'bot-message');
        typingIndicator.innerHTML = `
            <span class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
});
