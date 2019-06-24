const fs = require('fs')
const format = require('xml2json')
module.exports = { convertJacocoReportXmltoJsonObj, diffCoverage }

function convertJacocoReportXmltoJsonObj(reportXml, isFilePath = true) {
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

function diffCoverage(jsonObj1, jsonObj2) {
  mapping1 = createSourceFileNameToDataMap(jsonObj1)
  mapping2 = createSourceFileNameToDataMap(jsonObj2)
  diff = []
  for (key in mapping1) {
    if (!(key in mapping2)) {
      diff.push({
        name: key,
        line: mapping1[key]['line'].map(line => parseInt(line.nr)),
      })
    } else {
      data1 = mapping1[key]
      data2 = mapping2[key]
      missedLineNumbers = diffLineCoverageData(data1.line, data2.line)
      if (missedLineNumbers.length > 0) {
        diff.push({
          name: key,
          line: missedLineNumbers,
        })
      }
    }
  }
  return diff
}

function createSourceFileNameToDataMap(sourceData) {
  let mapping = {}
  sourceData.forEach((obj) => {
    mapping[obj.name] = obj
  })
  return mapping
}

function diffLineCoverageData(data1, data2) {
  line1Map = createLineNumberToLineMap(data1)
  line2Map = createLineNumberToLineMap(data2)
  lineDiff = []
  for (lineNumber in line1Map) {
    if (!(lineNumber in line2Map)) {
      lineDiff.push(parseInt(lineNumber))
    } else {
      coveredInstruction1 = line1Map[lineNumber]
      coveredInstruction2 = line2Map[lineNumber]
      // Both lines present, check to see if instructions are not covered by automated test
      // TODO: Check if this is sufficient
      if (coveredInstruction1 != '0' && coveredInstruction2 == '0') {
        lineDiff.push(parseInt(lineNumber))
      }
    }
  }
  return lineDiff
}

function createLineNumberToLineMap(lineData) {
  let mapping = {}
  console.log(lineData)
  lineDataAsArray = Array.isArray(lineData) ? lineData : [lineData]
  lineDataAsArray.forEach((obj) => {
    mapping[obj.nr] = obj.ci
  })
  return mapping
}