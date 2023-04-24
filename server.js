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
const jobs = require('./src/routes/jobs')(db);
const companies = require('./src/routes/companies')(db);
const educations = require('./src/routes/educations')(db);
const experiences = require('./src/routes/experiences')(db);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/jobs', jobs);
app.use('/companies', companies);
app.use('/educations', educations);
app.use('/experiences', experiences);
app.use('/', (req, res) => {
    res.send('Hi!, Welcome to the LeanIn API Server.');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
