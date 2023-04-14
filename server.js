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

const users = require('./src/routes/users')(db, admin);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', users);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
