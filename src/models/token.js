const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./user.js");

const tokenSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  createTime: { type: Date, required: true, default: Date.now, expires: 43200 },
});

module.exports = mongoose.model("Token", tokenSchema);
