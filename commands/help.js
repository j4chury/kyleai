const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows all available commands of the bot.'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#374f2f')
            .setTitle('How to use Character AI BOT')
            .setDescription('Here are all the available commands of this bot:')
            .addFields(
                {
                    name: '⚙️ Configuration',
                    value: '`/set channel <#channel>` - Set the channel where the AI talks.'
                },
                {
                    name: '🤖 AI Commands',
                    value: '`(no slash)` Just talk in the configured channel and the AI will respond.'
                },
                {
                    name: '🔧 Utility',
                    value: '`/help` - Shows this help menu.\n`/clear history` - Clears your chat history with the bot.'
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
