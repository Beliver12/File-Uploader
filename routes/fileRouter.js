const { Router } = require('express');
const filesController = require('../controllers/fileController');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const filesRouter = Router();

filesRouter.get('/', filesController.filesGet);
filesRouter.get('/sign-up', filesController.membersSignUpGet);
filesRouter.post('/sign-up', filesController.membersSignUpPost);
filesRouter.get('/log-out', filesController.membersLogOut);
filesRouter.post('/', filesController.folderCreatePost);
filesRouter.get('/folders/:i', filesController.foldersGet);
filesRouter.post('/folders/:i', upload.single('myfile'), filesController.uploadFilePost)

module.exports = filesRouter;
