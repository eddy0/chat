const express = require('express')
// const bodyParser = require('body-parser')
const sockiet = require('socket.io')
const http = require('http')
const log = console.log.bind(console)

const app = express()
const httpServer = http.Server(app)
const io = sockiet(httpServer)
const configIO = require('./io')

const configApp = () => {
    app.use('/static', express.static('static'))

    // app.use(bodyParser.urlencoded({
    //     extended: true
    // }))
    // app.use(bodyParser.json())
    //
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/chat.html')
    })

    const api = require('./api/api.js')
    app.use('/api', api)
}


const run = (port=3000) => {
    const server = httpServer.listen(port, function() {
        console.log(`listening on http://localhost:${3000}`)
    })
}

const __main = () => {
    let port = '3000'
    let host = '0.0.0.0'
    configApp()
    configIO(io)
    run(port)
}

if (require.main === module) {
    __main()
}





