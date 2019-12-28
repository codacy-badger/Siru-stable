const Discord = require('discord.js')
class Command {
  constructor (client) {
    this.client = client
    this.command = {
      name: 'settings',
      aliases: ['설정', 'ㄴㄷㅅ샤ㅜㅎㄴ'],
      category: 'COMMANDS_MODERATION',
      require_voice: false,
      hide: false,
      permissions: ['Administrator']
    }
  }

  /**
   * @param {Object} compressed - Compressed Object (In CBOT)
   */
  async run (compressed) {
    const picker = this.client.utils.localePicker
    const { message, GuildData } = compressed
    const { locale, filter, warningMax, audioMessage, audioPlayrelated, repeat, shuffle, tch, vch } = GuildData
    const djRole = GuildData.dj_role
    const embed = new Discord.RichEmbed()
    embed.setDescription(picker.get(locale, 'COMMANDS_MODSETTINGS_DESC',
      {
        LOCALE: picker.get(locale, 'NAME'),
        FILTER: filter === true ? picker.get(locale, 'ENABLE') : picker.get(locale, 'DISABLE'),
        WARNMAX: warningMax,
        AUDIOPLAY: audioMessage === true ? picker.get(locale, 'YES') : picker.get(locale, 'NO'),
        RELATED: audioPlayrelated === true ? picker.get(locale, 'YES') : picker.get(locale, 'NO'),
        REPEAT_EMOJI: this.client._options.constructors['EMOJI_' + this.client.audio.getRepeatState(repeat).toUpperCase()],
        REPEAT: picker.get(locale, this.client.audio.getRepeatState(GuildData.repeat).toUpperCase()),
        SHUFFLE: shuffle === true ? picker.get(locale, 'YES') : picker.get(locale, 'NO'),
        SHUFFLE_EMOJI: shuffle === true ? this.client._options.constructors.EMOJI_SHUFFLE : this.client._options.constructors.EMOJI_REPEAT_NONE
      }))
    embed.setTimestamp(new Date())
    embed.setColor(this.client.utils.findUtil.getColor(message.guild.me))
    message.channel.send(picker.get(locale, 'COMMANDS_MODSETTINGS_EMBED_TITLE', { SERVER: message.guild.name }), embed)
  }

  getName () {

  }
}

module.exports = Command