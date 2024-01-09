const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('listado de cobranza');
});

module.exports = router;