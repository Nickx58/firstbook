const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// load User Model
require('./models/User');

// passport config
require('./config/passport')(passport);

// load routes
const auth = require('./routes/auth');

// load keys
const keys = require('./config/keys');

// Map global promise
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI,{
    useMongoClient : true
}).then(() => console.log('Mongo DB connected')).catch(err => console.log(err));

const app = express();

app.get('/',(req,res) => {
    res.send('It works');
});

app.use(cookieParser());
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false
}));

// passport middleware

app.use(passport.initialize());
app.use(passport.session());

// set global var
app.use((req,res,next) => {
    res.locals.user = req.user || null;
    next();
})

// Use route
app.use('/auth',auth);


const port = process.env.PORT || 5000;

app.listen(port,() => {
    console.log(`Server is started on Port ${port}`);
});