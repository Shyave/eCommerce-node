const express = require('express');
const { getFilteredProducts, getProductDetails } = require('../../controllers/shop/shopProducts-controller');
const router = express.Router();

router.get("/list", getFilteredProducts);
router.get('/get/:id', getProductDetails)

module.exports = router