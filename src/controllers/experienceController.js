const FieldValue = require('firebase-admin').firestore.FieldValue;
const experienceController = (db) => {
    const createExperience = async (req, res) => {
        try {
            const {
                experience_id,
                role,
                description,
                start_time,
                end_time,
                entityName,
            } = req.body;

            let experienceJson = {
                experience_id,
                role,
                entityName,
                description,
                start_time,
                end_time,
                createdAt: FieldValue.serverTimestamp(),
            };
            experienceJson = JSON.parse(JSON.stringify(experienceJson));
            const response = await db
                .collection('experiences')
                .add(experienceJson);

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
    //
    // const getEducation = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const education = await db.collection('educations').doc(id).get();
    //         res.send(education.data());
    //     } catch (error) {
    //         res.send(error);
    //     }
    // };

    const deleteExperience = async (experience_doc_id) => {
        try {
            // const { id } = req.params;
            const response = await db
                .collection('experiences')
                .doc(experience_doc_id)
                .delete();
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        createExperience,
        deleteExperience
    };
};

module.exports = experienceController;
