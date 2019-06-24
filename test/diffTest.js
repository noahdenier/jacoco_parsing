const converter = require('../src/converter')
const diff = require('../src/diff')
const path = require('path')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

const xmlPath = path.join(__dirname, '/resources/testReport.xml')
const xmlPath2 = path.join(__dirname, '/resources/testReport2.xml')

function assertDiffNamePresentAndLineNumbers(diff, name, lineNumbers) {
  diffElement = diff.find((elem) => {
    return elem.name === name
  })
  should.exist(diffElement, `${name} not found in diff`)
  expect(diffElement.coveredLines).to.eql(lineNumbers)
}

describe('Compare two coverage reports', function () {
  before('Run conversions and run diffs', function () {
    coverage1 = converter.convertJacocoReportXmltoJsonObj(xmlPath)
    coverage2 = converter.convertJacocoReportXmltoJsonObj(xmlPath2)
    selfDiff = diff.diffCoverage(coverage1, coverage1)
    realDiff = diff.diffCoverage(coverage1, coverage2)
  })
  it('Self diff should be empty', function () {
    should.equal(selfDiff.length, 0)
  })
  it('Diff should not be empty', function () {
    should.not.equal(realDiff.length, 0)
  })
  it('Diff should have three entries', function () {
    should.equal(realDiff.length, 3)
  })
  it('Diff should have an entry for Perdita', function () {
    assertDiffNamePresentAndLineNumbers(realDiff, 'com/dog/app/dogs/Perdita.java', [6, 9])
  })
  it('Diff should have an entry for David', function () {
    assertDiffNamePresentAndLineNumbers(realDiff, 'com/dog/app/walkers/David.java', [10, 16, 21])
  })
  it('Diff should have an entry for Jeff', function () {
    assertDiffNamePresentAndLineNumbers(realDiff, 'com/dog/app/walkers/Jeff.java', [12])
  })
})
