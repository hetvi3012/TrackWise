// routes/userRoute.js
const express             = require('express');
const { registerController, loginController } = require('../controllers/userController');
const router              = express.Router();

// POST /api/v1/users/register
router.post('/register', registerController);

// POST /api/v1/users/login
router.post('/login',    loginController);

module.exports = router;
