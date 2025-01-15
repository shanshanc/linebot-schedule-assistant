const gas = require('gas-local');
const assert = require('assert');
let glib;

const {
  CODE
} = require('../src/config');

describe('Test handleMessage', function() {
  before(function() {
    glib = gas.require('./src');
  });

  it('create action response', function() {
    const expected = {
      code: CODE.RESERVE_SUCCESS_CODE,
      details: {
        idx: -1,
        courseKey: ''
      }
    };
    assert.deepEqual(glib.createScheduleActionResponse(CODE.RESERVE_SUCCESS_CODE, {}), expected);
  });

  it('formatTextMessage should return Line text object', function() {
    const msg = 'reply message'
    const expected = [{
        type: "text",
        text: msg
    }]
      assert.deepEqual(glib.formatTextMessage('reply message'), expected);
    });

    it('generate coruse info string for reply message - one course', function() {
      const input = [{
        code: 1,
        details: {
          courseKey: '2025-03-01_1000_course1',
          idx: 2
        }
      }];
      const expected = '預約成功 2025-03-01 1000 course1 第2位\n';

      assert.equal(glib.getListItemInfo(input), expected);
    });

    it('generate coruse info string for reply message - multiple courses', function() {
      const input = [{
        code: 1,
        details: {
          courseKey: '2025-03-01_1000_course1',
          idx: 2
        }
      },{
        code: 1,
        details: {
          courseKey: '2025-03-02_1130_course2',
          idx: 2
        }
      }];
      const expected = '預約成功 2025-03-01 1000 course1 第2位\n預約成功 2025-03-02 1130 course2 第2位\n';

      assert.equal(glib.getListItemInfo(input), expected);
    });

    it('get action type message based on result code', function() {
      assert.equal(glib.getActionResultStr(1), '預約成功');
      assert.equal(glib.getActionResultStr(2), '候補');
      assert.equal(glib.getActionResultStr(3), '已取消');
      assert.equal(glib.getActionResultStr(-1), '沒有成功 QQ');
    });
});
