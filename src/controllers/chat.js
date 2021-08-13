const UserSchema = require('../models/user');
const Contacts = require('../models/contact');
const {
  pusher
} = require('../pusher/pusher');

const {
  body,
  validationResult
} = require('express-validator');


module.exports.pusherChat = async (req, res, next) => {
       
  try {
   
    const {
      id
    } = req.params;
    const UserId = req.user.id;
    let User = null;
    const conv = await Contacts.findById(id);
    console.log(req.body.message);
    if (UserId === conv.ownerId) {
      User = req.user;
    };
    if (UserId === conv.targetId) {
      User = req.user
    };
    if ((UserId !== conv.ownerId) && (UserId !== conv.targetId)) {
      User = await UserSchema.findOne({
        googleId: UserId
      })
    };
    // console.log('User info, got from post req sending text', User);
    // console.log(message);
    // console.log(sender);
    const message = req.body.message;
    const channel = 'private-' + id;
    const newMsg = {
      msg: req.body.message,
      sender: User._id,
      time: Date.now()
    };
    // console.log('Message from form: ', newMsg);

    await pusher.trigger(channel, 'message', {
      message: req.body.message,
      sender: User.id
    });
    await conv.message.push(newMsg);
    await conv.save();
    
    // res.json(message)
    next();
  } catch (e) {
    console.log('Error->', e);

    req.flash('error', e);
    res.redirect(`/`);
  }

  // res.json([]);
  // res.redirect('/chat/id');
};

module.exports.renderChat = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    // console.log('chat  id', id);
    const userProvider = req.user.provider;
    const contact = await Contacts.findById(id);
    // console.log('data of contact', contact);
    const logedInUser = req.user;
    const logedInUserId = req.user.id || req.user._id;
    // console.log('Render chat data check', logedInUser.id);
    const User1 = await UserSchema.findById(contact.ownerId);
    const User2 = await UserSchema.findById(contact.targetId);

    console.log('User1 id: ', contact.ownerId, "User2 id: ", contact.targetId, 'login User', logedInUserId);
    // console.log('contact details',contact);


    if (logedInUserId === User1.id) {
      console.log("Login user is contact owner");
      let owner = User1;
      let target = User2;
      // console.log('target data', target);
      res.render("chat", {
        owner,
        target,
        contact
      });
    };

    if (logedInUserId === User2.id) {
      console.log("Login user is contact target");
      let target = User1;
      let owner = User2;
      res.render("chat", {
        owner,
        target,
        contact
      });
    };



    if (req.user.provider === 'google') {
      // console.log('user data from provider:', userProvider);
      const User = await UserSchema.findOne({
        googleId: logedInUserId
      });
      // console.log('user id from chat data', User._id);
      // console.log('contact.ownerId', contact.ownerId);
      if (User._id === contact.ownerId) {
        let owner = User1;
        let target = User2;
        return res.render("chat", {
          owner,
          target,
          contact
        });

      } else {
        let owner = User2;
        let target = User1;

        res.render("chat", {
          owner,
          target,
          contact
        });
      }

    }


  } catch (e) {
    console.log("ERROR->", e);
    res.redirect('/');

  }
}

module.exports.pusherAuth = async function (req, res) {
  try {
    const socketId = req.body.socket_id;
    console.log('socket id pusher ', socketId);
    // console.log(req.user.id);
    // console.log('req.user auth pusher', req.user);

    // console.log('Pusher auth user id ', req.user.id);
    // console.log('Authenication pusher data from req.params: ', req.body.channel_name);
    const channel = req.body.channel_name;
    const userId = req.user.id || req.user._id;
    // const userId = '60c75d0537fa1f4e506262d3';
    // console.log('User connecting', userId);
    const auth = pusher.authenticate(socketId, channel, userId);
    res.send(auth);
  } catch (e) {
      req.flash("error", e);
    console.log('Error->', e);
    res.status('505').redirect('/user/login');
  }


};