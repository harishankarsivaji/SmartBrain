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
const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'harishankarsivaji',
    password : '',
    database : 'smart-brain'
  }
});

db.select('*').from('users');

const app =express();

const database = {
    users: [
        {
            id: '123',
            name: 'Harish',
            email: 'harish@gmail.com',
            password: 'apples',
            entries: 0,
            joined: new Date()
        },
        {
          id: '124',
          name: 'John',
          email: 'john@gmail.com',
          entries: 0,
          joined: new Date()
        }
    ],
    login:[
        {
            id: '987',
            hash: '',
            email: 'harish@gmail.com'
        }
    ]
  }  

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // res.json("signing in")
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
      res.json(database.users[0]);
    } else {
      res.status(400).json('access denied');
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    // bcrypt.compare("apples", '$2a$10$WqYi.Lo4tXB1AzTpbNZ3OuHp2VGwtr5k0pc9pGvPXUaZKxwlz24Z6' , function(req, res) {
    //   console.log('first guess', res)
    // })

    db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
      .then(user => {
        res.json(user[0])
      } )
      .catch(err => {
        res.status(400).json(err)
      })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        found = true;
        return res.json(user);
      }
    })
    if(!found){
    res.status(400).json('no user');
    }
})  

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        found = true;
        user.entries++
        return res.json(user.entries);
      }
    })
    if(!found){
    res.status(400).json('no user');
    }
})

app.listen(3000, ()=> {
    console.log('App is running on port 3000');
})
