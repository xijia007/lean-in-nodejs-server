const FieldValue = require('firebase-admin').firestore.FieldValue;
const companyController = (db) => {
    const getAllCompanies = async (req, res) => {
        try {
            const company = await db.collection('companies').get();
            const companyJson = [];
            company.forEach((company) => {
                companyJson.push({
                    id: company.company_id,
                    ...company.data(),
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
            const company = await db.collection('companies').doc(id).get();
            res.send(company.data());
            console.log("got company info", company.data())
        } catch (error) {
            res.send(error);
        }
    };

    const findCompanyByID = async (req, res) => {
        try {
            const companyId = parseInt(req.params.companyId);
            console.log("req params: ", companyId)
            console.log(typeof companyId)
            let companyJson;
            await db
                .collection('companies')
                .where('company_id', '==', companyId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        companyJson = doc;
                    });
                });

            console.log("company data: ", companyJson.data())

            res.send(companyJson.data());
        } catch (error) {
            res.send(error);
            console.log("company error ", error)
        }
    };

    const updateCompany = async (req, res) => {
        try {
            const companyId = parseInt(req.params.companyId);
            const { name, description, location, url } =
                req.body;
            let companyJson = {
                name, description, location, url,
                // updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            companyJson = JSON.parse(JSON.stringify(companyJson));

            const response = await db
                .collection('companies')
                .where('company_id', '==', companyId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection('companies').doc(doc.id).update(companyJson);
                    });
                });
            console.log("updated company info: ", companyJson)

            res.send(response);
        } catch (error) {
            res.send(error);
            console.log("update error: ", error)
        }
    };

    return {
        getAllCompanies,
        createCompany,
        getCompany,
        // updateCompany,
        // deleteCompany,
        findCompanyByID,
        updateCompany,
    };
};

module.exports = companyController;
