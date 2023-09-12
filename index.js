const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
require('dotenv').config();
const db = require('./config/mongoose');
let PORT=5000;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('./config/passport-local');
const GoogleStrategy = require('./config/passport-google');
const User = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(path.resolve(),"public")));
app.set('view engine','ejs');
app.set('views','./views');


// Configure the session middleware
app.use(session({
    secret: process.env.EXPRESS_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, 
        autoRemove: 'native', 
        ttl: 7 * 24 * 60 * 60 
      })
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

// Configure Passport to serialize and deserialize user objects to and from the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
});



app.use('/',require('./routes'));

app.listen(PORT, ()=>{
console.log(`Server is running on port: ${PORT}`)
})
