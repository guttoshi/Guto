const { Client, GuildMember } = require('discord.js');
const AutoRole = require('../../models/AutoRole');
const Banned = require('../../models/Banned');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const autoRole = await AutoRole.findOne({ guildId: guild.id });
    if (!autoRole) return;

    const query = {
      userId: member.id,
      guildId: member.guild.id,
      banned: true,
    }

    const banned = await Banned.findOne(query);
    if (banned) {
      member.kick('You are banned');
    }

    await member.roles.add(autoRole.roleId);
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};