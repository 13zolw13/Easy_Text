const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO : Implement log of user errors 
const logData = new Schema({
    logMessage: String,
}, {timestamps :true}
);