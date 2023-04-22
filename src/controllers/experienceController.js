const FieldValue = require('firebase-admin').firestore.FieldValue;
const experienceController = (db) => {
    const getAllexperiences = async (req, res) => {
        console.log("get all experiences")
        try {
            const experience = await db.collection('experiences').get();
            const experienceJson = [];
            experience.forEach((experience) => {
                experienceJson.push({
                    id: experience.experience_id,
                    ...experience.data(),
                });
            });
            res.send(experienceJson);
        } catch (error) {
            res.send(error);
        }
    };

    const createexperience = async (req, res) => {
        console.log("create experiences")
        try {
            const {
                experience_id,
                description,
                start_time,
                end_time,
                entityName,
            } = req.body;

            let experienceJson = {
                experience_id,
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

    const getexperience = async (req, res) => {
        try {
            const { id } = req.params;
            const experience = await db.collection('experiences').doc(id).get();
            res.send(experience.data());
        } catch (error) {
            res.send(error);
        }
    };

    const deleteexperience = async (experience_doc_id) => {
        try {
            // const { id } = req.params;
            const response = await db
                .collection('experiences')
                .doc(experience_doc_id)
                .delete();
            // res.send(experience.data());
            return response;
        } catch (error) {
            console.log(error);
        }
    };

    return {
        getAllexperiences,
        createexperience,
        getexperience,
        deleteexperience,
    };
};

module.exports = experienceController;
