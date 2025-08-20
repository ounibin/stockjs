const jsonfile = require('jsonfile')
const path = require('path')
const dayjs = require('dayjs')
const axios = require('axios')
const fs = require('fs');
const csv = require('csv-parser')
const stockjs = require('../src/index.js')


function formatData(item) {
  return {
    name: item.name,
    code: item.code,
    open: Number(item.open),
    high: Number(item.high),
    low: Number(item.low),
    close: Number(item.close),
    trade: Number(item.trade),
    volume: Number(item.volume),
    amount: Number(item.amount)
  }
}

async function main() {
  const day1 = '20250820'
  let lastDay = (dayjs(day1).subtract(1, 'day')).format('YYYYMMDD')
  // lastDay = ''

  const list1 = require(`./data/${day1}.json`)
  const list2 = require(`./data/${lastDay}.json`)
  let list = list1.map(formatData)
  console.log('今天开盘日: ', day1, '数据长度为', list.length)
  const lastList = list2.map(formatData)
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
  list = stockjs.filter.getRedCrossStar(list) // 红十字

  // 结果数据
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
  console.log('放量结果总数：', resList.length)
  resList.forEach((item, index) => {
    console.log(`放量结果${index + 1}：`, item.code, item.name)
  })
}

main()