class AudioFilters {
  constructor (audio) {
    this.client = audio.client
    this.bassGains = [
      [0, -0.05], // 25 Hz
      [1, 0.07], // 40 Hz
      [2, 0.16], // 63 Hz
      [3, 0.03], // 100 Hz
      [4, -0.05], // 160 Hz
      [5, -0.11] // 250 Hz
    ]
  }

  /**
   *
   */
  setPlayerFilter (guildID, filter, value) {
    if (!guildID) throw new Error('guildId not provided')
    if (!filter) throw new Error('filter not provided')
    if (!value) throw new Error('value not provided')
    if (!this.client.audio.players.get(guildID)) throw new Error('player not found')
    this.client.audio.players.get(guildID).filters[filter] = value
    return this.client.audio.players.get(guildID).filters[filter]
  }

  /**
   * @param {String} guildID - guildId for set
   * @param {Number} percentage - percentage of multiplier
   */
  bassboost (guildID, percentage) {
    // const levels = {
    //   wtf: [1, 0.8, 0.6],
    //   insane: [0.4, 0.26, 0.18],
    //   strong: [0.2, 0.15, 0.11],
    //   medium: [0.1, 0.08, 0.04],
    //   weak: [0.03, 0.01, 0],
    //   off: [0, 0, 0]
    // }
    if (!guildID) throw new Error('guildId not provided')
    if (!this.client.audio.players.get(guildID)) throw new Error('player not found')
    // let i = 0
    // const bands = levels[level].map(el => this.getBand(i++, el))
    const multiplier = percentage / 50
    const bands = []
    for (const [band, gain] of this.bassGains) {
      if (multiplier === 0) bands.push(this.getBand(band, 0))
      else bands.push(this.getBand(band, gain * multiplier))
    }
    this.client.audio.players.get(guildID).setEqualizer(bands)
    this.setPlayerFilter(guildID, 'bassboost', bands)
    return bands
  }

  /**
   * @param {Number} band - Equalizer Band
   * @param {Number} gain - Band Gain
   */
  getBand (band = 0, gain = 0.25) {
    const bandObj = {}
    Object.defineProperty(bandObj, 'band', { value: band, enumerable: true })
    Object.defineProperty(bandObj, 'gain', { value: gain, enumerable: true })
    return bandObj
  }

  /**
   * @param {String} guildID - guildId for set
   * @param {Number} level - Karaoke Value
   * @param {Number} monoLevel - Karaoke monoLevel
   * @param {Number} filterBand - Karaoke filterBand
   * @param {Number} filterWidth - Karaoke filterWidth
   */
  setKaraoke (guildID, level = 1, monoLevel = 1, filterBand = 220, filterWidth = 100) {
    if (!guildID) throw new Error('guildId not provided')
    if (!this.client.audio.players.get(guildID)) throw new Error('player not found')
    const nodeOpts = this.client._options.audio.nodes.filter(el => el.name === this.client.audio.players.get(guildID).voiceConnection.node.name)[0]
    if (!nodeOpts.andesite) throw new Error('only support anesite node')
    const payload = {}
    Object.defineProperty(payload, 'op', { value: 'filters', enumerable: true })
    Object.defineProperty(payload, 'guildId', { value: guildID, enumerable: true })
    const karaokeObject = {}
    Object.defineProperty(karaokeObject, 'level', { value: level, enumerable: true })
    Object.defineProperty(karaokeObject, 'monoLevel', { value: monoLevel, enumerable: true })
    Object.defineProperty(karaokeObject, 'filterBand', { value: filterBand, enumerable: true })
    Object.defineProperty(karaokeObject, 'filterWidth', { value: filterWidth, enumerable: true })
    Object.defineProperty(payload, 'karaoke', { value: karaokeObject, enumerable: true })
    this.setPlayerFilter(guildID, 'karaoke', karaokeObject)
    return this.client.audio.players.get(guildID).voiceConnection.node.send(payload)
  }

  /**
   * @param {String} guildID - guildId for set
   * @param {Number} speed - TimeScale speed (value > 0)
   * @param {Number} pitch - TimeScale pitch (value > 0)
   * @param {Number} rate - TimeScale rate (value > 0)
   */
  setTimescale (guildID, speed = 1, pitch = 1, rate = 1) {
    if (!guildID) throw new Error('guildId not provided')
    if (!this.client.audio.players.get(guildID)) throw new Error('player not found')
    const nodeOpts = this.client._options.audio.nodes.filter(el => el.name === this.client.audio.players.get(guildID).voiceConnection.node.name)[0]
    if (!nodeOpts.andesite) throw new Error('only support anesite node')
    const payload = {}
    Object.defineProperty(payload, 'op', { value: 'filters', enumerable: true })
    Object.defineProperty(payload, 'guildId', { value: guildID, enumerable: true })
    const timeObject = {}
    if (speed > 0) Object.defineProperty(timeObject, 'speed', { value: speed, enumerable: true })
    else throw new Error('speed must be `value > 0`')
    if (pitch > 0) Object.defineProperty(timeObject, 'pitch', { value: pitch, enumerable: true })
    else throw new Error('pitch must be `value > 0`')
    if (rate > 0) Object.defineProperty(timeObject, 'rate', { value: rate, enumerable: true })
    else throw new Error('rate must be `value > 0`')
    Object.defineProperty(payload, 'timescale', { value: timeObject, enumerable: true })
    this.setPlayerFilter(guildID, 'timescale', timeObject)
    return this.client.audio.players.get(guildID).voiceConnection.node.send(payload)
  }
}

module.exports = AudioFilters