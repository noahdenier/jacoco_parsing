const src = require('../src/converter')
const path = require('path')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect

let jsonObj = []
const xmlPath = path.join(__dirname, '/resources/testReport.xml')
const xmlPath2 = path.join(__dirname, '/resources/testReport2.xml')

describe('Convert Jacoco Report XML to JSON - Main Functionality', function () {
  before('Run conversion on test data', function () {
    jsonObj = src.convertJacocoReportXmltoJsonObj(xmlPath)
  })
  // testReport.xml has a source file called DogWalkingSchedulingController.java, the following tests
  // assert that the xml parser created an object for this source file and that it has the expected
  // properties from the coverage report
  it('Conversion code returned an object that is indexible', function () {
    should.exist(jsonObj[0])
  })
  it('Only the source files from the report XML are returned in the JSON object', function () {
    should.equal(jsonObj.length, 6)
  })
  it('Source files with no data are not returned in the JSON object', function () {
    jsonObj.forEach(sourceFile => {
      should.not.equal(sourceFile['name'], 'com/dog/app/walkers/DogWalker.java' && 'com/dog/app/dogs/Dog.java')
    })
  })
})

function assertDiffNamePresentAndLineNumbers(diff, name, lineNumbers) {
  diffElement = diff.find((elem) => {
    return elem.name === name
  })
  should.exist(diffElement, `${name} not found in diff`)
  expect(diffElement.line).to.eql(lineNumbers)
}

describe('Compare two coverage reports', function () {
  before('Run conversions and run diffs', function () {
    coverage1 = src.convertJacocoReportXmltoJsonObj(xmlPath)
    coverage2 = src.convertJacocoReportXmltoJsonObj(xmlPath2)
    selfDiff = src.diffCoverage(coverage1, coverage1)
    realDiff = src.diffCoverage(coverage1, coverage2)
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
