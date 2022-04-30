const express = require('express');
var cors = require('cors');
const connection = require('./Model');
const userRoute = require('./Controller/user');
const categoryRoute = require('./Controller/category');
const productsRoute = require('./Controller/product');
const billRoute = require('./Controller/bill'); 
const dashboardRoute = require('./Controller/dashboard');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productsRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);

app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
  })
// app.get('/api', (req,res)=>{
//     res.json({
//         success:1,
//         message: "This is shit"
//     });
// });

module.exports = app;