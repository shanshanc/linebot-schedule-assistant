const gas = require('gas-local');
const assert = require('assert');
const glib = gas.require('./src');

describe('Test utils', function() {
  it('find matched value in input string from a list', function() {
      assert.equal(glib.findMatchedValue('預約12/3 11:30空瑜', ['基礎', '空瑜', '哈達']), '空瑜');
      assert.equal(glib.findMatchedValue('預約12/3 19:00基礎', ['基礎', '空瑜', '哈達']), '基礎');
      assert.equal(glib.findMatchedValue('取消明天10點頌缽', ['基礎', '空瑜', '哈達']), null);
      assert.equal(glib.findMatchedValue('12/3', ['/', '／']), '/');
    });
});
