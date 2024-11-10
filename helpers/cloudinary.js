const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({ 
    cloud_name: 'dxktexihevk', 
    api_key: '348652512478569141', 
    api_secret: 'daB5NNuK0a6LIIckyyy6FuHgaZksv'
});

const storage = new multer.memoryStorage();

async function handleImageUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    });

    return result;
}

const upload = multer({storage});
module.exports = {upload, handleImageUtil}
