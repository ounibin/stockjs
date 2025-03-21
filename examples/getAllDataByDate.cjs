const jsonfile = require('jsonfile')
const axios = require('axios')
const path = require('path')

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

// 替换为你的 Tushare API Token
const TUSHARE_API_TOKEN = '636de5eeb64f0c7f44165b5e9f4458fbdb18faab6f7bd8aa565535c1'
const TUSHARE_API_URL = 'http://api.waditu.com'

// 获取指定日期的行情数据
async function getMarketData(date) {
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
      console.log(`数据获取成功：${date}`)
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

// 示例：获取某一天的行情数据
const date = '20250321'
getMarketData(date).then(data => {
  if (data) {
    console.log('行情数据:', data)
    data = data.map(formatData)
    jsonfile
      .writeFile(path.join(__dirname, `data/${date}.json`), data)
      .then(res => console.log('Write complete'))
      .catch(err => console.error(err))
  } else {
    console.log('未获取到数据')
  }
})
