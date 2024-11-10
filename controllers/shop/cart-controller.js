const Cart = require('./../shop/cart-controller');
const Product = require('./../../models/Product');

const addToCart = async (req, res) => {
    try {
        const {userId, productId, quantity} = req.body;
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!'
            })
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found!'
            })
        }

        let cart = await Cart.findOne({userId});
        if (!cart) {
            cart = new Cart({userId, items: []})
        }

        const findCurrentProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId)
        if (findCurrentProductIndex === -1) {
             cart.items.push(productId, quantity);
        } else {
            cart.items[findCurrentProductIndex].quantity += quantity
        }

        await cart.save();
        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (e) {
        console.log("error - ", e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

const fetchCartItems = async (req, res) => {
    try {
        const {userId} = req.params;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User Id is mandatory!'
            })
        }

        const cart = await Cart.findOne({userId}).populate({
            path: 'item.productId',
            select: "image title price salePrice"
        })

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Cart not found for this user'
            })
        }

        const validItems = cart.items.filter(productItem => productItem.productId);
        if (validItems.length < cart.items.length) {
            cart.items = validItems
            await cart.save();
        }

        const populateCartItems = validItems.map((item) => {
            return {
                productId: item.productId._id,
                image: item.productId.image,
                title: item.productId.title,
                price: item.productId.price,
                salePrice: item.productId.salePrice,
                quantity: item.productId.quantity
            }
        })

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (e) {
        console.log("error - ", e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

const updateCartItemQty = async (req, res) => {
    try {
        const {userId, productId, quantity} = req.body;
        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!'
            })
        }

        const cart = await Cart.findOne({userId});
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found!'
            })
        }

        const findCurrentProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (findCurrentProductIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            })
        }

        cart.items[findCurrentProductIndex].quantity += quantity;
        await cart.save();
        await cart.populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        const populateCartItems = validItems.map((item) => {
            return {
                productId: item.productId ? item.productId._id : null, 
                image: item.productId ? item.productId.image : null,
                title: item.productId ? item.productId.title : 'Product not found',
                price: item.productId ? item.productId.price : null,
                salePrice: item.productId ? item.productId.salePrice : null,
                quantity: item.productId ? item.productId.quantity : null
            }
        })

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (e) {
        console.log("error - ", e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided!'
            })
        }

        const cart = await Cart.findOne({userId}).populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'Cart not found for this user'
            })
        }
        
        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
        await cart.save();

        await Cart.populate({
            path: 'items.productId',
            select: "image title price salePrice"
        });

        const populateCartItems = validItems.map((item) => {
            return {
                productId: item.productId ? item.productId._id : null, 
                image: item.productId ? item.productId.image : null,
                title: item.productId ? item.productId.title : 'Product not found',
                price: item.productId ? item.productId.price : null,
                salePrice: item.productId ? item.productId.salePrice : null,
                quantity: item.productId ? item.productId.quantity : null
            }
        });

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populateCartItems
            }
        });

    } catch (e) {
        console.log("error - ", e);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }
}

module.exports = {addToCart, fetchCartItems, updateCartItemQty, deleteCartItem}