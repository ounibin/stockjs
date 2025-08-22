/**
 * api module
 * @module api
 */
const axios = require('axios')
const asyncUtil = require('async')
const dayjs = require('dayjs')

/**
 * 获取股票历史行情数据
 * @param {String} code 股票代码，如'600001'
 * @param {String} startDate 开始日期，如'2021-08-17'
 * @param {String} endDate 结束日期，如'2021-08-17'
 * @returns {Promise<Array>}
 *  {
    "date": "2021-08-17",
    "symbol": "sz301046",
    "code": "301046",
    "name": "N能辉",
    "close": 52.05,
    "trade": 52.05,
    "pricechange": 43.71,
    "changepercent": 524.101,
    "buy": 52.04,
    "sell": 52.05,
    "settlement": 8.34,
    "open": 48,
    "high": 55.55,
    "low": 45.2,
    "volume": 26654748,
    "amount": 1351235060,
    "ticktime": "15:35:00",
    "per": 0,
    "pb": 12.815,
    "mktcap": 778043.4,
    "nmc": 184454.6859,
    "turnoverratio": 75.2152
  }
 */
async function getHistory(code, startDate, endDate) {
  try {
    if (typeof code !== 'string') {
      throw (Error(`code应该为string，但接收到的是${typeof code}`))
    }
    const symbol = ['5', '6', '9'].indexOf(code.charAt(0)) >= 0 ? `sh${code}` : `sz${code}`
    const res = await axios.get(`http://api.finance.ifeng.com/akdaily/?type=fq&code=${symbol}`)
    if (!Array.isArray(res.data.record)) throw Error(`获取不到${code}历史数据`)
    const recordList = res.data.record
    const data = recordList.map((item) => {
      return {
        date: item[0],
        code,
        open: Number(item[1]),
        high: Number(item[2]),
        close: Number(item[3]),
        trade: Number(item[3]),
        low: Number(item[4]),
        volume: Number(item[5]),
        pricechange: Number(item[6]),
        changepercent: Number(item[7]),
        price5: Number(item[8]),
        price10: Number(item[9]),
        price20: Number(item[10]),
        volume5: Number(item[11].replace(/,/g, '')),
        volume10: Number(item[12].replace(/,/g, '')),
        volume20: Number(item[13].replace(/,/g, '')),
        turnoverratio: Number(item[14])
      }
    })
    if (!startDate && !endDate) {
      return data
    } else {
      const startIndex = data.findIndex((item) => {
        return item.date === startDate
      })
      const endIndex = data.findIndex((item) => {
        return item.date === endDate
      })
      const newData = data.slice(startIndex, endIndex + 1)
      return newData
    }
  } catch (err) {
    console.log(err)
    return []
  }
}

/**
 * 查看指定日期是否开盘
 * @param {String} date 日期，如'2021-08-08'
 * @returns {Promise<Boolean>} true or false
 */
async function isOpen(date = '') {
  const res = await axios.get(`http://tool.bitefu.net/jiari/?d=${date}`)
  return Number(res.data) === 0
}

/**
 * 获取今日全部股票行情
 * @returns {Promise<Array>} 数组，某一个item，如下：

 */
