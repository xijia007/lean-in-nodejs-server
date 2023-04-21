const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const educationController = require('../controllers/educationController')(
        db
    );
    router.get('/', educationController.getAllEducations);

    router.post('/create', educationController.createEducation);

    router.get('/:id', educationController.getEducation);

    router.delete('/:id', educationController.deleteEducation);

    return router;
};
