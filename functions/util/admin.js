const admin = require('firebase-admin');
const firebase = require("firebase");
const config = require('../util/config')

admin.initializeApp();
firebase.initializeApp(config);

// firebase emulators:start --import=./data-path --export-on-exit --only firestore

// admin.firestore().settings({
//     // host: "localhost:8080",
//     ssl: false
// });

let db = admin.firestore();

module.exports = { admin, db, firebase };