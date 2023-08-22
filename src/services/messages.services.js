import { messagesRepository } from '../repositories/index.js';

class MessageService {
    
        constructor() {
            this.messagesRepository = messagesRepository;
        }
    
        getMessages = async () => {
            try {
                const messages = await this.messagesRepository.getMessages();
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
                const newMessage = await this.messagesRepository.addMessage(user, message);
                return newMessage;
            } catch (error) {
                throw error;
            }
        }
    }

export { MessageService }