const express = require("express");
const Model = require("../models/model");
const bcrypt = require('bcrypt');
const router = express.Router();
const saltRounds = 10

router.get("/log", (req, res) => {
    res.render("routes/log");
});

router.get("/error", (req, res) => {
    res.render("routes/error", {errorType: req.query.errorType});
});

router.get("/sign", (req, res) => {
    res.render("routes/sign");
});

router.get("/page/:slug", async (req, res) => {
    const model = await Model.findOne( {slug: req.params.slug})
    res.render("routes/page", {model : model});
});

router.post('/log', async (req, res) => {

    const { userEmail, userPassword } = req.body;
    
    try {
      const user = await Model.findOne({ userEmail: userEmail });  
  
      if (user) {
        const passwordMatch = await bcrypt.compare(userPassword, user.userPassword);
  
        if (passwordMatch) {
          res.redirect(`/routes/page/${user.slug}`);
        } else {
          res.redirect('/routes/error?errorType=passwordMismatch');
        }
      } else {
        res.redirect('/routes/error?errorType=userNotFound');
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });

router.post("/sign", async (req, res) => {
    if(req.body.userPassword != req.body.confirmPassword){
        res.redirect("/routes/error?errorType=Password")
        return
    } 
    if(await Model.findOne({userEmail: req.body.userEmail})){
        res.redirect("/routes/error?errorType=Email")
        return
    }
    try {
        const newUser = new Model({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: await hashPassword(req.body.userPassword),
        });

        const savedUser = await newUser.save();
        res.redirect("/routes/log");
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("Internal Server Error: " + error.message);
    }
});



async function hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw error;
    }
  }

  async function comparePassword(inputPassword, hashedPassword) {
    try {
      const match = await bcrypt.compare(inputPassword, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }

module.exports = router;
