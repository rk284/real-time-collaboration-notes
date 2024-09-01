require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');
const socket = require('./public/scripts/socket');
const mongoStore = require('connect-mongo');
const authRouter = require('./routes/auth.route');
const crudRouter =  require('./routes/crud.route');

const app = express()


const server = http.createServer(app); 
socket.init(server);

const collaborateRouter = require('./routes/collaboration');
const path = require('path');




app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'));


//Environment variables
const port = process.env.PORT;
const secretSessionKey = process.env.SECRET_SESSION_KEY;
const dbUrl= process.env.DB_URL;


//Session
app.use(session({
  secret: secretSessionKey,
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({ mongoUrl : dbUrl})

}));


//Routes
app.use('/api/auth',authRouter.router);
app.use('/api/crud',crudRouter);
app.use('/api/collaboration',collaborateRouter);



// DB connection

mongoose.connect(dbUrl).then(() => {
  console.log('Database connected successfully');
  server.listen(port, () =>{
    console.log(`Server is running on ${port}`);
   
});
 
}).catch(err => {
  console.error('Database connection error:', err);
});





app.get('/', function (req, res) {
  try{
   res.sendFile(path.join(__dirname, 'views', 'login.html'));
  } catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

app.get('/login', function (req, res) {
  try{
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
  }catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

app.get('/register', function (req, res) {
  try{
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
  }catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

app.get('/home', authRouter.authMiddleware,function (req, res) {
  try{
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
  }catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

app.get('/notes',authRouter.authMiddleware, function (req, res) {
  try{
  res.sendFile(path.join(__dirname, 'views', 'notes.html'));
  }catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

app.get('/collaborate/:sessionId',authRouter.authMiddleware, function (req, res) {
  try{
  res.sendFile(path.join(__dirname, 'views', 'collaborate.html'));
  }catch(error){
    console.error('Error:',error);
    res.status(500).send('Something went wrong! Please try again later.');
  }
})

// global error handling
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something went wrong! Please try again later.');
});


