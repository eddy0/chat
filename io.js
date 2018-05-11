const fetchClients = (io) => {
    let clients = Object.keys(io.sockets.sockets)
    let count = clients.length
    return [clients, count]
}

const connectionEvent = (io, socket) => {
    socket.on('disconnect', () => {
        let count = fetchClients(io)
        socket.broadcast.emit('count', count)
        console.log(socket.id)


        // let socketId = socket.id
        // let Chat = require('./models/chat')
        // let u = Chat.findBy('socketId', socketId)
        // // log('u', u)
        // if (u !== null) {
        //     let id = u.uid
        //     socket.broadcast.emit('delete', id)
        // }

    })

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
}

const configIO = (io) => {
    io.on('connection', (socket) => {
        // all clients, clients count
        let [clients, count] = fetchClients(io)
        console.log(`total ${count} clients are connected`)
        socket.emit('count', count)
        socket.emit('clients', clients)
        socket.broadcast.emit('count', count)
        // self
        let id = socket.id
        console.log('id', id)
        socket.emit('id', id)

        connectionEvent(io, socket)
    })
}


module.exports = configIO