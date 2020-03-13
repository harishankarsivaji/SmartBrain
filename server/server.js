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

const app =express();  

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    console.log('you are waiting')
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        console.log(isValid)
        if(isValid) {
          return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
              res.json(user[0])
            })
            .catch(err =>  res.status(400).json('Unable to get user') )
        } else {
          res.status(400).json('Wrong Credentials')
        }
      })
      .catch(err =>  res.status(400).json('Wrong Credetials'))
})

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password) ;
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
            .then(user => {
              res.json(user[0])
            } )
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => { res.status(400).json(err) })
  })
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });

    // bcrypt.compare("apples", '$2a$10$WqYi.Lo4tXB1AzTpbNZ3OuHp2VGwtr5k0pc9pGvPXUaZKxwlz24Z6' , function(req, res) {
    //   console.log('first guess', res)
    // })   

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db.select('*').from('users').where({id})
      .then(user => {
        if(user.length){
          res.json(user[0]);
        } else 
        res.status(400).json('Not Found');
      })
      .catch(err=> {
        res.status(400).json('Error getting user');
      })    
})  

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {  
      res.json(entries[0])
    })
    .catch(err=> {
      res.status(400).json('Unable to get count');
    })
  })

app.listen(3000, ()=> {
    console.log('App is running on port 3000');
})
