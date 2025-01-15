const gas = require('gas-local');
const assert = require('assert');
let glib;

describe('Test extratDate find date', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('extract dates for today', function() {
    const fakeToday = new Date('2025-01-01').valueOf();
    glib.getDateObj = function() {
      return fakeToday;
    }

    assert.equal(glib.findDate('預約今天10:00哈達'), fakeToday);
    assert.equal(glib.findDate('預約早上10:00哈達'), fakeToday);
    assert.equal(glib.findDate('預約明天早上流動'), fakeToday);
  });

  it('extract dates for tomorrow', function() {
    const fakeToday = new Date('2025-01-01').valueOf();
    glib.getDateObj = function() {
      return fakeToday;
    }

    const expected = new Date('2025-01-02').valueOf();
    assert.equal(glib.findDate('預約明天10:00哈達'), expected);
    assert.equal(glib.findDate('預約明晚基礎'), expected);
  });
});

describe('Test extractDate from standard user message', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('returns null if not relevant string', function() {
    assert.equal(glib.extractDate('hello world'), null);
  });

  it('extract dates from standard messages', function() {
    // Jan 3rd 2025
    const expected0103 = 1735833600000;
    assert.equal(glib.extractDate('預約1/3 10:00哈達'), expected0103);

    // Dec 15th 2025
    const expected1215 = 1765728000000;
    assert.equal(glib.extractDate('預約12/15 10:30流動'), expected1215);

    // Oct 2nd 2025
    const expected1002 = 1759334400000;
    assert.equal(glib.extractDate('預約10/2 19:00基礎'), expected1002);

     // Mar 30th 2025
     const expected0330 = 1743264000000;
     assert.equal(glib.extractDate('預約3/30 14:00瑜珈輪'), expected0330);
  });

  it('extract date for the next year', function() {
    // mock
    const fakeToday = new Date('2024-12-28');
    glib.getDateObj = function() {
      return fakeToday;
    };

    // expected
    // Jan 5th 2025
    const expected0105 = 1736006400000;
    assert.equal(glib.extractDate('預約1/5 13:00哈達'), expected0105);
  });
});

describe('Test extractDate get tomorrow timestamps', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('get tomorrow timestamp 0101', function() {
    // 2025-01-01 is a Wednesday (index 3)
    const fakeToday = new Date('2025-01-01');
    glib.getDateObj = function() {
      return fakeToday;
    }

    assert.equal(glib.getTomorrowStamp(), new Date('2025-01-02').valueOf());
  });
});

describe('Test extractDate get latest weekday timestamps', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('extract weekdays the same week 0101', function() {
    // 2025-01-01 is a Wednesday (index 3)
    const fakeToday = new Date('2025-01-01');
    glib.getDateObj = function() {
      return fakeToday;
    }

    assert.equal(glib.getLatestWeekdayStamp(5), new Date('2025-01-03').valueOf());
    assert.equal(glib.getLatestWeekdayStamp(6), new Date('2025-01-04').valueOf());
  });

  it('extract weekdays the same week 1230', function() {
    // 2024-12-30 is a Monday (index 1)
    const fakeToday = new Date('2024-12-30');
    glib.getDateObj = function() {
      return fakeToday;
    }

    assert.equal(glib.getLatestWeekdayStamp(5), new Date('2025-01-03').valueOf());
    assert.equal(glib.getLatestWeekdayStamp(6), new Date('2025-01-04').valueOf());
  });

  it('extract weekdays next week 0101', function() {
    // 2025-01-01 is a Wednesday (index 3)
    const fakeToday = new Date('2025-01-01');
    glib.getDateObj = function() {
      return fakeToday;
    }

    assert.equal(glib.getLatestWeekdayStamp(1), new Date('2025-01-06').valueOf());
    assert.equal(glib.getLatestWeekdayStamp(2), new Date('2025-01-07').valueOf());
  });
});

describe('Test extractDate helpers', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('get weekday index', function() {
    assert.equal(glib.getWeekdayIndex('星期日'), 0);
    assert.equal(glib.getWeekdayIndex('星期一'), 1);
    assert.equal(glib.getWeekdayIndex('星期二'), 2);
    assert.equal(glib.getWeekdayIndex('星期三'), 3);
    assert.equal(glib.getWeekdayIndex('星期四'), 4);
    assert.equal(glib.getWeekdayIndex('星期五'), 5);
    assert.equal(glib.getWeekdayIndex('星期六'), 6);
  });

  it('get date object for today if no input timestamp', function() {
    const todayZeroClock = new Date();
    todayZeroClock.setHours(0, 0, 0, 0);
    assert.equal(glib.getDateObj().valueOf(), todayZeroClock.valueOf());
  });

  it('get date object if timestamp', function() {
    // Jan 3rd 2025 10:00
    const expected0103 = 1735833600000;
    assert.equal(glib.getDateObj(1735833600000).valueOf(), expected0103);
  });

  it('increase timestamp by n number of days', function() {
    const fakeDate = new Date('2025-01-01').valueOf();
    
    const expected0102 = new Date('2025-01-02').valueOf();
    assert.equal(glib.increaesByN(fakeDate, 1), expected0102);

    const expected0105 = new Date('2025-01-06').valueOf();
    assert.equal(glib.increaesByN(fakeDate, 5), expected0105);
  });
});