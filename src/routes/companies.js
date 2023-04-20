const express = require('express');
const router = express.Router();

module.exports = (db, admin) => {
    const companyController = require('../controllers/companyController')(
        db,
        admin
    );
    router.get('/', companyController.getAllCompanies);

    router.post('/create', companyController.createCompany);

    router.get('/:id', companyController.getCompany);

    // router.put('/:id', companyController.updateJob);

    // router.delete('/:id', companyController.deleteJob);

    return router;
};
