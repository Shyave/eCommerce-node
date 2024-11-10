const { handleImageUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");


const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await handleImageUtil(url);

        res.status(200).json({
            success: true,
            result
        })

    } catch (e) {
        console.log("e - ", e);
        res.status(500).json({
            success: false,
            message: 'Error occurred'
        })
    }
}

// Add a new Product...
const addProduct = async (req, res) => {
    try {
        const {image, title, description, category, branch, price, salePrice, totalStock} = req.body;
        const newlyCreatedProduct = new Product({image, title, description, category, branch, price, salePrice, totalStock});
        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error Occurred!'
        })
    }
}

// Fetch all Products...
const fetchProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find();
        res.status(201).json({
            success: true,
            data: listOfProducts
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error Occurred!'
        })
    }
}

// Edit a Product...
const editProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {image, title, description, category, brand, price, salePrice, totalStock} = req.body;
        let product = await Product.findById(id);
        
        if (product) {
            product.title = title || product.title;
            product.description = description || product.description;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.price = price === '' ? 0 : price  || product.price;
            product.salePrice = salePrice === '' ? 0 : salePrice || product.salePrice;
            product.totalStock = totalStock === '' ? 0 : totalStock || product.totalStock;
            product.image = image || product.image;

            await product.save();
            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } else {
            res.status(404).json({
                success: true,
                message: `Unable to find the product` 
            });
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error Occurred!'
        })
    }
}

// Delete a Product...
const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id); 
        if (product) {
            res.status(200).json({
                success: true,
                message: `Product deleted successfully` 
            });
        } else {
            res.status(404).json({
                success: true,
                message: `Unable to find the product` 
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error Occurred!'
        })
    }
}

module.exports = {handleImageUpload, addProduct, fetchProducts, editProduct, deleteProduct}