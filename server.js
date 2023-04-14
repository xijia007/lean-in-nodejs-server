const express = require('express');
const cors = require('cors');

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const credentials = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(cors());

const db = getFirestore();

const users = require('./src/routes/users')(db);
const userController = require('./src/controllers/userController')(db);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', users);

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResponse = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        });
        const uid = userResponse.uid;

        await userController.createUser(req, res, uid);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
