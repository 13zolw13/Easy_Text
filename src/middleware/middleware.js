const UserSchema = require("../models/user");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        console.log('User not logged in');
        return res.redirect('/user/login');
    } else {
        console.log('User logged in');
        next();
    }
}

module.exports.isValidatedUser = async (req, res, next) => {
    const {
        id
    } = req.params;
    const userId = req.user.id ||req.user._id ;
    // console.log("id:", id, 'userId:', userId );
    const googleUser = await UserSchema.findById(id);
    if ((id !==
        userId)&&(userId!==googleUser.googleId)) {
        console.log('Not authorized user');
        return res.redirect('/');
    } else {
        console.log('Authorized Users ');
        next()
    }
};