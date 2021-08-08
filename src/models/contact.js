const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');

const contact = new Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    targetId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    targetUsername: String,
    message: [{
        msg: String,
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User'
            },
            time: String
            }]

            })

            module.exports = mongoose.model('Contact', contact)