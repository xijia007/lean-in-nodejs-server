const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const experienceController = require('../controllers/experienceController')(
        db
    );
    router.get('/', experienceController.getAllExperiences);

    router.post('/create', experienceController.createExperience);

    router.get('/:id', experienceController.getExperience);

    router.delete('/:id', experienceController.deleteExperience);

    return router;
};
