const express = require('express');
const router = express.Router();
const { FieldValue } = require('firebase-admin/firestore');
module.exports = (db) => {
    router.get('/', async (req, res) => {
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
    });

    router.post('/create', async (req, res) => {
        try {
            const { email, firstName, lastName } = req.body;
            let userJson = {
                email,
                firstName,
                lastName,
                createdAt: FieldValue.serverTimestamp(),
            };

            userJson = JSON.parse(JSON.stringify(userJson));

            const response = await db.collection('users').add(userJson);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const user = await db.collection('users').doc(id).get();
            res.send(user.data());
        } catch (error) {
            res.send(error);
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { email, firstName, lastName } = req.body;
            let userJson = {
                email,
                firstName,
                lastName,
                updatedAt: FieldValue.serverTimestamp(),
            };
            userJson = JSON.parse(JSON.stringify(userJson));

            console.log(userJson, id);
            const response = await db
                .collection('users')
                .doc(id)
                .update(userJson);
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const response = await db.collection('users').doc(id).delete();
            res.send(response);
        } catch (error) {
            res.send(error);
        }
    });

    return router;
};

// module.exports = router
