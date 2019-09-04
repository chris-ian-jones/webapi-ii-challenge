const express = require('express')

const router = express.Router()

const db = require('./../data/db.js')

// Returns an array of all the post objects contained in the database
router.get('/', (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json({
        posts
      })
    })
    .catch(err => {
      res.status(500).json({
        error: 'The posts information could not be retrieved.'
      })
    })
})


// Creates a post using the information sent inside the request body
router.post('/', (req, res) => {
  const newPost = req.body

  // check if request body is missing the title or contents properties
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post'
    })
  } else {
    // save the new post to the database
    db.insert(newPost)
      .then(post => {
        // return the newly created post
        db.findById(post.id)
          .then(newPost => {
            res.status(201).json({
              newPost: newPost[0]
            })
          })
      })
      // if theres an error while saving the post
      .catch(err => {
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        })
      })
  }
})


// Returns the post object with the specified id
router.get('/:id', (req, res) => {
  // use destructuring to grab id from url
  const { id } = req.params
  // check to see if post with id exists
  db.findById(id)
    .then(post => {
      // if findById function evaluates to empty array send back error message
      if (post.length === 0){
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      } else {
        // send back first (and only) post in array returned from findById function
        res.status(200).json({
          post: post[0]
        })
      }
    })
    // if theres an error in retrieving the post from the database
    .catch(err => {
      res.status(500).json({
        error: 'The post information could not be retrieved'
      })
    })
})

// Returns an array of all the comment objects associated with the post with the specified id
router.get('/:id/comments', (req, res) => {
  // use destructuring to grab id from url
  const { id } = req.params
  // check to see if post with id exists
  db.findById(id).then(post => {
    // if findById function evaluates to empty array send back error message
    if (post.length === 0){
      res.status(404).json({
        message: 'The post with the specified ID does not exist.'
      })
    } else {
      // search for comments associated with the post with the specified id,
      // return an array of all the comment objects
      db.findPostComments(id)
        .then(comments => {
          res.status(200).json({
            comments
          })
        })
        // send error message if theres an error in retrieving the comments from the database
        .catch(err => {
          res.status(500).json({
            error: 'The comments information could not be retrieved.'
          })
        })
    }
  }) 
})


// Creates a comment for the post with the specified id using information sent inside of the request body
router.post('/:id/comments', (req, res) => {
  // use destructuring to grab id from url
  const { id } = req.params
  // check to see if post with id exists
  db.findById(id)
    .then(post => {
      // if findById function evaluates to empty array send back error message
      if (post.length === 0){
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      // check if request body is missing the text property
      } else if (!req.body.text) {
        res.status(400).json({
          errorMessage: 'Please provide text for the comment.'
        })
      } else {
        // create object with correct key/value pairs
        const newComment = {
          text: req.body.text,
          post_id: id
        }
        // insert newly created object in to database
        db.insertComment(newComment)
          .then(comment => {
            // search for newly created comment, by id returned from process of inserting new comment
            // send back the newly created comment
            db.findCommentById(comment.id)
              .then(newComment => {
                res.status(201).json({
                  newComment: newComment[0]
                })
              })
          })
          // send an error message if theres an error while saving the comment
          .catch(err => {
            res.status(500).json({
              error: 'There was an error while saving the comment to the database.'
            })
          })
      }
    })
})


// Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement
router.delete('/:id', (req, res) => {
  // use destructuring to grab id from url
  const { id } = req.params
  // check to see if post with id exists
  db.findById(id)
    .then(post => {
      // if findById function evaluates to empty array send back error message
      if (post.length === 0){
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      } else {
        // delete the post associated with the id from the database
        db.remove(id)
          .then(removed => {
            res.status(200).json({
              message: 'post deleted'
            })
          })
          // send an error message if theres an error while deleting the post
          .catch(err => {
            res.status(500).json({
              error: 'The post could not be removed'
            })
          })
      }
    })
})


// Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original
router.put('/:id', (req, res) => {
  // use destructuring to grab id from url
  const { id } = req.params
  // check to see if post with id exists
  db.findById(id)
    .then(post => {
      // if findById function evaluates to empty array send back error message
      if (post.length === 0){
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      // check if request body is missing the title or contents properties
      } else if (!req.body.title || !req.body.contents) {
        res.status(400).json({
          errorMessage: 'Please provide title and contents for the post'
        })
      } else {
        // update the new post in the database
        db.update(id, req.body)
          .then(updatedPost => {
            // search for newly updated post by id
            db.findById(id)
              // send back first (and only) post in array returned from findById function
              .then(post => {
                res.status(200).json({
                  post: post[0]
                })
              })
          })
          // send an error message if theres an error while modifying the post
          .catch(err => {
            res.status(500).json({
              error: 'The post information could not be modified'
            })
          })
      }
    })
})

module.exports = router