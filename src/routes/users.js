const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const userController = require('../controllers/userController')(db);
    router.get('/', userController.getAllUsers);

    router.post('/create', userController.createUser);

    router.get('/:id', userController.getUser);

    router.put('/:id', userController.updateUser);

    router.delete('/:id', userController.deleteUser);

    return router;
};

// module.exports = router
