const express = require('express');
const router = express.Router();
const { postOrder, getOrder } = require('../controller/orderController'); 
const authenticate = require('../middlewares/auth'); 
router.post('/orders', authenticate, postOrder);
router.get('/orders', authenticate, getOrder);
//router.delete('/orders/:order_id', authenticate, deleteOrder);
module.exports = router;
