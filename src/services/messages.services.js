import { MessagesManager } from '../dao/managers/messages.manager.js';

class MessageService {
    
        constructor() {
            this.messagesManager = new MessagesManager();
        }
    
        getMessages = async () => {
            try {
                const messages = await this.messagesManager.getMessages();
                return messages;
            } catch (error) {
                throw error;
            }
        }
    
        addMessage = async (user, message) => {
            try {
                if (!user) {
                    throw new Error('User is required');
                }
                if (!user.includes('@')) {
                    throw new Error('User must be an email');
                }
                if (!message) {
                    throw new Error('Message is required');
                }
                if (message.length === 0) {
                    throw new Error('Message is required');
                }
                if (message.length > 280) {
                    throw new Error('Message cannot be longer than 280 characters');
                }
                const newMessage = await this.messagesManager.addMessage(user, message);
                return newMessage;
            } catch (error) {
                throw error;
            }
        }
    }

export { MessageService }