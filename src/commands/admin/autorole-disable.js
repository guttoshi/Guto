const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply("Cargo automático não foi configurado para este server. Use /autorole-configure para configurar");
        return;
      }

      await AutoRole.findOneAndDelete({ gildId: interaction.guild.Id });
      interaction.editReply("Cargo automático foi desativado para este servidor. Use /autorole-configure para configurar de novo!");
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-disable',
  description: "Desative o cargo automático para este servidor",
  permissionRequired: [PermissionFlagsBits.Administrator],
}