const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// firebase emulators:start --import=./data-path --export-on-exit --only firestore

admin.firestore().settings({
    host: "localhost:8080",
    ssl: false
});

db = admin.firestore()



exports.getScream = functions.https.onRequest((req, res) => {
    db.collection('scream').get()
        .then(data => {
            const screams = [];
            data.forEach(doc => {
                screams.push(doc.data());
            });
            return res.json(screams);
        })
        .catch(err => console.error());
});

exports.postOneScream = functions.https.onRequest((req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    db
        .collection('scream')
        .add(newScream)
        .then((doc) => {
            res.json({ message: `document ${doc.id} created successfully` });
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.log(err);
        });
});

exports.deleteScream = functions.https.onRequest((req, res) => {
    const document = db.doc(`/scream/${req.query.screamId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' });
            } else {
                return document.delete();
            }
        })
        .then(() => {
            res.json({ message: 'Scream deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
});

exports.likeScream = functions.https.onRequest((req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.query.userHandle)
        .where('screamId', '==', req.query.screamId)
        .limit(1);

    const screamDocument = db.doc(`/scream/${req.query.screamId}`);
    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'Scream not found' });
            }
        })
        .then((data) => {
            if (data.empty) {
                const new_like = {
                    userHandle: req.query.userHandle,
                    screamId: req.query.screamId
                }
                db
                    .collection('likes')
                    .add(new_like)
                    .then(() => {
                        screamData.likeCount++;
                        // actually update the data in the database
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        return res.json(screamData)
                    })
            } else {
                return res.status(400).json({ error: 'Scream already liked' })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })

});

exports.unlikeScream = functions.https.onRequest((req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('userHandle', '==', req.query.userHandle)
        .where('screamId', '==', req.query.screamId)
        .limit(1);

    const screamDocument = db.doc(`/scream/${req.query.screamId}`);
    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
                return likeDocument.get()
            } else {
                return res.status(404).json({ error: 'Scream not found' });
            }
        })
        .then((data) => {
            if (data.empty) {
                return res.status(400).json({ error: 'Scream not liked' });
            } else {
                return db
                    .doc(`/likes/${data.docs[0].id}`)
                    .delete()
                    .then(() => {
                        screamData.likeCount--;
                        return screamDocument.update({ likeCount: screamData.likeCount });
                    })
                    .then(() => {
                        res.json(screamData);
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })

});

exports.commentOnScream = functions.https.onRequest((req, res) => {

    const screamDocument = db.doc(`/scream/${req.query.screamId}`);
    let screamData;

    screamDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                screamData = doc.data();
                screamData.screamId = doc.id;
            } else {
                return res.status(404).json({ error: 'Scream not found' });
            }
        })
        .then(() => {
            const new_comment = {
                userHandle: req.query.userHandle,
                screamId: req.query.screamId,
                body: req.body.comment,
                createAt: admin.firestore.Timestamp.fromDate(new Date())
            }
            db
                .collection('comments')
                .add(new_comment)
                .then(() => {
                    screamData.commentCount++;
                    // actually update the data in the database
                    // return screamDocument.update({ commentCount: screamData.commentCount });
                })
                .then(() => {
                    return res.json(screamData)
                })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })

});


exports.deleteComment = functions.https.onRequest((req, res) => {
    const commentDocument = db.doc(`/comments/${req.query.commentId}`)

    commentDocument
        .get()
        .then((doc) => {
            if (doc.exists) {
                return commentDocument.get()
            } else {
                return res.status(404).json({ error: 'Comment not found' });
            }
        })
        .then(() => {
            return db
                .doc(`/comments/${req.query.commentId}`)
                .delete()
                .then(() => {
                    // screamData.likeCount--;
                    // Todo, create reference from the scream to the comments
                    // return screamDocument.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    res.json(`delete ${req.query.commentId} successfully`);
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
});
//# sourceMappingURL=index.js.map