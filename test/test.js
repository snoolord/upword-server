var assert = require('assert')
var arrayUtil = require('../util/array-util')

describe('#cleanArray()', function () {
    it('should return array with no empty strings', function () {
        let array = ['hello', '', 'no']
        arrayUtil.cleanArray(array)
        assert(array.length === 2)
    })
})
