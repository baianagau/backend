import { ticketsRepository } from '../repositories/index.js';
import shortid from 'shortid';

class TicketService {
    constructor() {
        this.ticketsRepository = ticketsRepository;
    }

    ticketFieldsValidation = async (ticket) => {
        try {
            const allowedFields = ['amount', 'purchaser'];
            const receivedFields = Object.keys(ticket);
            const isValidOperation = receivedFields.every((field) => allowedFields.includes(field));
            if (!isValidOperation) {
                throw new Error('Invalid fields!');
            }
            ticket.code = shortid.generate();
            const ticketWithSameCode = await this.ticketsRepository.getTicketByCode(ticket.code);
            if (ticketWithSameCode) {
                throw new Error('Ticket with same code already exists');
            }
            if (ticket.amount <= 0) {
                throw new Error('Ticket amount must be greater than 0');
            }
            return ticket;
        } catch (error) {
            throw error;
        }
    };

    createTicket = async (newTicketFields) => {
        try {
            const ticketWithCode = await this.ticketFieldsValidation(newTicketFields);
            const newTicket = await this.ticketsRepository.createTicket(ticketWithCode);
            return newTicket;
        } catch (error) {
            throw error;
        }
    }

}

export { TicketService }