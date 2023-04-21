const FieldValue = require('firebase-admin').firestore.FieldValue;
const educationController = (db) => {
    const getAllEducations = async (req, res) => {
        try {
            const education = await db.collection('educations').get();
            const educationJson = [];
            education.forEach((education) => {
                educationJson.push({
                    id: education.education_id,
                    ...education.data(),
                });
            });
            res.send(educationJson);
        } catch (error) {
            res.send(error);
        }
    };

    const createEducation = async (req, res) => {
        try {
            const {
                education_id,
                degree,
                description,
                start_time,
                end_time,
                school_name,
            } = req.body;

            let educationJson = {
                education_id,
                degree,
                school_name,
                description,
                start_time,
                end_time,
                createdAt: FieldValue.serverTimestamp(),
            };
            educationJson = JSON.parse(JSON.stringify(educationJson));
            const response = await db
                .collection('educations')
                .add(educationJson);

            // res.send(response);
            if (res) {
                // Send JSON response with new user object
                res.status(201).json({
                    status: 'success',
                    data: response,
                });
            } else {
                // Return new user object
                return response;
            }
        } catch (error) {
            res.send(error);
        }
    };

    const getEducation = async (req, res) => {
        try {
            const { id } = req.params;
            const education = await db.collection('educations').doc(id).get();
            res.send(education.data());
        } catch (error) {
            res.send(error);
        }
    };

    const deleteEducation = async (education_doc_id) => {
        try {
            // const { id } = req.params;
            const response = await db
                .collection('educations')
                .doc(education_doc_id)
                .delete();
            // res.send(education.data());
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        getAllEducations,
        createEducation,
        getEducation,
        deleteEducation,
    };
};

module.exports = educationController;
