const dayjs = require('dayjs')
const { getter } = require('../src/index')

// 入口
async function main () {
  try {
    const TODAY = dayjs().format('YYYY-MM-DD')
    // const TODAY = '2021-09-09'
    console.log('TODAY=', TODAY)
    const data = require(`./data/${TODAY}.json`)
    // 分析完成的结果
    let list = getter.withRedT(data)
    list = await getter.withDadan(list)
    list = await getter.withMacd(list)
    // 打印
    if (list.length > 0) {
      console.log('结果：')
      list.forEach((item) => {
        console.log(item.name, item.code)
      })
    }
  } catch (err) {
    console.log('main err=', err)
  }
}

main()
