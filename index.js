// implement your API here

// library
const express = require('express');

// database file
const users = require('./data/db.js')

// global object
const server = express()

// middleware
server.use(express.json())

// add user to db
server.post('/api/users', (req, res) => {
  //define name and bio as request body
  const { name, bio } = req.body;
  // if name or bio are missing
  if (!name || !bio) {
    // respond with bad request status and JSON error message
    res.status(400).json({
      errorMessage: 'Please provide name and bio for the user.'
    })
    //otherwise
  } else {
    // insert user object
    users.insert(req.body)
    .then(user => {
      // and respond with status created and the id of the inserted user object
      res.status(201).json(user)
    })
    .catch(err => {
      // if there is an error, respond with  a status of internal server error and a JSON message
      res.status(500).json( { error: 'There was an error while saving the user to the database.'})
    })
  }
})



server.listen(5000, () => {
  console.log('Server is running on port 5000.');
})