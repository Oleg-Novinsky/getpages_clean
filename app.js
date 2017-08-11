const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const  users = require('./routes/user');
const  getpages = require('./routes/getpages');
const config = require('./config/database');

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

mongoose.connection.on('Connected to datbase '+config.database, () => {
  console.log('db works');
});
mongoose.connection.on('error', (err) => {
  console.log('Failed to establish DB connection '+err);
});

// Port
const port = 3001;

// Cors
app.use(cors());


//Static folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser
app.use(bodyParser.json());

// Routes
app.use('/getpages', getpages);
app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Works');
});

// Start Server
app.listen(port, () =>{
console.log('Server started on '+port);
});
