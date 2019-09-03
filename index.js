const server = require('./server.js')

const port = 8888

server.listen(port, () => console.log(`\n API on port ${port} \n`))