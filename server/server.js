/* 
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT = user
*/

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'harishankarsivaji',
    password : '',
    database : 'smart-brain'
  }
});

const app =express();  

app.use(bodyParser.json());
app.use(cors());

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
  
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)});  

app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res)});

app.listen(3000, ()=> {
    console.log('App is running on port 3000');
})
