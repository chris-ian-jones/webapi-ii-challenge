const express = require('express')

const postsRoutes = require('./posts/postsRoutes.js')

const server = express()

server.use(express.json())

server.use('/api/posts', postsRoutes)

server.use('/', (req, res) => res.send('API up and running!'))

const port = 8888

server.listen(port, () => console.log(`\n API on port ${port} \n`))