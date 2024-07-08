const jwt = require('jsonwebtoken');

module.exports.generateToken = (res, userId, exp, tokenName) => {
    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SIGNATURE, { expiresIn: exp });

    res.cookie(tokenName, token, {
        httpOnly: true,
        //        secure: !isDevelopment, Chỉ thiết lập secure khi không ở môi trường phát triển
        sameSite: 'strict',
        maxAge: exp * 1000
    });
}