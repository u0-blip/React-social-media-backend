const { admin, db } = require('../util/admin');



exports.getAllScreams = (req, res) => {


    db.collection('scream')
        .orderBy('createAt', 'desc')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    handle: doc.data().handle,
                    createAt: doc.data().createAt,
                    commentCount: doc.data().commentCount,
                    likeCount: doc.data().likeCount,
                    userImage: doc.data().userImage
                });
            });
            return res.json(screams);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
};

exports.getScream = (req, res) => {

    const getThumbFromHandle = (handle, data) => {
        return db.doc(`/user/${handle}`)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    data.imageUrl = doc.data().imageUrl;
                } else {
                    data.imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`;
                }
            })
    }

    let screamData = {};
    db.doc(`/scream/${req.params.screamId}`)
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' });
            }
            screamData = doc.data();
            screamData.screamId = doc.id;
            return db
                .collection('comments')
                .orderBy('createAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then((data) => {
            screamData.comments = [];
            data.forEach((doc) => {
                let commentData = doc.data();
                getThumbFromHandle(commentData.handle, commentData)
                    .then(() => {
                        screamData.comments.push(commentData);
                    })
            });
        })
        .then(() => {
            return db
                .collection('likes')
                .orderBy('createAt', 'desc')
                .where('screamId', '==', req.params.screamId)
                .get();
        })
        .then((data) => {
            screamData.likes = [];
            data.forEach((doc) => {
                screamData.likes.push(doc.data());
            });
            return res.json(screamData);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
};

exports.postOneScream = (req, res) => {
    const newScream = {
        body: req.body.body,
        handle: req.user.handle,
        userImage: req.user.imageUrl,
        createAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };
    db
        .collection('scream')
        .add(newScream)
        .then((doc) => {
            const resScream = newScream;
            resScream.screamId = doc.id;
            res.json(resScream);
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.log(err);
        });
};

exports.deleteScream = (req, res) => {
    const document = db.doc(`/scream/${req.params.screamId}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return res.status(404).json({ error: 'Scream not found' });
            } else if (doc.data().handle != req.user.handle) {
                return res.status(500).json({ error: 'You cannot delete this post!' })
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
};


exports.likeScream = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('handle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/scream/${req.params.screamId}`);
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
                    handle: req.user.handle,
                    screamId: req.params.screamId
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

};

exports.unlikeScream = (req, res) => {
    const likeDocument = db
        .collection('likes')
        .where('handle', '==', req.user.handle)
        .where('screamId', '==', req.params.screamId)
        .limit(1);

    const screamDocument = db.doc(`/scream/${req.params.screamId}`);
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

};

exports.commentOnScream = (req, res) => {

    const screamDocument = db.doc(`/scream/${req.params.screamId}`);
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
                handle: req.user.handle,
                screamId: req.params.screamId,
                body: req.body.comment,
                createAt: new Date().toISOString()
            }
            db
                .collection('comments')
                .add(new_comment)
                .then(() => {
                    screamData.commentCount++;
                    // actually update the data in the database
                    return screamDocument.update({ commentCount: screamData.commentCount });
                })
                .then(() => {
                    return res.json(screamData)
                })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })

};


exports.deleteComment = (req, res) => {
    const commentDocument = db.doc(`/comments/${req.params.commentId}`)

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
                .doc(`/comments/${req.params.commentId}`)
                .delete()
                .then(() => {
                    // screamData.likeCount--;
                    // Todo, create reference from the scream to the comments
                    // return screamDocument.update({ likeCount: screamData.likeCount });
                })
                .then(() => {
                    res.json(`delete ${req.params.commentId} successfully`);
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code })
        })
};

