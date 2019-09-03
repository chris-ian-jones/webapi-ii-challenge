const express = require('express')

const server = express()

const db = require('./data/db.js')

server.use(express.json())

server.get('/', (req, res) => {
  res.status(200).json({
    api: 'up...'
  })
})

server.get('/api/posts', (req, res) => {
  db.find()
    .then(posts => {
      console.log(posts)
      res.status(200).json({
        posts
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: 'The posts information could not be retrieved.'
      })
    })
})

server.post('/api/posts', (req, res) => {
  const newPost = req.body

  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post'
    })
  } else {
    db.insert(newPost)
      .then(post => {
        console.log(post)
        db.findById(post.id)
          .then(newPost => {
            res.status(201).json({
              "New Post": newPost[0]
            })
          })
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        })
      })
  }
})

module.exports = server