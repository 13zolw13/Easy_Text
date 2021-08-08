const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversation = new Schema({
    contact: { type: Schema.Types.ObjectId, ref: 'Contact' },
    message: [{ text: String }, { sender: String }, { time: { type: Date, default: Date.now } }
        
],

  
})

module.exports = mongoose.model('Conversation', conversation);