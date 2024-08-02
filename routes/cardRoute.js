const express = require('express');
const router = express.Router();
const cartController = require('../controller/cardController');
const auth = require('../middlewares/auth');
router.post("/updatecart", auth, cartController.addCart);
router.get("/getprod",auth,cartController.getCartProducts);
router.delete("/deleteCart",auth,cartController.deleteCart);
module.exports = router;