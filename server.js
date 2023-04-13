const express = require('express')
const app = express()

const admin = require('firebase-admin')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
// const { getDatabase } = require('firebase-admin/database');
const credentials = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    // databaseURL: 'https://my-firebase-project-9e554-default-rtdb.firebaseio.com'
})

const db = getFirestore()

// const db = getDatabase();
// const ref = db.ref('server/saving-data/fireblog');

// const usersRef = ref.child('users');
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: 'June 23, 1912',
//     full_name: 'Alan Turing'
//   },
//   gracehop: {
//     date_of_birth: 'December 9, 1906',
//     full_name: 'Grace Hopper'
//   }
// });

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.post('/create', async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body
        const userJson = {
            email,
            firstName,
            lastName,
            createdAt: FieldValue.serverTimestamp(),
        }
        const response = await db.collection('users').add(userJson)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await db.collection('users').get()
        const usersJson = []
        users.forEach((user) => {
            usersJson.push({
                id: user.id,
                ...user.data(),
            })
        })
        res.send(usersJson)
    } catch (error) {
        res.send(error)
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await db.collection('users').doc(id).get()
        res.send(user.data())
    } catch (error) {
        res.send(error)
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { email, firstName, lastName } = req.body
        const userJson = {
            email,
            firstName,
            lastName,
            updatedAt: FieldValue.serverTimestamp(),
        }

        console.log(userJson, id)
        const response = await db.collection('users').doc(id).update(userJson)
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const response = await db.collection('users').doc(id).delete()
        res.send(response)
    } catch (error) {
        res.send(error)
    }
})

app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await admin.auth().createUser({
            email,
            password,
            emailVerified: false,
            disabled: false,
        })
        res.status(201).json({ user })
    } catch (error) {
        res.status(400).json({ error })
    }
})

// app.get('/users', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const users = await admin.auth().createUser({
//             email,
//             password,
//             emailVerified: false,
//             disabled: false,
//         });
//         res.status(201).json({ user });
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// })

// set post and listen for our requests.

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
