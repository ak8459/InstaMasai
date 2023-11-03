const jwt = require('jsonwebtoken');
const { BlackListModel } = require('../model/token.model')
const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    try {

        let existingToken = await BlackListModel.find({
            blackList: { $in: token }
        });


        if (existingToken.length > 0) {
            return res.status(401).send('please login again')
        } else {

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
        }
    } catch (error) {
        res.status(401).send('Unauthorized')
    }

}


module.exports = { auth } 