require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandsFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

async function deploy() {
    try {
        console.log(`Deploying slash commands...`);

        await rest.put(
            Routes.applicationCommands(process.env.BOT_ID),
            { body: commands }
        );

        console.log(`Slash commands deployed successfully.`);
    } catch (error) {
        console.error(error);
    }
}

deploy();