const product = require('../models/productModels');
const multer = require('multer');
const path = require('path');

const cargarProducts = async(req, res) =>{
    try {
        const productos = await product.find();
        console.log(productos);
        res.render('productos', {productos});
        
    } catch (error) {
        
    }
};
//midleware de MULTER   
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: (req, file, cb) =>{
        cb(null, `${req.body.cod}.jpg`);
    }
});
const upload = multer({
    storage,
    dest: path.join(__dirname, '../public/uploads'),
    limits: {fileSize: 200000}
 
}).single('image');

const saveProducts = async(req, res) =>{
    try {
        const newProduct = new product(req.body);
        await newProduct.save()
        res.send('todo ok');
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {cargarProducts, upload, saveProducts};