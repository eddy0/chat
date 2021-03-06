const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/chat'

mongoose.Promise = global.Promise

mongoose.connect(url, {
    // useMongoClient: true,
})

class Model extends mongoose.Model {
    static async all() {
        return super.find()
    }

    static async get(id) {
        return super.findById(id)
    }

    static async findBy(key, value) {
        const query = {
            [key]: value,
        }
        return super.findOne(query).exec()
    }

    static async findAll(key, value) {
        const query = {
            [key]: value,
        }
        return super.find(query).exec()
    }

    static async create(form, kwargs={}) {
        const m = await super.create(form)
        Object.keys(kwargs).forEach(k => m[k] = kwargs[k])
        m.save()
        return m
    }

    static async remove(id) {
        const query = {
            _id: id,
        }
        return super.deleteOne(query)
    }
}

module.exports = {
    mongoose: mongoose,
    Model: Model,
}