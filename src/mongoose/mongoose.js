const mongoose = require("mongoose");
const mongoConnect = mongoose.connection;
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoConnect.on("error", console.error.bind(console, "connection error:"));

// const instance = await MongoMemoryServer.create();
// const uri = instance.getUri();
// (global as any)._MONGOINSTANCE = instance;

mongoConnect.once("open", function () {
  console.log("MongoDB connected");
});


module.exports.moongoseConnectServer = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
           
        });
    } catch (err) {
        console.log('Error Mongoose db', err);
    }
}