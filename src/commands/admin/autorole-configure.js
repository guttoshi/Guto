const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   * 
   * @param {Client} client
   * @param {Interaction} interaction
   */
  
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("Você só pode usar esse comando em um servidor!");
      return;
    }

    const targetRoleId = interaction.options.get('role').value;

    try {
      await interaction.deferReply();

      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        if (autoRole.roleId === targetRoleId) {
          interaction.editReply("Cargo automático já foi configurado nesse servidor. Use /autorole-disable para remover!");
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        })

        await autoRole.save();
        interaction.editReply("Cargo automático foi configurado com sucesso! Use /autorole-disable para remover.")
      }
    } catch (error) {
      console.log(``)
    }
  },

  name: 'autorole-configure',
  description: "Configure o cargo automático para este server!",
  options: [
    {
      name: 'role',
      description: "O cargo que você quer que as pessoas ganhem na entrada",
      type: ApplicationCommandOptionType.Role,
      required: true,
    }
  ],
  permissionRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
}