const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passprotLocalMongoose = require("passport-local-mongoose");
const Contact = require('./contact');

const userSchema = new Schema({
  displayName: String,
  
  username: String,


  email: String,

  avatar: String,
  // googleId: String,
  status: {
    type: Boolean,

    default: false,
  },
  confirmationCode: String,

  googleId:String,

  contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
});
userSchema.plugin(passprotLocalMongoose);
// userSchema.plugin(passportGoogle);
module.exports = mongoose.model("User", userSchema);
