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

    router.post('/addEducation/:uid', userController.addEducation);

    router.get('/getEducations/:uid', userController.getEducations);

    router.delete(
        '/deleteEducation/:education_id/:uid',
        userController.deleteEducation
    );

    router.post('/saveJob/:uid', userController.saveJob);
    router.post('/unsaveJob/:uid', userController.unsaveJob);
    router.get('/savedJobs/:uid', userController.getSavedJobs);


    router.post('/addExperience/:uid', userController.addExperience);

    router.get('/getExperiences/:uid', userController.getExperience);

    router.delete(
        '/deleteExperience/:experience_id/:uid',
        userController.deleteExperience
    );

    router.post('/applyJob/:uid', userController.applyJob);
    router.get('/getAppliedJobs/:uid', userController.getAppliedJobs);

    return router;
};
