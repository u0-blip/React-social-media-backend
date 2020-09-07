const { admin, db } = require('../util/admin');

exports.markNotificationsSeen = (req, res) => {
    // res body will have array of notification ids to be mark read

    req.body.map((notId) => {
        let notdoc = db.doc(`/notifications/${notId}`);
        notdoc
            .get()
            .then((doc) => {
                if (doc.exists) {
                    notdoc.update({ seen: true });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: err.code })
            })
    })
    return res.status(200).json('Successful');

};

exports.markNotificationsOpen = (req, res) => {
    // res body will have array of notification ids to be mark read

    req.body.map((notId) => {
        let notdoc = db.doc(`/notifications/${notId}`);
        notdoc
            .get()
            .then((doc) => {
                if (doc.exists) {
                    notdoc.update({ opened: true });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: err.code })
            })
    })
    return res.status(200).json('Successful');

};