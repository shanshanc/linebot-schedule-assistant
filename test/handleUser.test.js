const gas = require('gas-local');
const assert = require('assert');
let glib;

describe('Test handleUser add record to student file', function() {
  beforeEach(() => {
    glib = {};
  });

  it('add record to student file', function() {
    // dependencies
    glib = gas.require('./src');
    glib.findTargetRowNum = function() {
      return 2;
    }

    // mock input
    const mockData = {
      courseKey: '2025-03-01_10-00_course1',
      quantity: 1
    }
    const mockSheet = {
      getRange: function() {
        return this
      },
      getValue: function() {
        return '2025-03-01_10-00_course1';
      },
      getLastRow: function() {
        return 0;
      },
      setValue: function() {
        return ''
      }
    }

    assert.equal(glib.addToRecord(mockData, mockSheet), true);
  });

  it('remove record from student file - delete record', function() {
    // dependencies
    glib = gas.require('./src');
    glib.findTargetRowNum = function() {
      return 2;
    }

    // mock input
    const mockData = {
      courseKey: '2025-03-01_10-00_course1',
      quantity: 1
    }
    const mockSheet = {
      getRange: function() {
        return this
      },
      getValue: function() {
        return 1;
      },
      getLastRow: function() {
        return 1;
      },
      setValue: function() {
        return ''
      },
      deleteRow: function() {}
    }

    assert.equal(glib.removeFromRecord(mockData, mockSheet), true);
  });

  it('report success if add successfully', function() {
    // dependencies
    glib = gas.require('./src');
    glib.createStudentIdMap = function() {
      return {};
    }
    glib.findStudentFileUrl = function() {
      return 'studentFileUrl';
    }
    glib.getTargetSheet = function() {
      return {};
    }
    glib.addToRecord = function() {
      return true;
    }

    // mock input
    const mockScheduleResultList = [{
      code: 1,
      details: {
        idx: 2,
        courseKey: '2025-03-01_10-00_course1',
      }
    }];

    // expected
    const expected = [{
      code: 1,
      details: {
        courseKey: '2025-03-01_10-00_course1'
      }
    }];

    assert.deepEqual(glib.addRecord(mockScheduleResultList), expected);
  });
});

describe('Test handleUser remove record from student file', function() {
  beforeEach(() => {
    glib = {};
  });

  it('remove record from student file - one record', function() {
    // dependencies
    glib = gas.require('./src');
    glib.findTargetRowNum = function() {
      return 2;
    }

    // mock input
    const mockAction = {
      courseKey: '2025-03-01_10-00_course1',
      quantity: 1
    }
    const mockSheet = {
      getRange: function() {
        return this
      },
      getValue: function() {
        return 1;
      },
      getLastRow: function() {
        return 1;
      },
      deleteRow: function() {}
    }

    assert.equal(glib.removeFromRecord(mockAction, mockSheet), true);
  });
});

describe('Test handleUser helpers', function() {
  beforeEach(() => {
    glib = {};
  });

  it('find target courseKey row number in user file', function() {
    glib = gas.require('./src');
    const mockSheet = {
      getLastRow: function() {
        return 10;
      },
      getRange: function() {
        return this;
      },
      getValues: function() {
        return [
          [ "2025-03-01_1000_course1" ],
          [ "2025-03-02_1130_course2" ]
        ];
      }
    };

    const matched = glib.findTargetRowNum("2025-03-02_1130_course2", mockSheet);
    assert.equal(matched, 10);

    const notMatched = glib.findTargetRowNum("2025-03-02_1130_course3", mockSheet);
    assert.equal(notMatched, null);
  });
});
