const CartModel = require('../models/cardModel');
const ProductModel=require('../models/ProductModel')
const CartService = require('../service/deleteService');

const addCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        let userCart = await CartModel.findOne({ userId });

        if (userCart) {
            const productIndex = userCart.product.findIndex(item => item.productId === productId);

            if (productIndex !== -1) {
                userCart.product[productIndex].quantity += quantity;
                await userCart.save();
                return res.status(200).json({ message: 'Product quantity updated in the cart.' });
            } else {
                userCart.product.push({ productId, quantity });
                await userCart.save();
                return res.status(200).json({ message: 'Product added to the cart.' });
            }
        } else {
            userCart = new CartModel({
                userId,
                product: [{ productId, quantity }]
            });
            await userCart.save();
            return res.status(201).json({ message: 'Cart created and product added.' });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const getCartProducts = async (req, res) => {
    try {
        const userId = req.user.id; 

       
        const userCart = await CartModel.findOne({ userId });

        if (!userCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIds = userCart.product.map(item => item.productId);

       
        const products = await ProductModel.find({ Id: { $in: productIds } });

        const productMap = products.reduce((acc, product) => {
            acc[product.Id] = product;
            return acc;
        }, {});

       let subtotal=0;
        const productsDetails = userCart.product.map(item => {
            const product = productMap[item.productId];

            if (!product) {
                console.warn(`Product not found for id: ${item.productId}`);
                return {
                    name: 'Unknown',
                    description: 'No description available',
                    title: 'Unknown',
                    image: 'No image available',
                    quantity: item.quantity 
                };
            }
            subtotal+=product.Price * item.quantity;

            return {
                //name: product.title,
                title: product.Title,
                description: product.Description,
                
                image: product.Image,
                quantity: item.quantity ,
                price:product.Price
            };
        });

        res.json({productsDetails,subtotal});
    } catch (error) {
        console.error('Error fetching cart products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteCart = async (req, res) => {
    try {
        await CartService.deleteCart(req.user.id, req.body.productId);
        res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { addCart ,getCartProducts,deleteCart};