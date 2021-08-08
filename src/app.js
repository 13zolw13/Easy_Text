require('dotenv').config()

//npm packeges  
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const httpServer = require("http");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");

// Routes 
const UserRoutes = require('./routes/user');
const ChatRoutes = require('./routes/chat');
const Pages = require('./routes/dashboard.js');

//Config
const app = express();
const server = httpServer.createServer(app);

// Models
const UserSchema = require('./models/user');

const {
  passport
} = require('./passport/passport');
const {
  sessionCfg
} = require('./session/session');





app.use(methodOverride("_method"));

app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "../public"))); //
app.set("views", path.join(__dirname, "../views"));
app.use(cors());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.set("view engine", "ejs"); // so you can render('index')
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session(sessionCfg));

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  res.locals.LoginUser = req.user;

  if ( typeof req.user !== 'undefined') {
    res.locals.LoginGoogleUser = await UserSchema.findOne({googleId: req.user.id});
  }
  // console.log('APP USE DATA  req.user', req.locals.LoginUser);
  next();
});

app.use('/user', UserRoutes);
app.use('/', ChatRoutes);
app.use('', Pages);


app.use((req, res) => {
  res.send('404: Page not Found');
})

app.use((req, res, next) => {
  res.send('500: Internal Server Error', 500);

})


module.exports = {
  server,
  app
};