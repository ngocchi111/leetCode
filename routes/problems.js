const express = require('express');
const router = express.Router();
const bookController = require('../controllers/problemController');

/* GET list of books. */
router.get('/', bookController.index);

router.get('/detail/:id', bookController.details);

router.post('/detail/:id', bookController.addCmt);

module.exports = router;