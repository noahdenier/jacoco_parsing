const fs = require('fs')
const format = require('xml2json')
module.exports = { convertJacocoReportXmltoJsonObj }

function convertJacocoReportXmltoJsonObj (reportXml, isFilePath = true) {
  if (isFilePath) {
    const xmlJSON = format.toJson(fs.readFileSync(reportXml, 'utf8'))
    const reportJSON = JSON.parse(xmlJSON)
    const packageJSON = reportJSON['report']['package']
    let sourceFiles = []
    packageJSON.forEach(packageElement => {
      let packageName = packageElement['name']
      packageElement['sourcefile'].forEach(sourceFile => {
        sourceFile.name = packageName + '/' + sourceFile.name
        if (sourceFile['line']) {
          const coverageFile = JacocoCoverageFile.parseJsonToCoverage(
            sourceFile
          )
          sourceFiles.push(coverageFile)
        }
      })
    })
    return sourceFiles
  } else {
    // Placeholder, build functionality to serialize an XML document object to string
    return 'only accepts xml as path'
  }
}

class CoverageData {
  constructor (name, coveredLines) {
    this.name = name // Name of source file
    this.coveredLines = coveredLines // List of numbers
  }

  static parseJsonToCoverage (rawJsonObj) {
    throw new Error('Not implemented')
  }
}

class JacocoCoverageFile extends CoverageData {
  static parseJsonToCoverage (rawJsonObj) {
    const name = rawJsonObj.name
    const lines = Array.isArray(rawJsonObj.line)
      ? rawJsonObj.line
      : [rawJsonObj.line]
    const coveredLines = lines
      .filter(line => line.ci !== '0')
      .map(line => parseInt(line.nr))
    return new CoverageData.prototype.constructor(name, coveredLines)
  }
}
