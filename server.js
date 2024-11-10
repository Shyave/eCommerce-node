const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const shopProductsRouter = require('./routes/shop/shopProducts.route');
const cartRouter = require('./routes/shop/cart.route');

// Creating a database connection...
mongoose
    .connect('mongodb+srv://shyave99:TeVSTIDlEL0mUCHQ@learningnode.jjpvavk.mongodb.net/eCommerce')
    .then((res) => {
        console.log("Mongo DB connected!");
    })
    .catch((error) => console.log("error - ", error));

const app = express();
const PORT = process.env.PORT || 5001

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/cart', cartRouter)

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));