const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');


//Load user model
require('./models/User');

//Passport config
require('./config/passport')(passport);

//Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//Load Keys

const keys = require('./config/keys');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connect
mongoose.connect(keys.mongoURI, {
  useMongoClient:true
})
  .then(()=> console.log('MongoDB Connected'))
  .catch(err=> console.log(err));


const app = express();

//Handlebar middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set Global vars
app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});

//Use routes
app.use('/auth',auth);
app.use('/', index);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});