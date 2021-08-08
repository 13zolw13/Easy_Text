const {
    server
} = require('./app');
const mongo = require('./mongoose/mongoose');

if (!process.env.mongoose_url) {
    throw new Error('error, db adress need to be define');
}

if (!process.env.PUSHER_key) {
    throw new Error('error, Pusher must be define');
}

if (!process.env.CLOUDINARY_KEY) {
    throw new Error('error, Cloudinary must be define');
}


if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('error, Google oauth2 must be define');
}


server.listen(3000, async () => {
    console.log("app is running");
    try {
        await mongo.moongoseConnectServer();
    } catch (e) {
        console.log('Error->', e);
        server.close();
    }
});