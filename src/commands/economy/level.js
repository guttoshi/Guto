const { Client, Interaction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const canvacord = require('canvacord');
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
   /**
    * 
    * @param {Client} client 
    * @param {interaction} interaction 
    */
   callback: async (client, interaction) => {
      if (!interaction.inGuild()){
         interaction.reply("Você só pode usar esse comando em um servidor!");
         return;
      }

      await interaction.deferReply();

      const mentionedUserId = interaction.options.get('target-user')?.value;
      const targetUserId = mentionedUserId || interaction.member.id;
      const targetUserObject = await interaction.guild.members.fetch(targetUserId);

      const fetchedLevel = await Level.findOne({
         userId: targetUserId,
         guildId: interaction.guild.id,
      });

      if (!fetchedLevel) {
         interaction.editReply(
            mentionedUserId ? `${targetUserObject.user.tag} não tem nenhum level por enquanto. Tente novamente quando ele(a) conversarem um pouco mais!`
            : "Você não tem nenhum nível. Converse um pouco e tente novamente!"
         );
         return;
      }

      let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

      allLevels.sort((a, b) => {
         if (a.level == b.level) {
            return b.xp - a.xp;
         } else {
            return b.level - a.level;
         }
      });

      let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

      const rank = new canvacord.Rank()
         .setAvatar(targetUserObject.user.displayAvatarURL({ size: 256 }))
         .setRank(currentRank)
         .setLevel(fetchedLevel.level)
         .setCurrentXP(fetchedLevel.xp)
         .setRequiredXP(calculateLevelXp(fetchedLevel.level))
         .setStatus(targetUserObject.presence.status)
         .setProgressBar('#FFC300', 'COLOR')
         .setUsername(targetUserObject.user.username)
         .setDiscriminator(targetUserObject.user.discriminator);

      const data = await rank.build();
      const attachment = new AttachmentBuilder(data);
      interaction.editReply({ files: [attachment] });
   },

   name: 'level',
   description: "Mostra o nível de você/alguém.",
   options: [
      {
         name: 'target-user',
         description: 'O usuário destinado para ver o nível',
         type: ApplicationCommandOptionType.Mentionable,
      }
   ]
}