function getAll() {
  return new Promise((resolve, reject) => {
    const urlList = []
    for (let index = 1; index <= 56; index++) {
      const url = `http://vip.stock.finance.sina.com.cn/quotes_service/api/json_v2.php/Market_Center.getHQNodeData?num=100&sort=changepercent&asc=0&node=hs_a&symbol=&_s_r_a=page&page=${index}`
      urlList.push(url)
    }
    asyncUtil.mapLimit(urlList, 2, async (url) => {
      const res = await axios.get(url)
      console.log(`获取到${res.data.length}条行情数据`)
      return res.data
    }, (err, results) => {
      if (err) reject(err)
      else {
        let res = []
        results.forEach((itemlist) => {
          res = res.concat(itemlist)
        })
        const realRes = res.map((item) => {
          const {
            symbol,
            code,
            name,
            trade,
            pricechange,
            changepercent,
            buy,
            sell,
            settlement,
            open,
            high,
            low,
            volume,
            amount,
            ticktime,
            per,
            pb,
            mktcap,
            nmc,
            turnoverratio
          } = item
          return {
            date: dayjs().format('YYYY-MM-DD'),
            symbol,
            code,
            name,
            trade: Number(trade),
            close: Number(trade),
            pricechange,
            changepercent,
            buy: Number(buy),
            sell: Number(sell),
            settlement: Number(settlement),
            open: Number(open),
            high: Number(high),
            low: Number(low),
            volume,
            amount,
            ticktime,
            per,
            pb,
            mktcap,
            nmc,
            turnoverratio
          }
        })
        console.log(`收集到${realRes.length}条行情数据`)
        resolve(realRes)
      }
    })
  })
}

/**
 * 获取今日全部股票行情
 * @returns {Promise<Array>} 数组，某一个item
 */
async function getTodayAll() {
  const today = dayjs().format('YYYY-MM-DD')
  const res = await axios.get(`http://tool.bitefu.net/jiari/?d=${today}`)
  const isOpen = Number(res.data) === 0
  console.log(today, '今日开盘', isOpen)
  if (!isOpen) {
    return []
  }
  const data = await getAll()
  return data
}

/**
 * 获取大单信息
 * @param {String} code 股票代码
 * @returns {Promise<Object>} {
      superFlow,
      bigFlow,
      middleFlow,
      smallFlow
    }
 */
async function getDaDan(code) {
  try {
    const symbol = ['5', '6', '9'].indexOf(code.charAt(0)) >= 0 ? `sh${code}` : `sz${code}`
    const res = await axios.get(`https://proxy.finance.qq.com/cgi/cgi-bin/fundflow/hsfundtab?code=${symbol}&type=historyFundFlow,fiveDayFundFlow,todayFundTrend,todayFundFlow&stockType=GP-A-CYB&_rndtime=1629881078&_appName=ios&_dev=iPhone11,8&_devId=da95e4d81219c7c6a032ddfb97e697ef9bfd015d&_appver=9.3.1&_ifChId=&_isChId=1&_osVer=14.5.1&openid=oA0GbjuuHb8INjX0Ot6iutogSAYk&fskey=v0aaf8a8221612602a604296d87a906e&appid=wxcbc3ab3807acb685&access_token=48_MciNFtSWUX95rFFSwM9JWEfXkfTA2GIGXmUuh6whDig790tYTZ4dXS-naj6fkzD0DcZ3uPHFnEmmGNN7Y-cdyZrw_Ha407FjfOip_ZMnNPY&buildType=store&check=11&_idfa=&lang=zh_CN`)
    let {
      superFlow,
      bigFlow,
      normalFlow,
      smallFlow
    } = res.data.data.todayFundFlow
    superFlow = +superFlow
    bigFlow = +bigFlow
    const middleFlow = +normalFlow
    smallFlow = +smallFlow
    return {
      superFlow,
      bigFlow,
      middleFlow,
      smallFlow
    }
  } catch (err) {
    console.log('err=', err)
    return null
  }
}

/**
 * 获取看涨和看跌的人数
 * @param {String} code 代码
 * @returns {Object}
 * {
      up: 1,
      down: 2
    }
 */
async function getUpDown(code) {
  try {
    const res = await axios.get(`https://bi.10jqka.com.cn/${code}_17/online_user_latest.json`)
    const up = +res.data.czd.result[`stock_${code}`].options[0].hot
    const down = +res.data.czd.result[`stock_${code}`].options[1].hot
    const total = up + down
    // const upStr = ((up / total) * 100).toFixed(2) + '%'
    return {
      up,
      down
    }
  } catch (err) {
    return {
      up: 0,
      down: 0
    }
  }
}

module.exports = {
  getHistory,
  getTodayAll,
  isOpen,
  getDaDan,
  getUpDown
}