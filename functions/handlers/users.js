const { db, admin, firebase } = require('../util/admin');
const config = require('../util/config')
const { uuid } = require('uuidv4');


const {
    validateSignupData,
    validateLoginData,
    reduce_user_details
} = require('../util/validators')

exports.edit_profile = (req, res) => {
    console.log(req.body)
    let userDetail = reduce_user_details(req.body);

    db.doc(`/user/${req.user.handle}`)
        .update(userDetail)
        .then(() => {
            return res.json({ message: "Details edited successfully" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
        })

}


exports.upload_profile_photo = (req, res) => {
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = new Busboy({ headers: req.headers })

    let image_to_be_uploaded = {};
    let image_file_name;
    let generated_token = uuid();

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        // console.log(fieldname, file, filename, encoding, mimetype);
        if (mimetype !== 'image/jpeg' && mimetype != 'image/png') {
            return res.status(400).json({ error: 'Wrong file type submitted' });
        }
        const image_extension = filename.split('.')[filename.split('.').length - 1];
        image_file_name = `${Math.round(
            Math.random() * 10000000000000
        ).toString()}.${image_extension}`;
        const file_path = path.join(os.tmpdir(), image_file_name);
        image_to_be_uploaded = { file_path, mimetype };
        file.pipe(fs.createWriteStream(file_path));
    });
    busboy.on('finish', () => {
        admin
            .storage()
            .bucket()
            .upload(image_to_be_uploaded.file_path, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: image_to_be_uploaded.mimetype,
                        firebaseStorageDownloadTokens: generated_token,
                    },
                },
            })
            .then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${image_file_name}?alt=media&token=${generated_token}`;
                return db.doc(`/user/${req.user.handle}`).update({ imageUrl });
            })
            .then(() => {
                return res.json({ message: 'image uploaded successfully' });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: 'something went wrong' });
            });
    });
    busboy.end(req.rawBody);

}

exports.get_posts_for_user = (req, res) => {
    // getting the details about the handle, email
    let userData = {};
    db
        .doc(`/user/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return db
                    .collection('scream')
                    .where('handle', '==', req.user.handle)
                    .orderBy('createdAt', 'desc')
                    .get();
            } else {
                return res.status(404).json({ error: "user not found" });
            }
        })
        .then((data) => {
            userData.screams = [];
            data.forEach((doc) => {
                userData.screams.push({
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                    handle: doc.data().handle,
                    userImage: doc.data().userImage,
                    likeCount: doc.data().likeCount,
                    commentCount: doc.data().commentCount,
                    screamId: doc.id,
                })
            })
            return res.status(200).json({ userData });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}


exports.Delete_user = (req, res) => {
    let handle = req.user.handle;
    let userDoc = db
        .collection('user')
        .where('handle', '==', handle)
        .limit(1)

    userDoc
        .get()
        .then((doc) => {
            if (doc.empty) {
                return res.status(404).json({ error: 'user not found' });
            } else {
                return db
                    .doc(`/user/${doc.docs[0].id}`)
                    .delete();
            }
        })
        .then(() => {
            res.json({ message: 'user deleted successfully' });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        });
}

exports.sign_up = (req, res) => {
    const newUser = {
        email: req.body.email,
        handle: req.body.handle,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        createAt: new Date().toISOString()
    };

    const { valid, errors } = validateSignupData(newUser);
    if (!valid) return res.status(400).json(errors);

    const noImg = 'no-img.png';

    let token, userId;
    db.doc(`/user/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' });
            } else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((created_data) => {
            userId = created_data.user.uid;
            return created_data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createAt: new Date().toISOString(),
                //TODO append token to imageURL
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
                userId: userId,
            }
            return db.doc(`/user/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.status(201).json({ token })
        })
        .catch((err) => {
            console.log(err);
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({ email: "Email is already in user" });
            } else if (err.code === 'auth/weak-password') {
                return res.status(400).json({ password: err.message })
            } else {
                return res
                    .status(500)
                    .json({ general: 'Something went wrong' })
            }
        })
}


exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);

    if (!valid) { return res.status(400).json(errors); }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return res.json({ token });
        })
        .catch((err) => {
            console.error(err);
            //wrong password
            //user not user
            return res
                .status(403)
                .json({ general: 'Wrong credentials, please try again ' });
        });
}


exports.getAuthenticatedUser = (req, res) => {
    let user_data = {};
    db
        .doc(`/user/${req.user.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                user_data.credentials = doc.data();
                return db
                    .collection('likes')
                    .where('handle', '==', req.user.handle)
                    .get();
            } else {
                return res.status(404).json({ error: "user doesn\'t exist" });
            }
        })
        .then((likes_ss) => {
            user_data.likes = [];
            likes_ss.forEach((likes_doc) => {
                user_data.likes.push(likes_doc.data());
            });
            return db
                .collection('notifications')
                .where('recipient', '==', req.user.handle)
                .orderBy('createAt', 'desc')
                .limit(10)
                .get();
        })
        .then((notifications_ss) => {
            user_data.notifications = [];
            notifications_ss.forEach((doc) => {
                let data = doc.data();
                user_data.notifications.push({
                    recipient: data.recipient,
                    sender: data.sender,
                    createAt: data.createAt,
                    screamId: data.screamId,
                    type: data.type,
                    seen: data.seen,
                    opened: data.opened,
                    notification_id: doc.id,
                });
            });
            return res.json(user_data);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
}

