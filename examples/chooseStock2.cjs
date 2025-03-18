const jsonfile = require('jsonfile')
const path = require('path')
const dayjs = require('dayjs')
const stockjs = require('../src/index.js')

function reachUpLimit(stockItem) {
  const {
    code,
    close,
    open
  } = stockItem
  const changepercent = Number(((close - open) / open * 100).toFixed(2))
  const is_ke_chuang_gu = /^688$/.test(code)
  const is_chuang_ye_gu = /^300$/.test(code)
  if (is_ke_chuang_gu || is_chuang_ye_gu) {
    return changepercent > 19.8 && changepercent <= 20
  } else {
    return changepercent > 9.8 && changepercent <= 10
  }
}

function getNoReachUpLimit(list) {
  return list.filter((stockItem) => {
    const {
      code,
      changepercent
    } = stockItem
    const is_ke_chuang_gu = /^688$/.test(code)
    const is_chuang_ye_gu = /^300$/.test(code)
    return (is_ke_chuang_gu || is_chuang_ye_gu) ? changepercent < 20 : changepercent < 10
  })
}

function getLocalDataByDate(date) {
  const localData = require(`./data/${date}.json`)
  return localData
}

function isRedTStock(stockItem) {
  let {
    open,
    high,
    low,
    close
  } = stockItem
  open = Number(open)
  high = Number(high)
  low = Number(low)
  close = Number(close)
  const divH = Math.abs(close - open)
  const lineUpH = Math.abs(high - close)
  const lineDownH = Math.abs(open - low)
  return close > open && (lineUpH / divH) < 0.05 && (lineDownH / divH) > 1
}

async function main(buyDate) {
  try {
    let list = getLocalDataByDate(buyDate)
    // 条件选股
    list = list.filter((item) => {
      const zhangfu = (item.close - item.open) / item.open
      const percentBigger5 = zhangfu > 0.05
      const isNotReachUpLimit = !reachUpLimit(item)
      const isKechuang = /^688|689|787|789/.test(item.code)
      const isXinSanBan = /^82|83|87|88|430|420|400/.test(item.code)
      return !isKechuang && !isXinSanBan
    })
    const list_hongshizi = stockjs.filter.getRedCrossStar(list)
    console.log('异步打印----红十字星: ', list_hongshizi.length)
    const list_lvshizi = stockjs.filter.getGreenCrossStar(list)
    console.log('异步打印----绿十字星: ', list_lvshizi.length)

    list = list_hongshizi.concat(list_lvshizi)
    const resList = []
    // 成交量大于上一开盘2.5倍
    const LASTDAY = (dayjs(buyDate).subtract(1, 'day')).format('YYYYMMDD')
    console.log('异步打印----上一个开盘日: ', LASTDAY)
    const list_last_day = require(`./data/${LASTDAY}.json`)
    list.forEach((item) => {
      const item_last = list_last_day.find((n) => n.code === item.code)
      if (item_last) {
        // console.log('异步打印----item_last: ', item.volume, item_last.volume * 2)
        if ((item.trade - item.open) > 0 && item.volume > item_last.volume * 1.5 && item_last.trade - item_last.open < 0) {
          resList.push(item)
        }
      }
    })

    // 打印
    console.log('结果：', resList.length, '条记录')
    resList.forEach((item) => {
      console.log(item.code, item.name)
    })

    jsonfile
      .writeFile(path.join(__dirname, `buyData/${buyDate}.json`), resList)
      .then(res => console.log('Write complete'))
      .catch(err => console.error(err))
  } catch (err) {
    console.log('分析出错err=', err)
  }
}

const dateList = ['20241122', '20241121', '20241120', '20241119', '20241115', '20241114', '20241113', '20241112']
for (let index = 0; index < dateList.length; index++) {
  // main(dateList[index])
}

main('20250318')