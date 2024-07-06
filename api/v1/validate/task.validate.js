module.exports.create = (req, res, next) => {
    if (!req.body.title) {
        return res.status(400).json({ "message": "Fill out title field" });
    } else if (!req.body.timeStart) {
        return res.status(400).json({ "message": "Fill out time start field" });
    } else if (!req.body.timeFinish) {
        return res.status(400).json({ "message": "Fill out time finish field" });
    } else {
        return next();
    }
}