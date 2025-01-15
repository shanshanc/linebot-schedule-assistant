const gas = require('gas-local');
const assert = require('assert');
let glib;

describe('Test handleAction generate course keys', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('generate primary course key', function() {
    const expected = '2025-03-01_1000_course1';
    assert.equal(glib.generatePrimaryKey(1740794400000, 'course1'), expected);
  });

  it('generate secondary course key', function() {
    const expected = '2025-03-01_1000';
    assert.equal(glib.generateSecondaryKey(1740758400000, 10, 0), expected);
  });

  it('generate tertiary course key', function() {
    const expected = '2025-03-01_早上course1';
    assert.equal(glib.generateTertiaryKey(1740794400000, '早上', 'course1'), expected);
  });
});

describe('Test handleAction compose action object', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('generate action object - primary key', function() {
    glib.getUserAction = function() {
      return 'add';
    }
    glib.findDate = function() {
      return 1740794400000;
    }
    glib.findMatchedValue = function() {
      return 'course1';
    }
    glib.getHourMinute = function() {
      return { hour: 10, minute: 0 };
    }
    const expected = {
      type: 'add',
      reserveName: 'nickname',
      courseKeys: [{
        courseKey: '2025-03-01_1000_course1',
        keyType: 'primary',
        quantity: 1
      }]
    };
    assert.deepEqual(glib.composeActionObj('預約12/3 10:00 course1', 'nickname'), expected);
  });

  it('generate action object - secondary key', function() {
    glib.getUserAction = function() {
      return 'add';
    }
    glib.findDate = function() {
      return 1740794400000;
    }
    glib.findMatchedValue = function() {
      return null;
    }
    glib.getHourMinute = function() {
      return { hour: 10, minute: 0 };
    }
    glib.generateSecondaryKey = function() {
      return '2025-03-01_1000';
    }
    const expected = {
      type: 'add',
      reserveName: 'nickname',
      courseKeys: [{
        courseKey: '2025-03-01_1000',
        keyType: 'secondary',
        quantity: 1
      }]
    };
    assert.deepEqual(glib.composeActionObj('預約12/3 10:00', 'nickname'), expected);
  });

  it('generate action object - tertiary key', function() {
    glib.getUserAction = function() {
      return 'add';
    }
    glib.findDate = function() {
      return 1740758400000;
    }
    glib.generateTertiaryKey = function() {
      return '2025-03-01_早上哈達';
    }
    const expected = {
      type: 'add',
      reserveName: 'nickname',
      courseKeys: [{
        courseKey: '2025-03-01_早上哈達',
        keyType: 'tertiary',
        quantity: 1
      }],
    };
    assert.deepEqual(glib.composeActionObj('預約12/3早上哈達', 'nickname'), expected);
  });
});

// action helpers
describe('Test handleAction helpers', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('check if there are multiple requests in message', function() {
    assert.equal(glib.isMultiple('預約:\n12/3 11:30空瑜\n12/4 19:00基礎'), true);
    assert.equal(glib.isMultiple('預約12/3 11:30空瑜'), false);
  });

  it('get action type', function() {
    assert.equal(glib.getUserAction('預約12/3 11:30空瑜'), 'add');
    assert.equal(glib.getUserAction('取消12/5 10:00基礎'), 'cancel');
  });

  it('get the number of users in request string', function() {
    assert.equal(glib.findRequestedUserNumber('預約12/3 11:30空瑜'), 1);
    assert.equal(glib.findRequestedUserNumber('預約12/3 11:30空瑜2位'), 2);
    assert.equal(glib.findRequestedUserNumber('預約12/3 11:30空瑜兩位'), 2);
  });
});
