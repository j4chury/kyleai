const mongoose = require("mongoose");

const UserHistorySchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    messages: [
        {
            role: { type: String, required: true },
            content: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("UserHistory", UserHistorySchema);