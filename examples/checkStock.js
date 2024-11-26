const dayjs = require('dayjs')

function check(buyDate, gapDay = 1) {
  const sellDate = (dayjs(buyDate).add(gapDay, 'day').format('YYYYMMDD'))

  const buyList = require(`./buyData/${buyDate}.json`)
  const sellDateData = require(`./data/${sellDate}.json`)
  const allLen = buyList.length
  const winList = []
  buyList.forEach(buyItem => {
    const item = sellDateData.find((item) => item.code === buyItem.code)
    if (item) {
      // console.log('异步打印----item: ', item)
      const itemClose = item?.close || item.trade
      const gains = (itemClose - buyItem.close) / buyItem.close
      const percent = `${(gains * 100).toFixed(2)}%`
      console.log(item.code, '涨幅=', percent)
      if (gains > 0) {
        winList.push(item)
      }
    }
  })

  // console.log('异步打印----winList: ', winList)
  const winLen = winList.length
  console.log(`买入日期=${buyDate}, 卖出日期=${sellDate}, 持有天数=${gapDay}, 胜率: ${winLen}/${allLen}=${(winLen / allLen * 100).toFixed(2)}%`)
}

check('20241112', 14)
