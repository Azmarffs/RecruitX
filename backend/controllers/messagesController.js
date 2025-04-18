const messageModel = require("../models/messagesModel");

const getAllMessagesController = async (req, res) => 
{
    try 
    {
        const { email1, email2 } = req.params;
        if(!email1 || !email2)
        {
            return res.status(400).json({ message: 'Both emails are required' });
        }
        const messages = await messageModel.getAllMessages(email1, email2);
        
        res.status(200).json({ success: true, messages });
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error retrieving messages", error: error.message });
    }
};

const sendMessageController = async (req, res) => 
{
    try 
    {
        const { senderEmail, receiverEmail, messageText } = req.body;
        if (!senderEmail || !receiverEmail || !messageText) 
        {
            return res.status(400).json({ message: 'ALl fields are required' });
        }
        const result = await messageModel.sendMessage(senderEmail, receiverEmail, messageText);

        res.status(201).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error sending message", error: error.message });
    }
};

const updateMessageController = async (req, res) => 
{
    try 
    {
        const { messageId, senderEmail, newMessageText } = req.body;
        if (!messageId || ! senderEmail || !newMessageText) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const result = await messageModel.updateMessage(messageId, senderEmail, newMessageText);

        res.status(result.success ? 200 : 404).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error updating message", error: error.message });
    }
};

const deleteMessageController = async (req, res) => 
{
    try 
    {
        const { messageId, senderEmail } = req.body;
        if (!messageId || !senderEmail) 
        {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const result = await messageModel.deleteMessage(messageId, senderEmail);

        res.status(result.success ? 200 : 404).json(result);
    } 
    catch (error) 
    {
        res.status(500).json({ success: false, message: "Error deleting message", error: error.message });
    }
};

module.exports = 
{
    getAllMessagesController,
    sendMessageController,
    updateMessageController,
    deleteMessageController
};