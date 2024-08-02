const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes'); // Adjusted path
const userRoutes = require('./routes/userRoutes');      // Adjusted path
const cardRoutes = require('./routes/cardRoute');  
const orderRoute=require('./routes/orderRoute');     // Adjusted path
const app = express();

mongoose.connect('mongodb+srv://Durga2618:Durga2005@cluster0.pinhhqm.mongodb.net/commerse')
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use('/', productRoutes);     
app.use('/User', userRoutes);    
app.use('/Card', cardRoutes);    
app.use('/Order',orderRoute);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
