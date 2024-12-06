const { Router } = require('express');
const filesController = require('../controllers/fileController');

const filesRouter = Router();

filesRouter.get('/', filesController.filesGet);
filesRouter.get('/sign-up', filesController.membersSignUpGet);
filesRouter.post('/sign-up', filesController.membersSignUpPost);

module.exports = filesRouter;
