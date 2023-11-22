const Controller = require("./controller");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const sult = 10;
const jwt = require("jsonwebtoken");
const generateToken = require("../auth/generateToken");

class AuthController extends Controller {
  // login
  async login(req, res, next) {
    try {
      let user = await User.findOne({ phone: req.body.phone });
      // check for exist phone number
      if (!user) {
        res.status(404).json({
          message: "کاربری با شماره تلفن وارد شده یافت نشد",
          success: false,
        });
      }

      // check for password is correct
      if (await bcrypt.compare(req.body.password, user.password)) {
        // generate Token
        const token = await generateToken(user._id, "4d");

        // send response ok
        res.status(200).json({
          user: {
            id: user._id,
            name: user.name,
            phone: user.phone,
            credit: user.credit,
            phoneVerify: user.phoneVerify,
            token: token,
          },
          message: "با موفقیت وارد شدید",
          success: true,
        });
      } else {
        // send response password entered does not match
        res.status(400).json({
          message: "رمزعبور وارد شده مطابقت ندارد",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  // register
  async register(req, res, next) {
    try {
      // check for valid phone number
      if (req.body.phone.length !== 11) {
        return res.status(400).json({
          message: "شماره تلفن وارد شده معتبر نمیباشد",
          success: false,
        });
      }

      // find user by this phone
      let findUser = await User.findOne({ phone: req.body.phone });

      // check for find phone number in DB
      if (findUser) {
        return res.status(409).json({
          message: "کاربر دیگری با این شماره در سیستم موجود میباشد",
          success: false,
        });
      } else {
        // create new user
        let newUser = new User({
          name: req.body.name,
          password: bcrypt.hashSync(req.body.password, sult),
          phone: req.body.phone,
          credit: 10,
        });

        // save in DB
        newUser.save().then(async (result) => {
          // generate Token
          const token = await generateToken(result._id, "4d");

          // send response ok
          res.status(201).json({
            user: {
              id: result._id,
              name: result.name,
              phone: result.phone,
              credit: result.credit,
              phoneVerify: result.phoneVerify,
              token: token,
            },
            message: "کاربر جدید با موفقیت ایجاد شد",
            success: true,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req, res, next) {
    try {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        const tokenDecoded = await jwt.verify(
          token,
          process.env.TOKEN_SECRET_KEY
        );
        if (tokenDecoded) {
          const findUser = await User.findById({ _id: tokenDecoded.id });
          if (findUser) {
            res.status(200).json({
              id: findUser._id,
              name: findUser.name,
              phone: findUser.phone,
              credit: findUser.credit,
              phoneVerify: findUser.phoneVerify,
              token: token,
            });
          } else {
            res.status(403).json({
              message: "توکن منقضی شده",
              success: false,
            });
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
