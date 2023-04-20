const FieldValue = require('firebase-admin').firestore.FieldValue;
const companyController = (db, admin) => {
    const getAllCompanies = async (req, res) => {
        try {
            const company = await db.collection('companies').get();
            const companyJson = [];
            company.forEach((job) => {
                companyJson.push({
                    id: job.company_id,
                    ...job.data(),
                });
            });
            res.send(companyJson);
        } catch (error) {
            res.send(error);
        }
    };

    const createCompany = async (req, res) => {
        try {
            const { company_id, name, url, description, location } = req.body;

            let companyJson = {
                company_id,
                name,
                url,
                description,
                location,
                createdAt: FieldValue.serverTimestamp(),
            };

            companyJson = JSON.parse(JSON.stringify(companyJson));
            // console.log(companyJson);
            const response = await db.collection('companies').add(companyJson);
            // res.send({ ok: true });
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const getCompany = async (req, res) => {
        try {
            const { id } = req.params;
            const job = await db.collection('companies').doc(id).get();
            res.send(job.data());
        } catch (error) {
            res.send(error);
        }
    };

    return {
        getAllCompanies,
        createCompany,
        getCompany,
        // updateCompany,
        // deleteCompany,
    };
};

module.exports = companyController;
