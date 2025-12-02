const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, InteractionResponseType } = require('discord.js');
const fs = require('fs');
const UserHistory = require('../models/UserHistory');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears your chat history!')
        .addSubcommand(subcommand =>
            subcommand.setName('history')
                .setDescription('Clears your chat history!')

        ),
    async execute(interaction) {
        const userId = interaction.user.id;

        await UserHistory.deleteOne({ userId });


        await interaction.reply({ content: 'Your chat history has been cleared!', flags:MessageFlags.Ephemeral });
    }
}