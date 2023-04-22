const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const experienceController = require('../controllers/experienceController')(
        db
    );
    router.get('/', experienceController.getAllexperiences);

    router.post('/create', experienceController.createexperience);

    router.get('/:id', experienceController.getexperience);

    router.delete('/:id', experienceController.deleteexperience);

    return router;
};
