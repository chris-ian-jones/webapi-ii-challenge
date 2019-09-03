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
              newPost: newPost[0]
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

server.get('/api/posts/:id', (req, res) => {
  const { id } = req.params
  db.findById(id)
    .then(post => {
      if (post.length === 0){
        res.status(404).json({
          message: 'The post information could not be retrieved'
        })
      } else {
        res.status(200).json({
          post: post[0]
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: 'The post information could not be retrieved'
      })
    })
})

server.get('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params
  db.findById(id).then(post => {
    if (post.length === 0){
      res.status(404).json({
        message: 'The post with the specified ID does not exist.'
      })
    } else {
      db.findPostComments(id)
        .then(comments => {
          res.status(200).json({
            comments
          })
        })
        .catch(err => {
          res.status(500).json({
            error: 'The comments information could not be retrieved.'
          })
        })
    }
  }) 
})

server.post('/api/posts/:id/comments', (req, res) => {
  const { id } = req.params
  db.findById(id)
    .then(post => {
      if (post.length === 0){
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      } else if (!req.body.text) {
        res.status(400).json({
          errorMessage: 'Please provide text for the comment.'
        })
      } else {
        const newComment = {
          text: req.body.text,
          post_id: id
        }
        db.insertComment(newComment)
          .then(comment => {
            db.findCommentById(comment.id)
              .then(newComment => {
                res.status(200).json({
                  newComment
                })
              })
          })
          .catch(err => {
            res.status(500).json({
              error: 'There was an error while saving the comment to the database.'
            })
          })
      }
    })
})

module.exports = server