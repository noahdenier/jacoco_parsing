const converter = require('../src/converter')
const path = require('path')

let jsonObj = []
const xmlPath = path.join(__dirname, '/resources/testReport.xml')

describe('Convert Jacoco Report XML to JSON - Main Functionality', () => {
  beforeAll(function () {
    jsonObj = converter.convertJacocoReportXmltoJsonObj(xmlPath)
  })
  // testReport.xml has a source file called DogWalkingSchedulingController.java, the following tests
  // assert that the xml parser created an object for this source file and that it has the expected
  // properties from the coverage report
  test('Conversion code returned an object that is indexible', () => {
    expect(jsonObj[0]).toBeDefined()
  })
  test(
    'Only the source files from the report XML are returned in the JSON object',
    () => {
      expect(jsonObj.length).toBe(6)
    }
  )
  test(
    'Source files with no data are not returned in the JSON object',
    () => {
      jsonObj.forEach(sourceFile => {
        expect(sourceFile['name']).not.toBe('com/dog/app/walkers/DogWalker.java' && 'com/dog/app/dogs/Dog.java')
      })
    }
  )
})
