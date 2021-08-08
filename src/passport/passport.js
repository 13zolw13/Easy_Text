const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const localpassport = require("passport-local");
const UserSchema= require('../models/user')

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/login/google",
      // passReqToCallback: true,
    },
    async function (accessToken, refreshToken, profile, done) {

      const { id, displayName } = profile;
      const email = profile.emails[0].value;
      const photo = profile.photos[0].value;
      const temp = await UserSchema.findOne({ googleId: id })
      if (!temp) {
 
        console.log('New user from google')
        const User = new UserSchema({ username: displayName, email: email, googleId: id, status: true, avatar: photo });

        await User.save();
      
        console.log(temp)
        // await UserSchema.findOne(
        //   { googleId: profile.id },
        //   function (err, profile) {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       console.log("user exsit", profile);
        //       const user = new UserSchema({usernmae: profile.username, profile.emails})
        //     }
        //   }
        // );
        // const user = new UserSchema({ username: profile.username })

        // user.save();
        // const data = await UserSchema.findOne({ email: profile.email });
        // console.log("strategy worked");
        // console.log("google id", id);
     
        // console.log("email", email);
      
      
      } return done(null, profile);
         
    }
  )
);

passport.use(new localpassport(UserSchema.authenticate()));

passport.serializeUser((user, done) => {
  done(null,  user);
});
passport.deserializeUser(async (user, done) => {
  // user = await UserSchema.findById(user._id , (err,user)=> 
  done(null, user)
  // );
});


module.exports= {passport}