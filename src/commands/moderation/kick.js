const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
   /**
    * 
    * @param {Client} client 
    * @param {Interaction} interaction 
    */

   callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-user').value;
      const reason = interaction.options.get('reason')?.value || "Nenhuma razão provida.";

      await interaction.deferReply();
   
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
         await interaction.editReply("Esse usúario não existe nesse server");
         return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
         await interaction.editReply("Você não pode expulsar essa pessoa porque ele é o dono do servidor.");
         return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
   
      if (targetUserRolePosition > requestUserRolePosition) {
         await interaction.editReply("Você não pode remover essa pessoa porque ela tem um cargo maior/igual ao seu.");
         return;
      }

      if (targetUserRolePosition >= botRolePosition) {
         await interaction.editReply("Você não pode remover essa pessoa porque eu não tenho um cargo superior a ele(a).")
         return;
      }

      // Ban the target

      try {
         await targetUser.kick(reason);
         await interaction.editReply(`Usúario ${targetUser} foi banido\n Razão: ${reason}`)
      } catch (error) {
         console.log(`There was an error when banning: ${error}`)
      }
   },

   name: 'kick',
   description: 'Remove um membro do server.',
   // devOnly: Boolean,
   // testOnly: Boolean,
   options: [
      {
         name: 'target-user',
         description: 'O usúario que você deseja remover',
         type: ApplicationCommandOptionType.Mentionable,
         required: true,
      },
      {
         name: 'reason',
         description: 'A razão por trás disso',
         type: ApplicationCommandOptionType.String,
      },
   ],
   permissionsRequired: [PermissionFlagsBits.Administrator],
   botPermissions: [PermissionFlagsBits.Administrator],

}