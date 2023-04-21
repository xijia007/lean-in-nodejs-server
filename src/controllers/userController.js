// const { FieldValue } = require('firebase-admin/firestore');
const FieldValue = require('firebase-admin').firestore.FieldValue;
let currentUser = null;

const userController = (db, admin) => {
    const educationController = require('./educationController')(db);
    const getAllUsers = async (req, res) => {
        try {
            const users = await db.collection('users').get();
            const usersJson = [];
            users.forEach((user) => {
                usersJson.push({
                    id: user.id,
                    ...user.data(),
                });
            });
            res.send(usersJson);
        } catch (error) {
            res.send(error);
        }
    };

    const createDBUser = async (req, res, uid) => {
        try {
            const { email, userName, firstName, lastName, role, bio, skill } =
                req.body;
            let userJson = {
                email,
                userName,
                firstName,
                lastName,
                role: role ?? 'user',
                bio,
                skill,
                uid,
                educations: [],
                createdAt: FieldValue.serverTimestamp(),
            };

            userJson = JSON.parse(JSON.stringify(userJson));

            const response = await db.collection('users').add(userJson);
            res.send(response);
        } catch (error) {
            console.log(error);
            if (uid) {
                throw error;
            } else {
                res.send(error);
            }
        }
    };

    const signUpUser = async (req, res) => {
        const { email, password } = req.body;
        try {
            const userResponse = await admin.auth().createUser({
                email,
                password,
                emailVerified: false,
                disabled: false,
            });
            const uid = userResponse.uid;

            await createDBUser(req, res, uid);
        } catch (error) {
            console.log(error);
            res.status(400).json({ error });
        }
    };

    const getUser = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.collection('users').doc(id).get();
            res.send(user.data());
        } catch (error) {
            res.send(error);
        }
    };

    const findUserUid = async (req, res) => {
        try {
            const { uid } = req.params;

            let userJson;
            await db
                .collection('users')
                .where('uid', '==', uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        userJson = doc;
                    });
                });

            res.send(userJson.data());
        } catch (error) {
            res.send(error);
        }
    };

    const findUserId = async (req) => {
        try {
            const { uid } = req.params;

            let id;
            await db
                .collection('users')
                .where('uid', '==', uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        console.log(doc.id);
                        id = doc.id;
                    });
                });

            return id;
        } catch (error) {
            return error;
        }
    };

    const findUpdateUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const { email, userName, firstName, lastName, role, bio, skill } =
                req.body;
            let userJson = {
                // email,
                userName,
                firstName,
                lastName,
                // role: role ?? 'user',
                bio,
                skill,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            userJson = JSON.parse(JSON.stringify(userJson));

            const response = await db
                .collection('users')
                .where('uid', '==', uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        db.collection('users').doc(doc.id).update(userJson);
                    });
                });

            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { email, userName, firstName, lastName, role, bio, skill } =
                req.body;
            let userJson = {
                email,
                userName,
                firstName,
                lastName,
                role: role ?? 'user',
                bio,
                skill,
                updatedAt: FieldValue.serverTimestamp(),
            };
            userJson = JSON.parse(JSON.stringify(userJson));

            const response = await db
                .collection('users')
                .doc(id)
                .update(userJson);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const deleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            const response = await db.collection('users').doc(id).delete();
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const deleteAuthUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const id = await findUserId(req);
            const response = await db.collection('users').doc(id).delete();
            await admin.auth().deleteUser(uid);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    };

    const recordCurrentUser = async (req, res) => {
        const loggedInUser = req.body;
        if (loggedInUser) {
            currentUser = loggedInUser;
            res.send(loggedInUser);
            console.log('record current user', currentUser);
        } else {
            res.sendStatus(404);
        }
    };

    const removeCurrentUser = async (req, res) => {
        currentUser = null;
        console.log('removed current user', currentUser);
        res.sendStatus(204);
    };

    const currentUserProfile = async (req, res) => {
        try {
            if (currentUser) {
                console.log('current user profile', currentUser);
                res.send(currentUser);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.send(error);
        }
    };

    const getEducations = async (req, res) => {
        try {
            const educationsResult = [];
            const docId = await findUserId(req);
            const snapshot = await admin
                .firestore()
                .collection('users')
                .doc(docId)
                .get();
            const educations = snapshot.data().educations;
            const promises = educations.map((doc) => doc.get());
            const snapshots = await Promise.all(promises);
            snapshots.forEach((snap) => {
                educationsResult.push(snap.data());
            });
            // console.log(educationsResult);
            res.send(educationsResult);
        } catch (error) {
            res.send(error);
        }
    };

    const addEducation = async (req, res) => {
        try {
            const createEduResponseRef =
                await educationController.createEducation(req);

            const docId = await findUserId(req);
            const userDocRef = admin.firestore().collection('users').doc(docId);

            userDocRef.update({
                educations:
                    admin.firestore.FieldValue.arrayUnion(createEduResponseRef),
            });

            res.send(createEduResponseRef);
        } catch (error) {
            res.send(error);
        }
    };

    const deleteEducation = async (req, res) => {
        try {
            const { education_id } = req.params;
            const { uid } = req.params;

            console.log('education_id', education_id);
            console.log('uid', uid);

            let education_doc_id;
            let eduDocRef;
            await db
                .collection('educations')
                .where('education_id', '==', education_id)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        eduDocRef = doc.ref;
                        education_doc_id = doc.id;
                    });
                });
            await educationController.deleteEducation(education_doc_id);

            const docId = await findUserId(req);
            const userDocRef = admin.firestore().collection('users').doc(docId);

            userDocRef.update({
                educations: admin.firestore.FieldValue.arrayRemove(eduDocRef),
            });

            res.send(education_doc_id);
        } catch (error) {
            res.send(error);
        }
    };

    return {
        getAllUsers,
        createDBUser,
        signUpUser,
        getUser,
        findUserUid,
        updateUser,
        deleteUser,
        deleteAuthUser,
        findUpdateUser,
        recordCurrentUser,
        removeCurrentUser,
        currentUserProfile,
        addEducation,
        getEducations,
        deleteEducation,
    };
};

module.exports = userController;
