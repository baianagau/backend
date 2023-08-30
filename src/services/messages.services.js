import { messagesRepository } from '../repositories/index.js';
import EnumErrors from '../utils/errorHandler/enum.js';
import CustomError from '../utils/errorHandler/CustomError.js';

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
                    CustomError.createError({
                        name: 'addMessage Error',
                        message: 'User is required',                        
                        type: EnumErrors.INVALID_FIELDS_VALUE_ERROR.type,
                        statusCode: EnumErrors.INVALID_FIELDS_VALUE_ERROR.statusCode
                    });                    
                }
                if (!user.includes('@')) {
                    CustomError.createError({
                        name: 'addMessage Error',
                        message: 'User must be an email',                        
                        type: EnumErrors.INVALID_FIELDS_VALUE_ERROR.type,
                        recievedParams: { user },
                        statusCode: EnumErrors.INVALID_FIELDS_VALUE_ERROR.statusCode
                    });                    
                }
                if (!message) {
                    CustomError.createError({
                        name: 'addMessage Error',
                        message: 'Message is required',                        
                        type: EnumErrors.INVALID_FIELDS_VALUE_ERROR.type,
                        statusCode: EnumErrors.INVALID_FIELDS_VALUE_ERROR.statusCode
                    });                    
                }
                if (message.length === 0) {
                    CustomError.createError({
                        name: 'addMessage Error',
                        message: 'Message is required',                        
                        type: EnumErrors.INVALID_FIELDS_VALUE_ERROR.type,
                        statusCode: EnumErrors.INVALID_FIELDS_VALUE_ERROR.statusCode
                    });                    
                }
                if (message.length > 280) {
                    CustomError.createError({
                        name: 'addMessage Error',
                        message: 'Message cannot be longer than 280 characters',                        
                        type: EnumErrors.INVALID_FIELDS_VALUE_ERROR.type,
                        recievedParams: { message },
                        statusCode: EnumErrors.INVALID_FIELDS_VALUE_ERROR.statusCode
                    });                    
                }
                const newMessage = await this.messagesRepository.addMessage(user, message);
                return newMessage;
            } catch (error) {
                throw error;
            }
        }
    }

export { MessageService }