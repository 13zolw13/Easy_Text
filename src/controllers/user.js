const UserSchema = require('../models/user');
const Contacts = require('../models/contact');
const multer = require('multer');
const { cloudinary } = require('cloudinary/cloudinary');
const crypto = require("crypto");
const { transporter  } = require('../nodemailer/mail');
const Token = require("../models/token");


module.exports.findNewContact = async (req, res) => {
  try{
  console.log('Searching for new contact');
 const { id } = req.params;

  const newContact = await UserSchema.findOne({ username: req.body.SearchName });
  console.log('Contact Exist', newContact);
    const User = await UserSchema.findById(id);

    return res.redirect(`/user/${newContact.id}`)
  } catch (e) {
    console.log('Error->', e)
               res.redirect(`/user/${User.id}`);

  } 
  }

module.exports.addNewContact= async (req, res) => {
  try {
    //TODO +>ARRAY FOR CONTACT  CONNECTION
    // 
    const friendId = req.user._id
    const { id } = req.params;
    let Owner;
 

    if (req.user._id) { Owner = await UserSchema.findById(friendId); }
    else { Owner = await UserSchema.findOne({ googleId: req.user.id }); }
    
    const Target = await UserSchema.findById(id);
   
    if ((!Owner.contacts) || (!Target.contacts)) {
      let contact = new Contacts({ ownerId: Owner._id, targetId: Target._id, });
      contact = await Contacts.findById(contact.id).populate('targetId').populate('ownerId');
      await contact.save();
      Owner.contacts.push(contact);
      Target.contacts.push(contact);
    
       
      await Target.save();
      await Owner.save();
  
      console.log('User new conctacts saved', User.contacts);
      return res.redirect(`/user/${User.id}`)

    }
    else {
   
 const contact1 = await Contacts.findOne( {targetId: Target._id , ownerId: Owner._id})
 const contact2 = await Contacts.findOne( {targetId: Owner._id , ownerId: Target._id})     
if (contact1){return res.redirect(`/chat/${contact1._id}`)}
      if (contact2) { return res.redirect(`/chat/${contact2._id}`) }
      if ((!contact1) && (!contact2)) {
         let contact = new Contacts({ ownerId: Owner._id, targetId: Target._id, });
          

      await contact.save();
      Owner.contacts.push(contact);
      Target.contacts.push(contact);
    
       
      await Target.save();
      await Owner.save();
  
      console.log('User new conctacts saved', Owner.contacts);
      return res.redirect(`/user/${Owner.id}`)
     }
    }

  }
  catch (e) {
    console.log('Error->', e)
               res.redirect(`/user/${req.params.id}`);

  } 
 
}

module.exports.renderEditUserPage= async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const User = await UserSchema.findById(id);
    // console.log(User);
    res.render("user/userEdit", { User });
  } catch (e) {
    console.log('Error->', e)
               res.redirect(`/user/${User.id}`);

  } }

module.exports.deleteUser= async (req, res) => {
  try {
    const { id } = req.params;

    await UserSchema.findByIdAndDelete(id);
    res.redirect("/");
  }catch (e) {
    console.log('Error->', e)
               res.redirect(`/user/${User.id}`);

  } }

 module.exports.editUser=async (req, res) => {
   try {
     const { id } = req.params;
     // console.log(req.body.UserEdit);
     const User = await UserSchema.findByIdAndUpdate(id, { ...req.body.UserEdit });
     // console.log(User);
     //  console.log(req.file.path);
     if (typeof req.file !== 'undefined') {
       User.avatar = req.file.path;
     }
   
   
     console.log(req.file);
     await User.save();
     res.redirect(`/user/${User._id}`);
   } catch (e) {
     console.log('Error->', e)
           res.redirect(`/user/${User.id}`);

  } }

module.exports.renderUserPage = async (req, res) => {
  try {
    const { id } = req.params;
    const newContact = null;
    console.log('Render User Page req.user data', req.user);
    // const connection = await Contacts.find({}).populate('targetId').populate('ownerId');
    // render connection somehow 
    const User = await UserSchema.findById(id).populate({ path: 'contacts', model: 'Contact', populate: { path: 'targetId', model: 'User' } }).populate({ path: 'contacts', model: 'Contact', populate: { path: 'ownerId', model: 'User' } });


    // console.log('bla',connection)
    console.log("DEATAIL PAGE-> User details : ", User.contacts);


    res.render("user/userdetails", { User, newContact });
  }catch (e) {
    console.log('Error->', e)
    res.redirect('/');
  } 
  }

module.exports.renderRegisterPage= (req, res) => {
  res.render("user/register");
  // res.send("register user");
}

