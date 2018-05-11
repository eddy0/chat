const {mongoose, Model} = require('./main')


const Schema = mongoose.Schema

const chatSchema = new Schema({
    id: String,
    content: String,
    date: {
        type: Number,
        default: Date.now(),
    },
})

class ChatStore extends Model {
    static async create(form) {
        const u = await super.create(form)
        return u
    }
}


chatSchema.loadClass(ChatStore)
const Chat = mongoose.model('Chat', chatSchema)



module.exports = Chat
