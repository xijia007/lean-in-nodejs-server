const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const companyController = require('../controllers/companyController')(db);
    router.get('/', companyController.getAllCompanies);

    router.post('/create', companyController.createCompany);

    router.get('/:id', companyController.getCompany);

    router.get('/find/:companyId', companyController.findCompanyByID);

    router.post('/update/:companyId', companyController.updateCompany);

    // router.put('/:id', companyController.updateJob);

    // router.delete('/:id', companyController.deleteJob);

    return router;
};
