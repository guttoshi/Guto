const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'daily',
  description: 'Colete suas diárias!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'Você já coletou sua recompensa diária! Tente novamente mais tarde.'
          );
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      const dailyAmount = Math.random(1000, 5000);

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} foi adicionado em sua conta. Sua nova quantia é ${user.balance}`
      );
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};  