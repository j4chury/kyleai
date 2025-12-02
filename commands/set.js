const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Bot guild configuration')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand=>
            subcommand
                .setName('channel')
                .setDescription('Set the AI character channel for this guild.')
                .addChannelOption(option =>
                    option.setName('channel')
                    .setDescription('Channel to set.')
                    .setRequired(true)
            )
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({ content: "You don't have permission to use this command.", ephemeral: true });
        }
        if (interaction.options.getSubcommand() === 'channel') {


            const channel = interaction.options.getChannel('channel');
            const guildId = interaction.guild.id;


            let config = await GuildConfig.findOne({ guildId });
            if (!config) {
                config = await GuildConfig.create({
                    guildId,
                    channelId: channel.id
                });
            } else {
                config.channelId = channel.id;
                await config.save();
            }
        
            await interaction.reply(`Channel set as: ${channel}`);
        }
    }
};