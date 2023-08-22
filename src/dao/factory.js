import configureCommander from '../config/commander.config.js';
import configureDotenv from '../config/dotenv.config.js';

import CartMongoManager from './mongoManagers/carts.manager.js';
import MessageMongoManager from './mongoManagers/messages.manager.js';
import ProductMongoManager from './mongoManagers/products.manager.js';
import TicketMongoManager from './mongoManagers/tickets.managers.js';

/*
import cartsFile from './fileManagers/carts.manager.js';
import messagesFile from './fileManagers/messages.manager.js';
import productsFile from './fileManagers/products.manager.js';
*/

const env = configureCommander();
configureDotenv(env);

export class ProductsDaoFactory {
    static getDao() {
        switch (process.env.PERSISTANCE_TYPE) {
            case 'MONGODB':
                return new ProductMongoManager();
            case 'FILE':
                //return productsFile;
                throw new Error('File persistence not implemented yet');
            default:
                return new ProductMongoManager();
        }
    }
}

export class CartsDaoFactory {
    static getDao() {
        switch (process.env.PERSISTANCE_TYPE) {
            case 'MONGODB':
                return new CartMongoManager();
            case 'FILE':
                //return cartsFile;
                throw new Error('File persistence not implemented yet');
            default:
                return new CartMongoManager();
        }
    }
}

export class MessagesDaoFactory {
    static getDao() {
        switch (process.env.PERSISTANCE_TYPE) {
            case 'MONGODB':
                return new MessageMongoManager();
            case 'FILE':
                //return messagesFile;
                throw new Error('File persistence not implemented yet');
            default:
                return new MessageMongoManager();
        }
    }
}

export class TicketsDaoFactory {
    static getDao() {
        switch (process.env.PERSISTANCE_TYPE) {
            case 'MONGODB':
                return new TicketMongoManager();
            case 'FILE':
                throw new Error('File persistence not implemented yet');
            default:
                return new TicketMongoManager();
        }
    }
} 