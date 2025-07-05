const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://subhanbv9494:i9XS36VZOdEmMdcq@quicklearn.rrfrliw.mongodb.net/devTinder"
    )
}

module.exports = connectDB;