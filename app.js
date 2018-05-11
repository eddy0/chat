const express = require('express')
const sockiet = require('socket.io')
const http = require('http')
const { log } = require('./utils')

const app = express()
const httpServer = http.Server(app)
const io = sockiet(httpServer)
const configIO = require('./io')

const configApp = () => {
    app.use('/static', express.static('static'))

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/chat.html')
    })

    app.get('/chat', function(req, res){
        res.sendFile(__dirname + '/chat.html')
    })

    const api = require('./api/api.js')
    app.use('/api', api)
}


const run = (port=3000) => {
    const server = httpServer.listen(port, () => {
        console.log(`listening on http://0.0.0.0:${port}`)
    })
}

const __main = () => {
    let port = '7700'
    let host = '0.0.0.0'
    configApp()
    configIO(io)
    run(port)
}

if (require.main === module) {
    __main()
}





