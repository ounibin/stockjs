const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')
const path = require('path')

class Doc {
  static start () {
    jsdoc2md.render({ files: 'src/*.js' }).then((res) => {
      fs.writeFileSync(path.resolve(__dirname, '../README.md'), res)
    })
  }
}

Doc.start()
