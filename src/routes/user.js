const express = require("express");
const multer = require('multer');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const user = require('../controllers/user')
const {
    passport
} = require('../passport/passport');

const {
    storage
} = require('../cloudinary/index');
const { isLoggedIn, isValidatedUser } = require("../middleware/middleware");
const upload = multer({
    storage: storage
})


router.route("/register").get(user.renderRegisterPage).post(user.confirmationRegistretion);




// LOGIN WITH GOOGLE ACCOUNT



router.get("/login/google", passport.authenticate("google", {
    scope: ["email", "profile"],
    failureRedirect: "/login",
}), user.loginGoogle);

// LOGIN PAGE
router.route("/login").get(user.renderLoginPage).post(passport.authenticate("local", {
      failureFlash: 'Invalid password or username',
      failureRedirect: "/user/login",
    }), user.loginAuthentication);

// SENDING CONFIMATION TOKKEN
router.get("/confirmation/:token", user.confirmationToken);

router.post("/resend", user.resendToken);

router.get('/newpassword', user.renderNewPasswordPage);

router.route("/lostpassword").get(user.renderLostPasswordPage).post(user.lostPassword);

router.get("/logout", user.logoutUser);

// RENDERING USER EDIT PAGE
router.get("/:id/edit", isValidatedUser,isLoggedIn, catchAsync( user.renderEditUserPage));
router.route("/:id/newpassword").get(user.renderNewPasswordPage).post(user.passwordChange)
// Search for new contact
router.post("/:id/searchnewcontact", isLoggedIn, isValidatedUser, user.findNewContact);

//Adding new contact
router.post("/:id/addcontact", isLoggedIn, user.addNewContact);
//  RENDERING DEATAIL PAGE OF A USER
router.route('/:id' ).get(isLoggedIn, user.renderUserPage).put(isValidatedUser,isLoggedIn,upload.single('image'), user.editUser).delete(user.deleteUser);







// RENDERING REGISTER PAGE


module.exports = router;