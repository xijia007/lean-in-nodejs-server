const express = require('express');
const router = express.Router();

module.exports = (db, admin) => {
    const userController = require('../controllers/userController')(db, admin);
    router.get('/', userController.getAllUsers);

    router.post('/create', userController.createDBUser);

    router.post('/signup', userController.signUpUser);

    router.get('/:id', userController.getUser);

    router.get('/find/:uid', userController.findUserUid);

    router.put('/:id', userController.updateUser);

    router.delete('/:id', userController.deleteUser);

    router.post('/recordCurrentUser', userController.recordCurrentUser);

    router.post('/removeCurrentUser', userController.removeCurrentUser);

    router.get('/currentUserProfile', userController.currentUserProfile);

    return router;
};

// module.exports = router
