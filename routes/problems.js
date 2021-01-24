const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

/* GET list of problems. */
router.get('/', problemController.index);

router.get('/question/:id', problemController.details);

router.post('/question/:id', problemController.addCmt);

router.get('/submit/')

module.exports = router;