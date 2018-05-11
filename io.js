const { log } = require('./utils')
const Chat = require('./models/chat')


const fetchClients = (io) => {
    let clients = Object.keys(io.sockets.sockets)
    let count = clients.length
    return [clients, count]
}

const connectionEvent = (io, socket) => {
    socket.on('chat', (msg) => {
        Chat.create(msg)
        io.emit('chat', msg)
    })


    socket.on('disconnect', () => {
        let [clients, count] = fetchClients(io)
        socket.broadcast.emit('count', count)
        console.log(socket.id)
    })

}

const configIO = (io) => {

    io.on('connection', async (socket) => {
        // all clients, clients count
        let [clients, count] = fetchClients(io)
        console.log(`total ${count} clients are connected`)
        io.emit('count', count)
        io.emit('clients', clients)

        // self id
        let id = socket.id
        console.log('id', id)
        socket.emit('id', id)

        // all content
        const history = await Chat.all()
        console.log('history', history)
        socket.emit('history', history)

        connectionEvent(io, socket)
    })
}


module.exports = configIO