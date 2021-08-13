require('dotenv').config()

test('Check if google env variables are define', () =>{
    expect(process.env.GOOGLE_CLIENT_ID).toBeDefined();
    expect(process.env.GOOGLE_USER).toBeDefined();
    expect(process.env.GOOGLE_MAIL_PASS).toBeDefined();
    expect(process.env.GOOGLE_USER).toBeDefined();
    expect(process.env.GOOGLE_CLIENT_SECRET).toBeDefined();  
})

// TODO 
// TEST FOR OTHER VARIABLES

