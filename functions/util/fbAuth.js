const { admin, db } = require('./admin')

module.exports = (req, res, next) => {
    let id_token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        id_token = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    admin
        .auth()
        .verifyIdToken(id_token)
        .then((decoded_token) => {
            req.user = decoded_token;
            return db
                .collection('user')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then((user) => {
            req.user.handle = user.docs[0].data().handle;
            req.user.imageUrl = user.docs[0].data().imageUrl;
            return next();
        })
        .catch((err) => {
            console.error('Error while verifying token ', err);
            return res.status(403).json(err);
        })
}