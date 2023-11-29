/**
 * getter module
 * @module getter
 */
const filter = require('./filter')
const api = require('./api')

/**
 * 分析，红T
 * @param {Array} list 行情数组
 * @returns {Array}
 */
function withRedT(list) {
  list = filter.removeKechuang(list)
  list = filter.removeST(list)
  list = filter.byChangePercent(list, 0, 9)
  list = filter.byPrice(list, 10, 400)
  list = filter.byAmount(list, 50000000)
  // list = filter.getChuangye(list)
  // console.log('通用过滤后的条数:', list.length)
  list = filter.byRatio(list, 1)
  list = filter.getRedT(list)
  // list = newFilter.getRealRedT(list)
  console.log('符合红T，剩下的code条数:', list.length)
  return list
}

/**
 * 分析，macd
 * @param {Array} list 行情数组
 * @returns {Promise<Array>}
 */
async function withMacd(list) {
  const list_tmp = []
  let i = 0
  while (i < list.length - 1) {
    const item = list[i]
    const res = await api.getHistory(item?.code)
    res.reverse()
    const ticks = res.map((hItem) => {
      return hItem.trade
    })
    const s = filter.macd(ticks)
    // const dea = s.deas[1]
    const dif = s.diffs[1]
    const dfi2 = s.diffs[2]
    if (dfi2 < dif) {
      list_tmp.push(item)
    }
    i++
  }
  console.log('符合macd，剩下的code条数:', list_tmp.length)
  return list_tmp
}

/**
 * 返回大单入的股
 * @param {Array} list 行情数组
 * @returns {Promise<Array>}
 */
async function withDadan(list = []) {
  const list_tmp = []
  let i = 0
  while (i < list.length - 1) {
    const item = list[i]
    const res = await api.getDaDan(item?.code)
    const superFlow = res?.superFlow || 0
    const bigFlow = res?.bigFlow || 0
    if (superFlow > 0) {
      if (bigFlow > 0 || superFlow > Math.abs(bigFlow)) {
        list_tmp.push(item)
      }
    } else if (bigFlow > Math.abs(superFlow)) {
      list_tmp.push(item)
    }
    i++
  }
  console.log('符合大单，剩下的code条数:', list_tmp.length)
  return list_tmp
}

module.exports = {
  withRedT,
  withDadan,
  withMacd
}
