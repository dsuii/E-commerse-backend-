const mongoose=require('mongoose')
const orderSchema=new mongoose.Schema({
    customerName:{
        type:String
    },
    customerPhone:{
        type:String
    },
    customerAddress:{
        type:String
    },
    orderDate:{
        type:Date,
        default:Date.now
    },
    estimateDeliverDate:{
        type:Date,

    },
    product: [{
    //    // title:{
    //         type:String,
    //         required:true,
    //     },
    //     //description:{
    //         type:String,
    //         required:true,
    //     },
    //     //image:{
    //         type:String,
    //     },
    //     //price:{
    //         type:Number,
    //         required:true,
    //     },
        productId: {
            type: String,
          
        },
        quantity: {
            type: Number,
            
        }
    }],
    totalAmount:{
         type:Number,
    },
    orderStatus:{
         type:String,
         default:"pending"
    },
    userId:{
        type:String,
    },
       userEmail:{
        type:String,
       }
})
const orderModel=mongoose.model('orders',orderSchema)
module.exports=orderModel;