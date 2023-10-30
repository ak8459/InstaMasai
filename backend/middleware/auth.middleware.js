const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'user-key', (err, decoded) => {
            if (decoded) {
                req.body.email = decoded.email
                req.body.userId = decoded.userId
                next()
            } else {
                res.status(401).send('Unauthorized')
            }
        });

    } else {
        res.status(401).send('Unauthorized')
    }
}


module.exports = { auth } 