import { MessageService } from "../services/messages.services.js";;

const messageService = new MessageService();

const getMessages = async (req, res) => {
    try {
        const messages = await messageService.getMessages();
        res.send({status: 1, messages: messages});
    } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
};

const postMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const newMessage = await messageService.addMessage(req.user.email, message);
        res.send({status: 1, msg: 'Message added successfully', message: newMessage});
    } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
};

export default { getMessages, postMessage };