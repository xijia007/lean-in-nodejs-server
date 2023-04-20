const express = require('express');
const router = express.Router();

module.exports = (db, admin) => {
    const jobController = require('../controllers/jobController')(db, admin);
    router.get('/', jobController.getAllJobs);

    router.post('/create', jobController.createJob);

    router.get('/:id', jobController.getJob);

    // router.put('/:id', jobController.updateJob);

    // router.delete('/:id', jobController.deleteJob);

    return router;
};
