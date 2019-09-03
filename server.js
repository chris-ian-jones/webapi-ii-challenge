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

module.exports = server