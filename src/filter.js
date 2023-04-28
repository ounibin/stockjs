/**
 * filter module
 * @module filter
 */
/**
 * 移除ST
 * @param {Array} list 行情数组
 * @returns {Array} 数组
 */
function removeST (list) {
  return list.filter((item) => {
    return !(/ST/g.test(item.name))
  })
}

/**
 * 移除科创股（因为我穷，还没法买😢）
 * @param {Array} list 行情数组
 * @returns {Array} 数组
 */
function removeKechuang (list) {
  return list.filter((item) => {
    return item.code.substring(0, 3) !== '688'
  })
}

/**
 * 根据价格，筛选
 * @param {Array} list 行情数组
 * @param {Number} lowPrice 最低价，默认0
 * @param {Number} highPrice 最高价，默认3000
 * @returns {Array} 数组
 */
function byPrice (list, lowPrice = 0, highPrice = 3000) {
  return list.filter((item) => {
    const trade = Number(item.trade)
    return trade >= lowPrice && trade <= highPrice
  })
}

/**
 * 根据换手率，筛选
 * @param {Array} list 行情数组
 * @param {Number} lowRatio 最低换手率，默认0
 * @param {Number} highRatio 最高换手率，默认100
 * @returns {Array} 数组
 */
function byRatio (list, lowRatio = 0, highRatio = 100) {
  return list.filter((item) => {
    const ratio = Number(item.turnoverratio)
    return ratio >= lowRatio && ratio <= highRatio
  })
}

/**
 * 根据涨跌幅度，筛选
 * @param {Array} list 行情数组
 * @param {Number} lowPercent 最低涨跌幅度，默认-20
 * @param {Number} highPercent 最高涨跌幅度，默认20
 * @returns {Array} 数组
 */
function byChangePercent (list, lowPercent = -20, highPercent = 20) {
  return list.filter((item) => {
    const percent = Number(item.changepercent)
    return percent >= lowPercent && percent <= highPercent
  })
}

/**
 * 根据成交额，筛选
 * @param {Aarray} list 行情数组
 * @param {Number} lowAmount 最低成交额，默认10000000（一千万）
 * @param {Number} lowAmount 最高成交额
 * @returns {Array} 数组
 */
function byAmount (list, lowAmount = 10000000, highAmount) {
  return list.filter((item) => {
    const amount = Number(item.amount)
    if (highAmount) {
      return amount >= lowAmount && amount <= highAmount
    }
    return amount >= lowAmount
  })
}

/**
 * 获取redT，但不是平头
 * @param {Array} list 行情数组
 * @returns {Array} 数组
 */
function getRedT (list) {
  return list.filter((item) => {
    let { open, high, low, trade } = item
    open = Number(open)
    high = Number(high)
    low = Number(low)
    trade = Number(trade)
    const divH = Math.abs(trade - open)
    const lineUpH = Math.abs(high - trade)
    const lineDownH = Math.abs(open - low)
    return trade > open && (lineUpH / divH) < 0.05 && (lineDownH / divH) > 1
  })
}

/**
 * 获取平头redT，
 * @param {Array} list 行情数组
 * @returns {Array} 数组
 */
function getRealRedT (list) {
  return list.filter((item) => {
    let { open, high, low, trade } = item
    open = Number(open)
    high = Number(high)
    low = Number(low)
    trade = Number(trade)
    const divH = Math.abs(trade - open)
    const lineDownH = Math.abs(open - low)
    return trade > open && trade === high && (lineDownH / divH) > 1
  })
}

/**
 * 获取创业股
 * @param {Array} list 行情数组
 * @returns {Array} 数组
 */
function getChuangye (list) {
  return list.filter((item) => {
    return /^3/g.test(item.code)
  })
}

function _ema (lastEma, closePrice, units) {
  return (lastEma * (units - 1) + closePrice * 2) / (units + 1)
}
function _dea (lastDea, curDiff) {
  return (lastDea * 8 + curDiff * 2) / 10
}
/**
 * 获取macd
 * @param {array} ticks 价格数组，最近一日的价格在数组第一个
 * @returns {object}，如下：{
  macds,
  diffs,
  deas
}
 */
function macd (ticks) {
  const ema12 = []
  const ema26 = []
  const diffs = []
  const deas = []
  const macds = []
  ticks.forEach((c, i) => {
    if (i === 0) {
      ema12.push(c)
      ema26.push(c)
      deas.push(0)
    } else {
      ema12.push(_ema(ema12[i - 1], c, 12))
      ema26.push(_ema(ema26[i - 1], c, 26))
    }
    diffs.push(ema12[i] - ema26[i])
    if (i !== 0) {
      deas.push(_dea(deas[i - 1], diffs[i]))
    }
    macds.push((diffs[i] - deas[i]) * 2)
  })

  return {
    macds,
    diffs,
    deas
  }
}

module.exports = {
  removeST,
  removeKechuang,
  byPrice,
  byRatio,
  byChangePercent,
  byAmount,
  getRedT,
  getRealRedT,
  getChuangye,
  macd
}
