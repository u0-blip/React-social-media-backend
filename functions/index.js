const functions = require('firebase-functions');
const { db } = require('./util/admin');
const FBAuth = require('./util/fbAuth')
const app = require('express')();

const cors = require('cors');

app.use(cors());

const {
    getAllScreams,
    postOneScream,
    getScream,
    commentOnScream,
    likeScream,
    unlikeScream,
    deleteScream,
} = require('./handlers/screams');

const {
    sign_up,
    login,
    Delete_user,
    get_posts_for_user,
    upload_profile_photo,
    edit_profile,
    getAuthenticatedUser,
    getThumbFromHandle
} = require('./handlers/users');


const {
    markNotificationsSeen,
    markNotificationsOpen,
} = require('./handlers/notifications')

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

app.get('/user/posts', FBAuth, get_posts_for_user);
app.post('/user/photo', FBAuth, upload_profile_photo);

// Notification routes
app.post('/notifications/seen', FBAuth, markNotificationsSeen);
app.post('/notifications/open', FBAuth, markNotificationsOpen);

exports.api = functions.https.onRequest(app);

exports.createNotificationsOnLike = functions
    .firestore.document('likes/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/scream/${snapshot.data().screamId}`)
            .get()
            .then((doc) => {
                if (
                    doc.exists &&
                    doc.data().handle !== snapshot.data().handle
                ) {
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        createAt: new Date().toISOString(),
                        recipient: doc.data().handle,
                        sender: snapshot.data().handle,
                        type: 'like',
                        seen: false,
                        opened: false,
                        screamId: doc.id
                    });
                }
            })
            .catch((err) => console.error(err));
    });

exports.deleteNotificationsOnUnLike = functions
    .firestore.document('likes/{id}')
    .onDelete((snapshot) => {
        return db
            .doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch((err) => {
                console.error(err);
                return;
            });
    });

exports.createNotificationsOnComment = functions
    .firestore.document('comments/{id}')
    .onCreate((snapshot) => {
        return db
            .doc(`/scream/${snapshot.data().screamId}`)
            .get()
            .then((doc) => {
                if (doc.exists && doc.data().handle !== snapshot.data().handle) {
                    return db
                        .doc(`/notifications/${snapshot.id}`).set({
                            createAt: new Date().toISOString(),
                            recipient: doc.data().handle,
                            sender: snapshot.data().handle,
                            type: 'comment',
                            seen: false,
                            opened: false,
                            screamId: doc.id
                        });
                }
            })
            .catch((err) => {
                console.error(err);
                return;
            })
    })

exports.onUserImagechange = functions
    .firestore.document('/users/{userId}')
    .onUpdate((change) => {
        console.log(change.before.data());
        console.log(change.after.data());
        if (change.before.data().img_url != change.after.data().img_url) {
            console.log('image has changed');
            const batch = db.batch();
            return db
                .collection('scream')
                .where('handle', '==', change.before.data().handle)
                .get()
                .then((data) => {
                    data.forEach((doc) => {
                        const scream = db.doc(`/scream/${doc.id}`);
                        batch.update(scream, { userImage: change.after.data().img_url });
                    });
                    return batch.commit();
                });
        } else return true;
    })

exports.onScreamDelete = functions
    .firestore.document('/scream/{screamId}')
    .onDelete((snapshot, context) => {
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db
            .collection('comments')
            .where('screamId', '==', screamId)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/comments/${doc.id}`));
                });
                return db
                    .collection('likes')
                    .where('screamId', '==', screamId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db
                    .collection('notifications')
                    .where('screamId', '==', screamId)
                    .get();
            })
            .then((data) => {
                data.forEach((doc) => {
                    batch.delete(db.doc(`/notificaitons/${doc.id}`));
                });
                return batch.commit();
            })
            .catch((err) => console.error(err));

    });
