const { Schema, model } = require('mongoose');

const guildConfigSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, default: null }
});

module.exports = model("GuildConfig", guildConfigSchema);