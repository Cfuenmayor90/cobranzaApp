const product = require('../models/productModels');
const multer = require('multer');
const path = require('path');

//pag de productos para ADMIN
const cargarProducts = async(req, res) =>{
    try {
        const productos = await product.find();
        console.log(productos);
        res.render('productos', {productos});
        
    } catch (error) {
        
    }
};
//pag de productos para usuarios y clientes
const cargarPagProductos = async(req, res) =>{
    try {
        const productos = await product.find();
        res.render('productosUsuarios', {productos});
    } catch (error) {
        
    }
}
const cotizarProd = async(req, res) => {
    try {
        const {id} = req.params;
        console.log("cotizar" + id);
        const prod = await product.findOne({_id: id});
        const suma = prod.precio *4;
        console.log("suma" + suma);
        console.log("prod" + prod); 
        res.render('cotizarProd', {prod})
    } catch (error) {
        
    }
}
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
    limits:{fileSize: 1000000},
    fileFilter: (req, file, cb) =>{
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        var mensajeError = "Error al cargar la IMAGEN, formatos aceptados: jpeg|jpg|png"
        res.render('error', {mensajeError})
    }
    
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

module.exports = {cargarProducts, cargarPagProductos, upload, saveProducts, cotizarProd};