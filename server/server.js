/* 
/signin --> POST = success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT = user
*/

const express = require('express');
const bodyParser = require('body-parser');

const app =express();

const database = {
    users: [
        {
            id: '123',
            name: 'Harish',
            email: 'harish@gmail.com',
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

app.get('/', (req,res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // res.json("signing in")
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
      res.json('signed in');
    } else {
      res.status(400).json('access denied');
    }
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
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
