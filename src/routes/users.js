const express = require('express');
const router = express.Router();

module.exports = (db, admin) => {
    const userController = require('../controllers/userController')(db, admin);
    router.get('/', userController.getAllUsers);

    router.post('/create', userController.createDBUser);

    router.post('/signup', userController.signUpUser);

    router.get('/:id', userController.getUser);

    router.get('/find/:uid', userController.findUserUid);

    router.post('/update/:uid', userController.findUpdateUser);

    router.put('/:id', userController.updateUser);

    router.delete('/:id', userController.deleteUser);

    router.delete('/deleteAuthUser/:uid', userController.deleteAuthUser);

    router.post('/recordCurrentUser', userController.recordCurrentUser);

    router.post('/removeCurrentUser', userController.removeCurrentUser);

    router.get('/currentUserProfile', userController.currentUserProfile);

    router.post('/addEducation/:uid', userController.addEducation);

    router.get('/getEducations/:uid', userController.getEducations);

    router.delete(
        '/deleteEducation/:education_id/:uid',
        userController.deleteEducation
    );

    return router;
};
