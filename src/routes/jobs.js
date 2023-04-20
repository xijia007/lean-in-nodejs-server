const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const jobController = require('../controllers/jobController')(db);
    router.get('/', jobController.getAllJobs);

    router.post('/create', jobController.createJob);

    router.get('/:id', jobController.getJob);

    router.get('/search/:keyword', jobController.searchJob);

    // router.put('/:id', jobController.updateJob);

    // router.delete('/:id', jobController.deleteJob);

    return router;
};
