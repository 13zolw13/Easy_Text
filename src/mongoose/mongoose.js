const mongoose = require("mongoose");
const mongoConnect = mongoose.connection;

mongoConnect.on("error", console.error.bind(console, "connection error:"));
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