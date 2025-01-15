const gas = require('gas-local');
const assert = require('assert');
let glib;

const {
  ACTION,
  CODE
} = require('../src/config');

const { mockCourseIdMap2Items } = require('./mockScheduleData');

describe('Test handleSchedule create courseId map', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  })

  it('create courseId map', function() {
    // dependencies
    glib.getScheduleSheet = function() {
      return {
        getRange: function() {
          // make it chainable
          return this
        },
        getValues: function() {
          return [
            [ "2025-03-01_1000_course1", "2025-03-01_1000", "2025-03-01_早上course1" ],
            [ "2025-03-02_1130_course2", "2025-03-02_1130", "2025-03-02_早上course2" ]
          ]
        },
        getLastRow: function() {
          return 3;
        }
      }
    };

    // expected result
    const expected = mockCourseIdMap2Items;

    // testing result
    const res = glib.getCourseIdMap();

    assert.deepEqual(res, expected);
  });
});

describe('Test handleSchedule get course data', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('get course data by primary key', function() {
    // dependencies
    glib.getScheduleSheet = function() {
      return {
        getRange: function() {
          return {
            getValue: function() {
              return 0;
            }
          }
        }
      }
    };
    glib.strToArr = function() {
      return [];
    };

    // expected result
    const expected = {
      reservedList: [],
      waitingList: [],
      capacity: 0,
      rowNum: 2
    }

    // testing result
    const res = glib.getCourseData('2025-03-01_1000_course1', 'primary', mockCourseIdMap2Items);

    assert.deepEqual(res, expected);
  });

  it('get course data by secondary key', function() {
    // dependencies
    // glib = gas.require('./src');
    glib.getScheduleSheet = function() {
      return {
        getRange: function() {
          return {
            getValue: function() {
              return 0;
            }
          }
        }
      }
    };
    glib.strToArr = function() {
      return [];
    };

    // expected result
    const expected = {
      reservedList: [],
      waitingList: [],
      capacity: 0,
      rowNum: 2
    }

    // testing result
    const res = glib.getCourseData('2025-03-01_1000', 'secondary', mockCourseIdMap2Items);

    assert.deepEqual(res, expected);
  });
});

describe('Test handleSchedule reservation', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('make a reservation in reserved list', function() {
    // dependencies
    glib.getCourseIdMap = function() {
      return mockCourseIdMap2Items;
    }
    glib.getCourseData = function() {
      return {
        reservedList: ['user1'],
        waitingList: [],
        capacity: 3,
        rowNum: 2
      }
    }
    glib.updateScheduleSheet = function() {
      return 'user1,user2';
    }
    glib.addToList = function() {
      return 'user1,user2';
    }

    // expected result
    const expected = [
      {
        code: CODE.SUCCESS_RESERVE,
        details: {
          idx: 2,
          courseKey: '2025-03-01_1000_course1'
        }
      }
    ];

    // testing result
    const result = glib.makeReservation({
      type: ACTION.ADD,
      reserveName: 'user2',
      courseKeys: [{
        courseKey: '2025-03-01_1000_course1',
        keyType: 'primary',
        quantity: 1
      }]
    })
    assert.deepEqual(result, expected);
  });

  it('make two reservations in reserved list', function() {
    // dependencies
    glib.getCourseIdMap = function() {
      return mockCourseIdMap2Items;
    }
    glib.getCourseData = function() {
      return {
        reservedList: ['user1'],
        waitingList: [],
        capacity: 3,
        rowNum: 2
      }
    }
    glib.updateScheduleSheet = function() {
      return 'user1,user2';
    }
    glib.addToList = function() {
      return 'user1,user2';
    }

    // expected result
    const expected = [
      {
        code: CODE.SUCCESS_RESERVE,
        details: {
          idx: 2,
          courseKey: '2025-03-01_1000_course1'
        }
      },
      {
        code: CODE.SUCCESS_RESERVE,
        details: {
          idx: 2,
          courseKey: '2025-03-02_1130_course2'
        }
      }
    ];

    // testing result
    const result = glib.makeReservation({
      type: ACTION.ADD,
      reserveName: 'user2',
      courseKeys: [{
        courseKey: '2025-03-01_1000_course1',
        keyType: 'primary',
        quantity: 1
      }, {
        courseKey: '2025-03-02_1130_course2',
        keyType: 'primary',
        quantity: 1
      }]
    })
    assert.deepEqual(result, expected);
  });

  it('make a reservation in waiting list', function() {
    // dependencies
    glib.getCourseIdMap = function() {
      return mockCourseIdMap2Items;
    }
    glib.getCourseData = function() {
      return {
        reservedList: ['user1'],
        waitingList: [],
        capacity: 1,
        rowNum: 2
      }
    }
    glib.updateScheduleSheet = function() {
      return 'user2'
    }

    // expected result
    const expected = [{
      code: CODE.SUCCESS_WAIT,
      details: {
        idx: 1,
        courseKey: '2025-03-01_1000_course1'
      }
    }];

    // testing result
    const result = glib.makeReservation({
      type: ACTION.ADD,
      reserveName: 'user2',
      courseKeys: [{
        courseKey: '2025-03-01_1000_course1',
        keyType: 'primary',
        quantity: 1
      }]
    })
    assert.deepEqual(result, expected);
  });
});

