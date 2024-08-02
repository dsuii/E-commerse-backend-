

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    product: [{
        productId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('cart', cartSchema); 
