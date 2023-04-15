const { FieldValue } = require('firebase-admin/firestore');

const userController = (db, admin) => {
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

    return {
        getAllUsers,
        createDBUser,
        signUpUser,
        getUser,
        findUserUid,
        updateUser,
        deleteUser,
    };
};

module.exports = userController;
