const { v4: uuidv4 } = require('uuid');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cardModel');
const ProductModel = require('../models/ProductModel');
const userModel = require('../models/userModel');

const postOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    const email = user.Email;
    const { customerName, customerPhone, customerAddress } = req.body;
    const currentDate = new Date();
    const orderDate = currentDate;
    const estimateDeliverDate = new Date(currentDate);
    estimateDeliverDate.setDate(currentDate.getDate() + 10);
    const orderStatus = "Inprogress";
    const orderid = uuidv4();

    const userCart = await cartModel.findOne({ userId });
    if (!userCart || !userCart.product.length) {
      return res.status(404).json({ message: "No items in cart" });
    }

    const products = userCart.product;
    let cartProductArray = [];
    let totalAmount = 0;

    for (const cartProduct of products) {
      const product_id = cartProduct.productId;
      const { quantity } = cartProduct;
      const product = await ProductModel.findOne({ Id: product_id });
      if (product) {
        const cartProductDetails = {
          productId: product.Id,
         // Title: product.Title,
         // Description: product.Description,
         // Image: product.Image,
          //Price: product.Price,
          quantity: quantity,
          totalPrize: product.Price * quantity
        };
        cartProductArray.push(cartProductDetails);
        totalAmount += cartProductDetails.totalPrize;
      } else {
        console.warn(`product not found: ${product_id}`);
      }
    }

    const newOrder = new orderModel({
      orderid,
      customerName,
      customerPhone,
      customerAddress,
      orderDate,
      estimateDeliverDate,
      product: cartProductArray,
      totalAmount,
      orderStatus,
      userId,
    email
    });

    await newOrder.save();
    await cartModel.deleteOne({userId});

    console.log('Order created successfully:', newOrder);

    res.status(200).json({ message: "Order added successfully", newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }

};

const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });

    if (orders.length > 0) {
      
      const orderDetailsPromises = orders.map(async (order) => {
        const productsDetails = await Promise.all(order.product.map(async (product) => {
          const productDetails = await ProductModel.findOne({ Id: product.productId });
          if (productDetails) {
            return {
              title: productDetails.Title,
              description: productDetails.Description,
              image: productDetails.Image,
              price: productDetails.Price,
              quantity: product.quantity
            };
          } else {
            console.warn(`Product not found: ${product.productId}`);
            return {
              title: 'Unknown',
              description: 'No description available',
              image: 'No image available',
              price: 0,
              quantity: product.quantity
            };
          }
        }));

        return {
          products: productsDetails,
          subtotal: order.totalAmount,
          orderdate: order.orderDate,
          estdeldate: order. estimateDeliverDate,
          orderstatus: order.orderStatus,
          order_id: order.orderid
        };
      });

      const orderDetails = await Promise.all(orderDetailsPromises);

      res.status(200).json({ message: "Orders retrieved successfully", orders: orderDetails });
    } else {
      res.status(404).json({ message: "No orders found for this user" });
    }
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = { postOrder, getOrder };