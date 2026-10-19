const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const isLogin = (req, res, next) => {
    // 1. check header from request
    const authHeader = req.headers.authorization;

    // 2. this header have token or not
    if (!authHeader) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized.'
        });
    }

    // 3. catch only token from header
    const token = authHeader.split(' ')[1];
    try {
        // 4. compare token with jwt secret key
        const decoded = jwt.verify(token, jwtConfig.secret);

        // 5. store the decoded in the request object for use later
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized.'
        });
    }
}

module.exports = isLogin;