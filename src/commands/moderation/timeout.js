const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const ms = require('ms')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interact 
     */
   callback: async (client, interaction) => {
      const mentionable = interaction.options.get('target-user').value;
      const duration = interaction.options.get('duration').value;
      const reason = interaction.options.get('reason')?.value || 'No reason provided.';

      await interaction.deferReply();

      const targetUser = await interaction.guild.members.fetch(mentionable);
      
      if (!targetUser) {
         await interaction.editReply("Esse usúario não existe no servidor.");
         return;
      }
      
      if (targetUser.user.bot) {
         await interaction.editReply("Não consigo castigar um bot.");
         return;
      }

      const msDuration = ms(duration);
      if (isNaN(msDuration)) {
         await interaction.editReply("Porfavor, me provenha uma duração valida.");
         return;
      }

      if (msDuration < 5000 || msDuration > 2.419e9) {
         await interaction.editReply("Duração do castigo não pode ser menor que 5 segundos ou maior que 28 dias");
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

      // Castigue o usuário
      try {
         const { default: prettyMs } = await import('pretty-ms');

         if (targetUser.isCommunicationDisabled()) {
            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} castigo foi atualizado para ${prettyMs(msDuration, { verbose: true })}.\n Razão: ${reason}`);
            return;
         }

         await targetUser.timeout(msDuration, reason);
         await interaction.editReply(`Castigado foi colocado em ${targetUser} por ${prettyMs(msDuration, { verbose: true })}.\n Razão: ${reason}`);
      } catch (error) {
         console.log(`There was an error when timing out: ${error}`);
      }
   },

   name: 'timeout',
   description: 'Timeout a user',
   options: [
      {
         name: 'target-user',
         description: 'A pessoa que você quer castigar.',
         type: ApplicationCommandOptionType.Mentionable,
         required: true,
      },
      {
         name: 'duration',
         description: 'Duração do castigo (30m, 1h, 1day).',
         type: ApplicationCommandOptionType.String,
         required: true,
      },
      {
         name: 'reason',
         description: 'A razão pelo castigo.',
         type: ApplicationCommandOptionType.String,
      }
   ],
   permissionsRequired: [PermissionFlagsBits.MuteMembers],
   botPermissions: [PermissionFlagsBits.MuteMembers],
}