describe('Test handleSchedule cancellation', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('remove a spot from reserved list', function() {
    // dependencies
    glib.getCourseIdMap = function() {
      return mockCourseIdMap2Items;
    }
    glib.getCourseData = function() {
      return {
        reservedList: ['user1', 'user2'],
        waitingList: [],
        capacity: 3,
        rowNum: 2
      }
    }
    glib.updateScheduleSheet = function() {
      return 'user1'
    }

    // expected result
    const expected = [{
      code: CODE.SUCCESS_CANCEL,
      details: {
        courseKey: '2025-03-01_10-00_course1',
        idx: -1
      }
    }];

    // testing result
    const result = glib.cancelReservation({
      type: ACTION.CANCEL,
      quantity: 1,
      reserveName: 'user2',
      courseKeys: [{
        courseKey: '2025-03-01_10-00_course1',
        keyType: 'primary'
      }]
    })
    assert.deepEqual(result, expected);
  });

  it('remove a spot from waiting list', function() {
    // dependencies
    glib.getCourseIdMap = function() {
      return mockCourseIdMap2Items;
    }
    glib.getCourseData = function() {
      return {
        reservedList: ['user1'],
        waitingList: ['user2'],
        capacity: 3,
        rowNum: 2
      }
    }
    glib.updateScheduleSheet = function() {
      return ''
    }

    // expected result
    const expected = [{
      code: CODE.SUCCESS_CANCEL,
      details: {
        courseKey: '2025-03-01_10-00_course1',
        idx: -1
      }
    }];

    // testing result
    const result = glib.cancelReservation({
      type: ACTION.CANCEL,
      quantity: 1,
      reserveName: 'user2',
      courseKeys: [{
        courseKey: '2025-03-01_10-00_course1',
        keyType: 'primary'
      }]
      
    })
    assert.deepEqual(result, expected);
  });
});

describe('Test handleSchedule heleprs', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('addToList should return joined strings', function() {
    const expected = 'str1,str2';
    assert.equal(glib.addToList('str2', ['str1']), expected);
  });

  it('removeFromList should return filtered strings', function() {
    const expected = 'str1';
    assert.equal(glib.removeFromList('str2', ['str1','str2']), expected);
  });

  it('turn string into array', function() {
    const expected = ['str1', 'str2'];
    assert.deepEqual(glib.strToArr('str1,str2'), expected);
  });

  it('add name to a joined string', function() {
    assert.equal(glib.addToList('', []), '');
    assert.equal(glib.addToList('str1', []), 'str1');
    assert.equal(glib.addToList('str2', ['str1']), 'str1,str2');
    assert.equal(glib.addToList('str3', ['str1','str2']), 'str1,str2,str3');
  });

  it('remove name from a joined string', function() {
    assert.equal(glib.removeFromList('str1', ['str1']), '');
    assert.equal(glib.removeFromList('str1', ['str1','str2']), 'str2');
    assert.equal(glib.removeFromList('str2', ['str1','str2']), 'str1');
  });
});
