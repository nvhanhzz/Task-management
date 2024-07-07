module.exports.create = (req, res, next) => { // use for create and update
    if (!req.body.title) {
        return res.status(400).json({ "message": "Please provide a title." });
    }
    if (!req.body.timeStart) {
        return res.status(400).json({ "message": "Please provide a start time." });
    }
    if (!req.body.timeFinish) {
        return res.status(400).json({ "message": "Please provide a finish time." });
    }
    return next();
}