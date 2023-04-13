const express = require('express');
const app = express();

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
// const { getDatabase } = require('firebase-admin/database');
const credentials = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    // databaseURL: 'https://my-firebase-project-9e554-default-rtdb.firebaseio.com'
});

const db = getFirestore();

const users = require('./src/routes/users')(db);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', users);

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        });
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
