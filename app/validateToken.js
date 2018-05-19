const jwt = require('jsonwebtoken');
const User = require('./schemas/user');

module.exports = (req, res, next) => {
    const headerToken = req.headers['authorization'];
    if(typeof headerToken !== 'undefined') {
        const tokenArr = headerToken.split(' ');
        const tokenKey = tokenArr[1];
        let user = jwt.verify(tokenKey, 'shh');
        User.findOne({ _id: user.id })
            .then(user => {
                if ( user._id != null ) {
                    req.id = user._id;
                    next();
                } else {
                    next();
                }
            }).catch(() => {
                next();
            });
    } else {
        next();
    }
};