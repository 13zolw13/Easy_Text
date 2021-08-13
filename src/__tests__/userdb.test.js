const mongoose = require('mongoose');
const user = require('../models/user');
require('dotenv').config()


const mockData =[ { username: 'George Constanza', email: "constanza@vandelayindustries.com" }, { username: 'Jerry', email: 'jerry@comedian.com'}];

describe('User mode test', () => {
  
  
    beforeAll(async () => {
    
         await mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true}, (err) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
        });
    });

    it("create and save user succes", async () => {
        const validUser = new user(mockData[0]);
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBeDefined();
        expect(savedUser.email).toBeDefined();
        expect(savedUser.googleId).toBeUndefined();
        expect(savedUser.status).toBeFalsy();

    });

    it('create and save user with field not defined', async () => {
        const validUser = new user({ username: 'Jerry', email: 'jerry@comedian.com', job: 'comedian' });
        const savedUser = await validUser.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.job).toBeUndefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
  })
})
