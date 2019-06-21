const fs = require('fs')
const format = require('xml2json')
module.exports = { convertJacocoReportXmltoJson: convertJacocoReportXmltoJson }

function convertJacocoReportXmltoJson (reportXml, isFilePath = true) {
  if (isFilePath) {
    const xmlJSON = format.toJson(fs.readFileSync(reportXml, 'utf8'))
    const reportJSON = JSON.parse(xmlJSON)
    const packageJSON = reportJSON['report']['package']
    let sourceFileJSON = []
    packageJSON.forEach(packageElement => {
      let packageName = packageElement['name']
      packageElement['sourcefile'].forEach(sourceFile => {
        sourceFile.name = packageName + '/' + sourceFile.name
        if (sourceFile['line']) sourceFileJSON.push(sourceFile)
      })
    })
    return sourceFileJSON
  } else {
    // Placeholder, build functionality to serialize an XML document object to string
    return 'only accepts xml as path'
  }
}
