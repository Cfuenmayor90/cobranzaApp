const product = require('../models/productModels');
const setting = require('../models/settingsModels'); //setting para ver los planes
const settingValores = require('../models/settingValoresModels'); //sectin para valores de ganancia
const multer = require('multer');
const path = require('path');

const f = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
});
const arrayCategoriasProd = [{valor:'Electrodomesticos'}, {valor:'Hogar'}, {valor:'Equipamiento Comercial'}, {valor:'Electronica'}, {valor:'Celulares'}, {valor:'Accesorios Para Celulares'}, {valor:'Accesorios Para Vehiculos'}, {valor:'Herramientas' }];

//pag de productos para ADMIN
const cargarProducts = async(req, res) =>{
    try {
        const productos = await product.find();
        console.log(productos);
        res.render('productos', {productos, arrayCategoriasProd});
        
    } catch (error) {
        
    }
};
//pag de productos para usuarios y clientes
const cargarPagProductos = async(req, res) =>{
    try {
        const productos = await product.find();
        res.render('productosUsuarios', {productos , arrayCategoriasProd});
    } catch (error) {
        
    }
};

const filtrarProd = async(req, res) =>{
    try {
        const {categoria} = req.params;
        const productos = await product.find({categoria});
        res.render('productosUsuarios', {productos , arrayCategoriasProd});
    } catch (error) {
        
    }
}
const cotizarProd = async(req, res) => {
    try {
        const {id} = req.params;
        const prod = await product.findOne({_id: id});
        const planesDiarios = await setting.find({categoria: "financiamiento",plan: "diario" }).sort({cuotas: 1});
        const planesSemanales = await setting.find({categoria: "financiamiento",plan: "Semanal" }).sort({cuotas: 1});
        const valores = await settingValores.findOne();
        var precio = (prod.precio * valores.dolar) * ((valores.porcentaje * 0.01) + 1);
        const arrayPlanes = [];
        planesDiarios.forEach(element => {
            var xcentaje = (element.porcentaje/100)+1;
            var cuota = (precio*xcentaje)/element.cuotas;
            var total = (element.cuotas * cuota).toFixed(2);
            cuota = f.format(cuota)
            arrayPlanes.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota, "total": total });
        });
        planesSemanales.forEach(element => {
            var xcentaje= (element.porcentaje/100)+1;
            var cuota =(precio*xcentaje)/element.cuotas;
            cuota = f.format(cuota);
            arrayPlanes.push({"plan": element.plan, "cuotas": element.cuotas, "porcentaje": element.porcentaje, "cuota": cuota});
    });
    
       precio = f.format(precio);
        res.render('cotizarProd', {prod, precio , arrayPlanes})
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

module.exports = {cargarProducts, cargarPagProductos, upload, saveProducts, cotizarProd, filtrarProd};