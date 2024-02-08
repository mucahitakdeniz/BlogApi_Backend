"use strict";

const User = require("../models/user");
const Token = require("../models/token");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const sendMail = require("../helpers/sendMail");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "user_name":"test",
                    "password":"123Asd.",
                }
            }
        */

    if (req?.body.user_name && req?.body.password) {
      const user = await User.findOne({ user_name: req.body.user_name });
      if (user) {
        const password = passwordEncrypt(req.body.password);
        if (password == user.password) {
          const token = await Token.findOne({ user_id: user._id });
          if (token) {
            res.status(200).send({
              error: false,
              message: "Login successful",
              token: token.token,
            });
          } else {
            const token = passwordEncrypt(user._id + new Date());
            await Token.create({
              user_id: user._id,
              token: token,
            });
            res.status(200).send({
              error: false,
              message: "Login successful",
              token: token,
            });
          }
        } else {
          res.status(401).send({
            error: true,
            message: "The password is wrong",
          });
        }
      } else {
        res.status(401).send({
          error: true,
          message: "Username is wrong",
        });
      }
    } else {
      res.status(401).send({
        error: true,
        message: "Username and password required",
      });
    }
  },
  logout: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Logout"
  
        */
    const auth = req.headers.authorization || null;
    const token = auth ? auth.split(" ")[1] : null;
    if (token && auth.split(" ")[0] == "Token") {
      await Token.deleteOne({ token: token });
    }
    res.send({ error: false, message: "Logout ok" });
  },
  forgotPasswordSend: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Receive token with recall password to be used within two minutes"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                  "recall_password": "GRSN28",
                }
            }
        */

    const currentUser = await User.findOne({ _id: req.params.id });
    if (!currentUser._id) {
      res.errorStatusCode = 403;
      throw new Error("Error! No user with this id");
    }
    const currentDate = new Date();
    const timeDifference = (currentDate - currentUser?.updatedAt) / 1000;
    if (timeDifference > 120) {
      res.errorStatusCode = 408;
      throw new Error(
        "You must enter the temporary password within 2 minutes. Get a new password"
      );
    }
    if (req.body.recall_password != currentUser.recall_password) {
      res.errorStatusCode = 401;
      throw new Error("Error! You entered an incorrect code");
    }
    const token = await Token.findOne({ user_id: currentUser._id });
    if (token) {
      res.status(200).send({
        error: false,
        token: token.token,
      });
    } else {
      const token = passwordEncrypt(currentUser._id + new Date());
      await Token.create({
        user_id: currentUser._id,
        token: token,
      });
      res.status(200).send({
        error: false,
        token: token,
      });
    }
  },
  forgotPasswordReceive: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "A recall password is sent to the user's email which expires in two minutes"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                "email": "test@site.com",                    
                }
            }
        */

    const currentUser = await User.findOne({ email: req.body.email });
    if (!currentUser._id) {
      res.errorStatusCode = 403;
      throw new Error(
        `Error! An email named ${req.body.email} is not registered`
      );
    }
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let recall_password = "";
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * characters.length);
      recall_password += characters[index];
    }
    await User.updateOne(
      { _id: currentUser._id },
      { recall_password: recall_password }
    );
    sendMail(req.body.email, recall_password);

    res.status(200).send({
      error: false,
      id: currentUser._id,
    });
  },
};