module.exports.confirmationRegistretion=  async (req, res) => {
  try {
    if (req.body.User !== '') {
      const { username, email, password } = req.body.User;
      const NewUser = new UserSchema({ username, email });
      const User = await UserSchema.register(NewUser, password);
      User.save();
      const token = new Token({
        UserId: User._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      // console.log(token);
      token.save(); // console.log(User);
  let mailOptions = {
        from: "noreplay.easytext@gmail.com",
        to: User.email,
        subject: "Account Verification Token",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/user/confirmation/" +
          token.token +
          ".\n Best regards \n EasyText Team",
};
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res
          .status(200)
          .redirect('/');
      });
    }

  }
  catch (e) {
    console.log('Error->', e)
  }
  
}

module.exports.loginGoogle = async  (req, res)=> {
  try {
    if (req.isAuthenticated) {
      const User = await UserSchema.findOne({ googleId: req.user.id })
      res.locals.LoginGoogle = User;
      // Successful authentication, redirect home.
      // res.locals.LoginUser = req.profile;
      //  const googleUser= await googleId.findOne({ googleId: profile.id });
      console.log('Data after login from  User.id', User.id);
      // res.redirect(`/user/${User.id}`);
      res.redirect(`/user/${User.id}`);
    }
  }catch (e) {
    console.log('Error->', e)
    res.redirect('/user/login');
  } 
}
  
module.exports.renderLoginPage =  (req, res) => {
  res.render("user/login");
}

module.exports.loginAuthentication =  (req, res, next) => {
 
   req.flash("success", " Welcome back!");

  const redirectUrl = req.session.returnTo || `/user/${req.user._id}`;
  delete req.session.returnTo;

  
  res.redirect(redirectUrl)
}
module.exports.confirmationToken = async (req, res) => {
  try {
    const activeToken = await Token.findOne({ token: req.params.token });
    // console.log(activeToken);
    const verUser = await UserSchema.findById(activeToken.UserId);
    // console.log(verUser);
    if (verUser && verUser.status === false) {
      verUser.status = true;
      verUser.save();
      return res.redirect("user/login");
    } else {
      return res.send("something went wrong!");
    }
  } catch (e) {
    res.send('Wrong token')
    console.log('Error->', e)
  } 
};

module.exports.resendToken = async (req, res) => {
  const email = req.body.email;
  try{
    const User = UserSchema.findOne({ email: email });
  const token = new Token({
        UserId: User._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      // console.log(token);
      token.save(); // console.log(User);
  let mailOptions = {
        from: "noreplay.easytext@gmail.com",
        to: User.email,
        subject: "Account Verification Token",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/user/confirmation/" +
          token.token +
          ".\n Best regards \n EasyText Team",
};
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
          req.flash("success", "A verification email has been sent to you");

        res
          .status(200)
          .redirect("/");
      });
  } catch (e) {
    console.log('error', e)
    }



 };

module.exports.logoutUser = (req, res) => {
  req.logout();
  res.locals.LoginUser = null
  req.session.destroy();
  req.flash("success", "You`ve been logout!");
  res.redirect("/");
};

module.exports.renderNewPasswordPage = async (req, res) => {
  try {
    const User = await UserSchema.findById(req.params.id)
    return res.render('user/newpassword', { User })
  }
  catch (e) { console.log(e) }
};

module.exports.passwordChange = async (req, res) => {
  try {
    if (req.body.newPassword1 === req.body.newPassword2) {
      const User = await UserSchema.findById(req.params.id)
      User.changePassword(req.body.oldPassword, req.body.newPassword1);
      req.flash("success", "Your password has been successfully changed");
      return res.redirect(`/user/${User.id}`);
    }

  } catch (e) { console.log(e); }
};

module.exports.renderLostPasswordPage = (req, res) => {
  res.render('user/lostpassword');

};

module.exports.lostPassword = async (req, res) => {
  // TODO: Send link to a site where user can change password, instead of mail with password;
  try {
    const email = req.body.email;
    console.log('lost password', email)
      let newPassword = Math.random().toString(36).slice(2);
    const User = await UserSchema.findOne({ email: email });
    if (User) {
      User.setPassword(newPassword, (err, User) => {
        // console.log(newPassword);
        User.save();
        
        let mailOptions = {
        from: "noreplay.easytext@gmail.com",
        to: User.email,
        subject: "New password",
        text:
          "Hello,\n\n   Your new password is: "
           +newPassword+
          "\n Best regards \n EasyText Team",
};
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
         req.flash("success", "An email with new password has been sent to you");
        res
          .status(200)
      });
        
        
        res.redirect('/user/login');
      });
      // console.log(newPassword)
     
    }

  }catch(e){}
}