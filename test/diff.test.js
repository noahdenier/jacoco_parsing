const converter = require('../src/converter')
const diff = require('../src/diff')
const path = require('path')

const xmlPath = path.join(__dirname, '/resources/testReport.xml')
const xmlPath2 = path.join(__dirname, '/resources/testReport2.xml')

let diffElement

function assertDiffNamePresentAndLineNumbers (diff, name, lineNumbers) {
  diffElement = diff.find(elem => {
    return elem.name === name
  })
  expect(diffElement).toBeDefined()
  expect(diffElement.coveredLines).toEqual(lineNumbers)
}

let coverage1
let coverage2
let selfDiff
let realDiff

describe('Compare two coverage reports', () => {
  beforeAll(function () {
    coverage1 = converter.convertJacocoReportXmltoJsonObj(xmlPath)
    coverage2 = converter.convertJacocoReportXmltoJsonObj(xmlPath2)
    selfDiff = diff.diffCoverage(coverage1, coverage1)
    realDiff = diff.diffCoverage(coverage1, coverage2)
  })
  test('Self diff should be empty', () => {
    expect(selfDiff.length).toBe(0)
  })
  test('Diff should not be empty', () => {
    expect(realDiff.length).not.toBe(0)
  })
  test('Diff should have three entries', () => {
    expect(realDiff.length).toBe(3)
  })
  test('Diff should have an entry for Perdita', () => {
    assertDiffNamePresentAndLineNumbers(
      realDiff,
      'com/dog/app/dogs/Perdita.java',
      [6, 9]
    )
  })
  test('Diff should have an entry for David', () => {
    assertDiffNamePresentAndLineNumbers(
      realDiff,
      'com/dog/app/walkers/David.java',
      [10, 16, 21]
    )
  })
  test('Diff should have an entry for Jeff', () => {
    assertDiffNamePresentAndLineNumbers(
      realDiff,
      'com/dog/app/walkers/Jeff.java',
      [12]
    )
  })
})
