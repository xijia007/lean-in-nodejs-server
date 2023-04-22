const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const experienceController = require('../controllers/experienceController')(
        db
    );

    router.post('/create', experienceController.createExperience);

    router.delete('/:id', experienceController.deleteExperience);

    return router;
};
