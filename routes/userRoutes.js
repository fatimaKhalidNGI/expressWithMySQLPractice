const express = require('express');
const router = express.Router();

const userController = require('../contollers/userController');

router.get('/getAll', userController.getAllUsers);
router.get('/getOne/:email', userController.getOneUser);
router.post('/create', userController.createUser);
router.put('/update/:email', userController.updateUser)
router.delete('/delete/:email', userController.deleteUser);

module.exports = router;