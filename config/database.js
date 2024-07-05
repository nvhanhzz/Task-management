const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect db success!");
    } catch (error) {
        console.log("Connect db fail!");
    }
}