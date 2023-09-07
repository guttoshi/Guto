const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
   if (!interaction.isChatInputCommand()) return;

   const localCommand = getLocalCommands();

   try {
      const commandObject = localCommand.find(
         (cmd) => cmd.name === interaction.commandName
      );

      if (!commandObject) return;

      if (commandObject.devOnly) {
         if (!devs.includes(interaction.member.id)) {
            interaction.reply({
               content: 'Somente desenvolvedores consegue usar esse comando.',
               ephemeral: true,
            });
            
            return;
         }
      }

      if (commandObject.testOnly) {
         if (!(interaction.guild.id === testServer)) {
            interaction.reply({
               content: 'Esse comando não pode ser usado aqui.',
               ephemeral: true,
            });
            
            return;
         }
      }

      if (commandObject.permissionsRequired?.length) {
         for (const permission of commandObject.permissionsRequired) {
            if (!interaction.member.permissions.has(permission)) {
               interaction.reply({
                  content: 'Você não tem permissões suficiente.',
                  ephemeral: true,
               });

               return;
            }
         }
      }

      if (commandObject.botPermissions?.length) {
         for (const permission of commandObject.botPermissions) {
            const bot = interaction.guild.members.me;

            if (!bot.permissions.has(permission)) {
               interaction.reply({
                  content: "Eu não tenho permissões suficiente.",
                  ephemeral: true,
               });

               return
            }
         }
      }

      await commandObject.callback(client, interaction)
   } catch (error) {
      console.log(`There was an error running this command ${error}.`)
   }
}