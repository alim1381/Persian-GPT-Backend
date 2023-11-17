const Controller = require("./controller");
const OpenAI = require("openai");
const Message = require("../models/message");
const User = require("../models/user");

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

class MessageController extends Controller {
  // last messages
  async getLastMessages(req, res, next) {
    try {
      // query : ?page=1&newMessages=2
      // pagination 20 message in a page
      const pageSize = 20;
      let posts = await Message.find({ userId: req.userData._id })
        .sort({ createdAt: -1 })
        .skip(
          req.query.page
            ? parseInt(pageSize * req.query.page - pageSize) + parseInt(req.query.newMessage)
            : 0
        )
        .limit(req.query.page ? pageSize : 0)
        .select("-updatedAt -__v -userId");
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
  // create new message
  async newMessage(req, res, next) {
    try {
      // check credit
      if (req.userData.credit <= 0) {
        return res.status(402).json({
          message: "اعتبار شما کافی نمیباشد",
          success: false,
        });
      }

      // create user new message
      let userNewMessage = new Message({
        text: req.body.quiz,
        userId: req.userData._id,
        aiSide: false,
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

      // // for test
      // let aiNewMessage = new Message({
      //   text: `باشه ${req.body.quiz}`,
      //   userId: req.userData._id,
      //   aiSide: true,
      // });

      // save messages in DB
      await userNewMessage.save();

      // save messages in DB and send response
      aiNewMessage.save().then((result) => {
        User.updateOne({
          _id: req.userData._id,
          $set: { credit: req.userData.credit - 1 },
        }).then((update) => {
          setTimeout(() => {
            res.status(201).json({
              answer: { text: result.text, aiSide: true },
              currentCredit: req.userData.credit - 1,
            });
          }, 2000);
        });
      });
    } catch (error) {
      res.status(500).json({
        message: "خطا در برقراری ارتباط با مبدا",
        success: false,
      });
    }
  }
}

module.exports = new MessageController();
