
 const handleRegister = (req, res, db, bcrypt) => {
    const {name, email, password} = req.body;
    if ( !email || !password || !name ) {
      return res.status(400).json('Please enter valid details')
    }
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
  }
  
  //ES6 syntax wont work on nodejs. NodeJS uses CommonJS 
  module.exports ={
    handleRegister: handleRegister
  } 
  