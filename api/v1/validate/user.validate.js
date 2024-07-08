const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{6,}$/;

module.exports.register = (req, res, next) => {
    if (!req.body.fullName) {
        return res.status(400).json({ "message": "Please provide your full name." });
    }
    if (!req.body.email) {
        return res.status(400).json({ "message": "Please provide your email address." });
    }
    if (!req.body.password) {
        return res.status(400).json({ "message": "Please provide a password." });
    }
    if (!req.body.confirmPassword) {
        return res.status(400).json({ "message": "Please confirm your password." });
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ "message": "Passwords do not match. Please try again." });
    }
    if (!regex.test(req.body.password)) {
        return res.status(400).json({ "message": "Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &, #)." });
    }
    return next();
}

module.exports.login = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ "message": "Please provide your email address." });
    }
    if (!req.body.password) {
        return res.status(400).json({ "message": "Please provide a password." });
    }
    return next();
}

module.exports.forgotPassword = (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ "message": "Please provide your email address." });
    }
    return next();
}