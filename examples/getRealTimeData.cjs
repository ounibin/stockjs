const dayjs = require('dayjs')
const jsonfile = require('jsonfile')
const path = require('path')
const {
  getter,
  api
} = require('../src/index')

function getData() {
  // const TODAY = dayjs().format('YYYYMMDD')
  const TODAY = '20250406'
  api.getTodayAll().then((res) => {
    jsonfile
      .writeFile(path.join(__dirname, `data/${TODAY}.json`), res)
      .then(res => console.log('Write complete'))
      .catch(err => console.error(err))
  })
}

getData()
