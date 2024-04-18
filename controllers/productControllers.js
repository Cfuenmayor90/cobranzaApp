const product = require('../models/productModels');

const cargarProducts = async(req, res) =>{
    try {
        const productos = await product.find();
        console.log(productos);
        res.render('productosUsuarios');
    
    } catch (error) {
        
    }
}

module.exports = {cargarProducts};