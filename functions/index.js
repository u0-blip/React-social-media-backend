const functions = require('firebase-functions');

exports.creatScream = exports.getScreams = exports.helloWorld = void 0;

const admin = require('firebase-admin');
admin.initializeApp();

// firebase emulators:start --import=./data-path --export-on-exit --only firestore

admin.firestore().settings({
    host: "localhost:8080",
    ssl: false
});

db = admin.firestore()

import { getScream } from './handles/screams'
