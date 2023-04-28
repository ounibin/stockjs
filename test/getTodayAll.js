const dayjs = require('dayjs')
const jsonfile = require('jsonfile')
const path = require('path')
const { api } = require('../src/index')

const TODAY = dayjs().format('YYYY-MM-DD')

api.getTodayAll().then((res) => {
  jsonfile.writeFile(path.join(__dirname, `data/${TODAY}.json`), res)
    .then(res => console.log('Write complete'))
    .catch(err => console.error(err))
})
