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

// get all user objects on the server
server.get('/api/users', (req, res) => {
  // request an array of all users in the db
  users.find()
  .then(users => {
    //respond with the array of users
    res.json(users)
  })
  .catch(err => {
    // if an error, respond with internal server error and json error message
    res.status(500).json({ error: 'The users information could not be retrieved.'})
  })
})

// GET a specific user
server.get('/api/users/:id', (req, res) => {
  // request a user by id parameter
  users.findById(req.params.id)
  // user id is found,
  .then(user => {
    if (user) {
      // respond with status of OK and user object
      res.status(200).json(user)
      //otherwise
    } else {
      // respond with 'not found' error and json message
      res.status(404).json({ error: 'The user with the specified ID does not exist.'})
    }
  })
  // if there is an error in retrieving the user from the db,
  .catch(err => {
    // respond with internal server error status and json error message
    res.status(500).json({ error: 'The user information could not be retrieved.'})
  })
})

// delete specific user object
server.delete('/api/users/:id', (req, res) => {
  // define id
  const { id } = req.params
  // request to delete user object with the specified id
  users.remove(id)
  .then(deletedUser => {
    // if that id is found, return deleted user
    if (deletedUser) {
      res.json(deletedUser)
      // otherwise
    } else {
      // respond with 'not found' error and json message
      res.status(404).json({ message: 'The user with the specified ID does not exist.'})
    }
  })
  // if there is an error in deleting a user,
  .catch(err => {
    // respond with an internal server error and json error message
    res.status(500).jason({ error: 'The user could not be removed.'})
  })
})

// update specific user
server.put('/api/users/:id', (req, res) => {
  // define request body and id
  const changes = req.body;
  const { name, bio } = req.body;
  const { id } = req.params;
  // request to update id & changes to be made parameters
  if (!name || !bio) {
    //respond with 'bad request' status and json error message
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'})
  } else {
    users.update(id, changes)
    .then(user => {
      if (user) {
        res.status(200).json(changes)
      } else {
        res.status(404).json({ message: 'The user with the specified ID does not exist.'})
      }
    })
    // if there is an error updating user,
    .catch(err => {
      // return 'internal server error' status and json error message
      res.status(500).json({ error: 'The user information could not be modified.'})
    })
  };
});

//listen on port 5000
server.listen(5000, () => {
  console.log('Server is running on port 5000.');
});