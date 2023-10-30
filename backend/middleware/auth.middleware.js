const jwt = require('jsonwebtoken');
const { blacklist } = require('../blacklist')
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        if (blacklist?.includes(token)) {
            res.send(401).send({ "message": "please login again!" })
        }
        jwt.verify(token, 'user-key', (err, decoded) => {
            if (decoded) {
                // console.log(decoded);
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