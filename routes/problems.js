const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

/* GET list of problems. */
router.get('/', problemController.index);

router.get('/question/:id', problemController.details);

router.post('/question/:id', problemController.addCmt);

router.get('/submit/:id', problemController.submit);

router.post('/submit/:id', problemController.postSubmit);

router.get('/addtest/:id', problemController.addTest);

router.post('/addtest/:id', problemController.postTest);

router.get('/status', problemController.status);

router.get('/addProblem', problemController.addProblem);

router.post('/addProblem', problemController.postProblem);


module.exports = router;
