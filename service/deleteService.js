// service/deleteService.js

const cartModel = require('../models/cardModel');

const deleteCart = async (userId, productId) => {
    try {
        const user = await cartModel.findOne({ userId });
        if (!user) {
            console.error('User not found with userId:', userId);
            throw new Error('User not found');
        }

        if (!user.product) {
            console.error('Product field not found in user cart:', user);
            throw new Error('Product field is undefined');
        }

        user.product = user.product.filter(item => item.productId != productId);
        await user.save(); // Save the updated user cart

        return user.product; // Return the updated product list
    } catch (err) {
        console.error('Error in deleteCart:', err);
        throw err; // Re-throw the error after logging
    }
};

module.exports = { deleteCart };