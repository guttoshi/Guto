const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "Você só pode usar esse comando em um server.",
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`${(await interaction.guild.members.fetch(targetUserId)).user.globalName} não tem um perfil por agora.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
        ? `Você tem atualmente **${user.balance}** Dabloon(s).`
        : `Na conta do(a) ${(await interaction.guild.members.fetch(targetUserId)).user.globalName} há **${user.balance}** Dabloon(s).`
    );
  },

  name: 'balance',
  description: "Veja a conta de alguém ou de você mesmo",
  options: [
    {
      name: 'user',
      description: 'O usuário que você deseja ver',
      type: ApplicationCommandOptionType.User,
    }
  ]
}