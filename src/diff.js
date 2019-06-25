module.exports = { diffCoverage }

function diffCoverage (jsonObj1, jsonObj2) {
  const mapping1 = createSourceFileNameToDataMap(jsonObj1)
  const mapping2 = createSourceFileNameToDataMap(jsonObj2)
  let diff = []
  for (let key in mapping1) {
    if (!(key in mapping2)) {
      diff.push(mapping1[key])
    } else {
      const data1 = mapping1[key]
      const data2 = mapping2[key]
      const missedLineNumbers = diffLineCoverageData(
        data1.coveredLines,
        data2.coveredLines
      )
      if (missedLineNumbers.length > 0) {
        diff.push({
          name: key,
          coveredLines: missedLineNumbers
        })
      }
    }
  }
  return diff
}

function createSourceFileNameToDataMap (sourceData) {
  let mapping = {}
  sourceData.forEach(obj => {
    mapping[obj.name] = obj
  })
  return mapping
}

function diffLineCoverageData (data1, data2) {
  const line2Set = new Set(data2)
  const lineDiff = data1.filter(lineNumber => {
    return !line2Set.has(lineNumber)
  })
  return lineDiff
}
