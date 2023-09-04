const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
   /**
    * 
    * @param {Client} client 
    * @param {Interaction} interaction 
    */

   callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-user').value;
      const reason = interaction.options.get('reason')?.value || "No reason provided";

      await interaction.deferReply();
   
      const targetUser = await interaction.guild.members.fetch(targetUserId);

      if (!targetUser) {
         await interaction.editReply("That user doesn't exist in this server.");
         return;
      }

      if (targetUser.id === interaction.guild.ownerId) {
         await interaction.editReply("You can't ban that user because they're the server owner.");
         return;
      }

      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
   
      if (targetUserRolePosition >= requestUserRolePosition) {
         await interaction.editReply("Você não pode banir um membro que tem um cargo igual/superior ao seu.");
         return;
      }

      if (targetUserRolePosition >= botRolePosition) {
         await interaction.editReply("Eu não consigo banir essa pessoa porque não tenho um cargo superior a ele(a).")
         return;
      }

      // Ban the target

      try {
         await targetUser.ban({ reason });
         await interaction.editReply(`Usuário ${targetUser} foi banido\n Razão: ${reason}`)
      } catch (error) {
         console.log(`There was an error when banning: ${error}`)
      }
   },

   name: 'ban',
   description: 'Bane um membro do server.',
   // devOnly: Boolean,
   // testOnly: Boolean,
   // deleted: Boolean,
   options: [
      {
         name: 'target-user',
         description: 'O usúario que você deseja banir',
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