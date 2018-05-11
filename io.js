const fetchClients = (io) => {
    let clients = Object.keys(io.sockets.sockets)
    let count = clients.length
    return [clients, count]
}

const connectionEvent = (io, socket) => {
    socket.on('chat', (msg) => {
        io.emit('chat', msg)
    })


    socket.on('disconnect', () => {
        let [clients, count] = fetchClients(io)
        socket.broadcast.emit('count', count)
        console.log(socket.id)
    })

}

const configIO = (io) => {
    io.on('connection', (socket) => {
        // all clients, clients count
        let [clients, count] = fetchClients(io)
        console.log(`total ${count} clients are connected`)
        io.emit('count', count)
        io.emit('clients', clients)
        // self
        let id = socket.id
        console.log('id', id)
        socket.emit('id', id)

        connectionEvent(io, socket)
    })
}


module.exports = configIO