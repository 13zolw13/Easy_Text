
const validTime = 604800000;

const sessionCfg = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    expirres: Date.now() +validTime,
    maxAge: validTime,
  },
};

module.exports = { sessionCfg };