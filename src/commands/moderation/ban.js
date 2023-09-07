const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, ApplicationCommandPermissionType } = require('discord.js')
const Banned = require('../../models/Banned');

module.exports = {
   /**
    * 
    * @param {Client} client 
    * @param {Interaction} interaction 
    */

   callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('id').value;
      const reason = interaction.options.get('reason')?.value || 'No reason provided';   
      
      await interaction.deferReply();

      try {
         const query = {
            userId: targetUserId,
            guildId: interaction.guild.id,
            banned: true,
         };

         banned = new Banned(query);

         await banned.save(); 
         await interaction.editReply(`O usuário com o id de ${targetUserId} teve o ban registrado na sua data com sucesso!\nRazão: ${reason}`)
      } catch (error) {
         console.log(`There was an error when banning: ${error}`);
      }
   },

   name: 'ban',
   description: 'Bane um membro do server.',
   // devOnly: Boolean,
   // testOnly: Boolean,
   // deleted: Boolean,
   options: [
      {
         name: 'id',
         description: 'O usúario que você deseja banir',
         type: ApplicationCommandOptionType.String,
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