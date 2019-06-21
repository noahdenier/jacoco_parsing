const src = require('../src/jacocoReportXmlToJson')
const path = require('path')
var should = require('chai').should()

let jsonObj = []
const xmlPath = path.join(__dirname, '/resources/testReport.xml')

describe('Convert Jacoco Report XML to JSON - Main Functionality', function () {
  before('Run conversion on test data', function () {
    jsonObj = src.convertJacocoReportXmltoJson(xmlPath)
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
