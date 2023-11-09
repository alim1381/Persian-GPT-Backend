const Controller = require("./controller");
const OpenAI = require("openai");
const Message = require("../models/message");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

class MessageController extends Controller {
  // last messages
  getLastMessages(req, res) {
    try {
    } catch (error) {
      next(error);
    }
  }
  // create new message
  async newMessage(req, res) {
    try {
      // create user new message
      let userNewMessage = new Message({
        text: req.body.text,
        userId: req.userData._id,
        aiSide: true,
      });

      // call open ai API
      const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: req.body.quiz }],
        model: "gpt-3.5-turbo",
      });

      // create ai new message
      let aiNewMessage = new Message({
        text: chatCompletion.choices[0].message.content,
        userId: req.userData._id,
        aiSide: true,
      });

      // save messages in DB
      await userNewMessage.save();
      aiNewMessage.save().then((result) => {
        res.status(201).json({
          text: result.text,
          userId: req.userData._id,
          aiSide: true,
        });
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
