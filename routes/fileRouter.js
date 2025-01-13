const { Router } = require('express');
const filesController = require('../controllers/fileController');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const filesRouter = Router();

filesRouter.get('/', filesController.filesGet);
filesRouter.get('/sign-up', filesController.membersSignUpGet);
filesRouter.post('/sign-up', filesController.membersSignUpPost);
filesRouter.get('/log-out', filesController.membersLogOut);
filesRouter.get('/createFolder', filesController.folderCreateGet);
filesRouter.post('/createFolder', filesController.folderCreatePost);

filesRouter.get('/folders/:i', filesController.foldersGet);
filesRouter.get('/uploadFile/:i', filesController.uploadFileGet);
filesRouter.post('/folders/:i', filesController.uploadFilePost);

filesRouter.get('/update/:i', filesController.foldersUpdateGet);
filesRouter.post('/update/:i', filesController.foldersUpdatePost);
filesRouter.post('/delete/:i', filesController.folderDeletePost);
filesRouter.get('/files/:i', filesController.fileGet);
filesRouter.get('/deleteFile/:i', filesController.fileDeleteGet);
filesRouter.post('/deleteFile/:i', filesController.fileDeletePost);
filesRouter.get('/single/:i', filesController.fileDownload);
module.exports = filesRouter;
