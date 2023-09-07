require('dotenv').config();
const { Client, IntentsBitField } = require("discord.js");
const { default: mongoose } = require('mongoose');
const eventhandler = require('./handlers/eventhandler');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ],
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB.");

        eventhandler(client);

        client.login(process.env.TOKEN);
    } catch (error) {
        console.log(`Error ${error}`)
    }
})();