const jwt = require('jsonwebtoken');
const User = require("../models/user.model");

const verifyToken = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (err) {
        console.error('Error verifying token:', err);
        return null;
    }
}

module.exports.checkToken = (options = {}) => {
    const { tokenName, type } = options;

    return async (req, res, next) => {
        if (!req.cookies || !req.cookies[tokenName]) {
            return next();
        }

        const token = req.cookies[tokenName];
        const key = process.env.JWT_SIGNATURE;
        const decoded = verifyToken(token, key);

        if (!decoded) {
            res.clearCookie(tokenName);
            return next();
        }

        try {
            const user = await User.findOne({
                _id: decoded.id,
                deleted: false
            }).select("-password");

            if (!user) {
                res.clearCookie(tokenName);
                return next();
            }

            if (type) {
                req[type] = user;
            }

            return next();
        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.currentUser) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    return next();
}

module.exports.isLoggedOut = (req, res, next) => {
    if (req.currentUser) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    return next();
}