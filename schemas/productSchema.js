const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true},
    description:{type: String},
    category: {type: String},
    imageName: {type: String},
    tag: {type: String}

})

module.exports = mongoose.model("products", productSchema)