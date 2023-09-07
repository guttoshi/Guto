const { Client, Message } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const cooldowns = new Set();

function getRandomXp(min, max) {
   min = Math.ceil(min);
   max = Math.ceil(max);
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
   if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

   const xpToGive = getRandomXp(5, 15);

   const query = {
      userId: message.author.id,
      guildId: message.guild.id,
   }

   try {
      const level = await Level.findOne(query);

      if (level) {
         level.xp += xpToGive;

         if (level.xp > calculateLevelXp(level.level)) {
            level.xp = 0;
            level.level += 1;

            message.channel.send(`${message.member} você upou de nível! Seu nível atual agora é **${level.level}**!`);
         }

         await level.save().catch((e) => {
            console.log(`Error saving update level ${e}`);
            return;
         });
         cooldowns.add(message.author.id);
         setTimeout(() => {
            cooldowns.delete(message.author.id);
         }, 60000);
      } else {
         const newLevel = new Level({
            userId: message.author.id,
            guildId: message.guild.id,
            xp: xpToGive,
         });

         await newLevel.save();
      }
   } catch (error) {
      console.log(`Erro giving xp: ${error}`)
   }
}