const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
    validarIngresoUsuario,
    crearUsuario,
    editUserGet,
    editUserPost,
    deleteUser,
    checkRole
} = require('../controllers/usersControllers');
const jwt = require('../middleware/jwt');


router.post('/crearUsers',[
    check('nombre').isLength({min:4}),
    check('dni').isLength({min:8}),
    check('password').isLength({min:6}),
], crearUsuario);

router.post('/', validarIngresoUsuario);

router.get('/login', (req, res) => {
    res.render('login');
})

router.put('/:id', (req, res) =>{
    res.send('actualizamos un usuario');
});
router.get('/edit/:id',checkRole(['admin']), editUserGet);
 
router.post('/edit/:id', checkRole(['admin']), editUserPost);

router.get('/delete/:id', checkRole(['admin']), deleteUser);

module.exports = router;