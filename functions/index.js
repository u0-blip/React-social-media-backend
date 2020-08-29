const functions = require('firebase-functions');
const { db } = require('./util/admin');
const app = require('express')();
const FBAuth = require('./util/fbAuth')

const cors = require('cors');

app.use(cors());

const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream
} = require('./handlers/screams');

const {
    sign_up,
    login,
    Delete_user,
    get_posts_for_user,
    upload_profile_photo,
    edit_profile,
    getAuthenticatedUser
} = require('./handlers/users');

// Scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);
app.get('/scream/:screamId', FBAuth, getScream);
app.delete('/scream/:screamId', FBAuth, deleteScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);

// User routes
app.post('/user/signup', sign_up);
app.post('/user/login', login);

app.delete('/user', FBAuth, Delete_user);
app.post('/user', FBAuth, edit_profile);
app.get('/user', FBAuth, getAuthenticatedUser);

app.get('/user/:handle', FBAuth, get_posts_for_user);
app.post('/user/photo', FBAuth, upload_profile_photo);

exports.api = functions.https.onRequest(app);