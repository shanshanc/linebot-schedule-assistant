const gas = require('gas-local');
const assert = require('assert');
let glib;

describe('Test extractTime getHourMinute', function() {
  beforeEach(function() {
    glib = gas.require('./src');
  });

  it('call extract time when string has colon', function() {
    glib.extractTime = function() {
      return {hour: 10, minute: 0};
    };

    assert.deepEqual(glib.getHourMinute('預約1/3 10:00哈達'), {hour: 10, minute: 0});
  });

  it('call extract time when string has no colon', function() {
    glib.findTime = function() {
      return {hour: 10, minute: 0};
    };

    assert.deepEqual(glib.getHourMinute('預約1/3 10點哈達'), {hour: 10, minute: 0});
  });
});

describe('Test extractTime from user message', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('extract time from string contains colon', function() {
    assert.deepEqual(glib.extractTime('預約1/3 10:00哈達'), {hour: 10, minute: 0});
    assert.deepEqual(glib.extractTime('預約3/30 14:00瑜珈輪'), {hour: 14, minute: 0});
    assert.deepEqual(glib.extractTime('預約10/2 19:00基礎'), {hour: 19, minute: 0});
  });

  it('extract time from string contains hour identifier', function() {
    const expected1000 = {hour: 10, minute: 0};
    assert.deepEqual(glib.findTime('預約1/3 10點哈達'), expected1000);

    const expected1030 = {hour: 10, minute: 30};
    assert.deepEqual(glib.findTime('預約1/4 10點半美體'), expected1030);

    const expected1100 = {hour: 11, minute: 0};
    assert.deepEqual(glib.findTime('預約10/2 11.基礎'), expected1100);

    const expected1900 = {hour: 19, minute: 0};
    assert.deepEqual(glib.findTime('預約今晚7點基礎'), expected1900);
    assert.deepEqual(glib.findTime('預約今晚7.基礎'), expected1900);
    assert.deepEqual(glib.findTime('預約明晚7點基礎'), expected1900);
  });

  it('extract time from string contains hhmm', function() {
    const expected1000 = {hour: 10, minute: 0};
    assert.deepEqual(glib.findTimeFromHhMm('預約1/3 1000點哈達'), expected1000);

    const expected1900 = {hour: 19, minute: 0};
    assert.deepEqual(glib.findTimeFromHhMm('預約1/4 1900美體'), expected1900);
  });
});

describe('Test extractTime helper', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('generate two-digit string', function() {
    assert.equal(glib.generateTwoDigitStr(0), '00');
    assert.equal(glib.generateTwoDigitStr(1), '01');
    assert.equal(glib.generateTwoDigitStr(10), '10');
  });
});
