const express = require('express');
const router = express.Router();

const userController = require('../contollers/userController');

router.get('/getAll', userController.getAllUsers);
router.get('/getOne/:id', userController.getOneUser);
router.post('/create', userController.createUser);
router.put('/update/:id', userController.updateUser)
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;