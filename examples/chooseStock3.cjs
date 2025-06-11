const jsonfile = require('jsonfile')
const path = require('path')
const dayjs = require('dayjs')
const axios = require('axios')
const stockjs = require('../src/index.js')

function formatData(item) {
  const code = item[0].slice(0, 6)
  const date = item[1]
  const open = item[2]
  const high = item[3]
  const low = item[4]
  const close = item[5]
  const volume = item[6]
  const amount = item[7]
  return {
    code,
    date,
    open,
    high,
    low,
    close,
    trade: close,
    volume,
    amount
  }
}

// 获取指定日期的行情数据
async function getDateData(date) {
  const TUSHARE_API_TOKEN = '636de5eeb64f0c7f44165b5e9f4458fbdb18faab6f7bd8aa565535c1'
  const TUSHARE_API_URL = 'http://api.waditu.com'
  try {
    const response = await axios.post(TUSHARE_API_URL, {
      api_name: 'daily',
      token: TUSHARE_API_TOKEN,
      params: {
        trade_date: date // 交易日期，格式：YYYYMMDD
      },
      fields: 'ts_code,trade_date,open,high,low,close,vol,amount'
    })

    if (response.data && response.data.data) {
      // console.log(`数据获取成功：${date}`)
      return response.data.data.items // 返回数据
    } else {
      console.error('获取失败：', response.data)
      return null
    }
  } catch (error) {
    console.error('请求出错：', error)
    return null
  }
}

async function main(day1, lastDay) {
  try {
    const res1 = await getDateData(day1)
    let list = res1.map(formatData)
    console.log('今天开盘日: ', day1, '数据长度为', list.length)

    const lastRes = await getDateData(lastDay)
    const lastList = lastRes.map(formatData)
    console.log('上个开盘日: ', lastDay, '数据长度为', lastList.length)

    if (day1.length === 0) {
      console.log(`${day1}数据异常`)
      return
    } else if (lastDay.length === 0) {
      console.log(`${lastDay}数据异常`)
      return
    }

    // 条件选股
    list = list.filter((item) => {
      const isKechuang = /^688|689|787|789/.test(item.code)
      const isXinSanBan = /^82|83|87|88|430|420|400/.test(item.code)
      const bigPrice = item.trade > 10
      return !isKechuang && !isXinSanBan
    })
    const list_hongshizi = stockjs.filter.getRedCrossStar(list)
    // console.log('异步打印----红十字星: ', list_hongshizi.length)
    // const list_lvshizi = stockjs.filter.getGreenCrossStar(list)
    // console.log('异步打印----绿十字星: ', list_lvshizi.length)
    // .concat(list_lvshizi)
    list = list_hongshizi

    const resList = []
    list.forEach((item) => {
      const item_last = lastList.find((n) => n.code === item.code)
      if (item_last) {
        // console.log('异步打印----item_last: ', item.volume, item_last.volume * 2)
        if ((item.close - item.open) > 0 && item.volume > item_last.volume * 1.5 && item_last.close - item_last.open < 0) {
          resList.push(item)
        }
      }
    })

    // 打印
    console.log('结果：', resList.length, '条记录')
    resList.forEach((item) => {
      console.log(item.code)
    })

    jsonfile
      .writeFile(path.join(__dirname, `buyData/${day1}.json`), resList)
      .then(res => console.log('Write complete'))
      .catch(err => console.error(err))
  } catch (err) {
    console.log('分析出错err=', err)
  }
}

let lastDay = ''
const day1 = '20250610'
lastDay = (dayjs(day1).subtract(1, 'day')).format('YYYYMMDD')
// lastDay = '20250606'
main(day1, lastDay)
