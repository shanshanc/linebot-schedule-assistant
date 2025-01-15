var CHANNEL_ACCESS_TOKEN = '',
    USER_FOLDER_ID = '',
    SCHEDULE_URL = '',
    ACTION = {},
    CODE = {},
    COURSE_NAMES,
    COURSE_KEY_TYPE = {},
    DATETIME_KEYWORDS = {},
    SCHEDULE = {},
    STUDENT = {},
    USER_REQUEST = {},
    IDENTIFIERS = [],
    QUANTITY_KEYWORDS ={};


function initConfig() {
  CHANNEL_ACCESS_TOKEN = 'CHANNEL_ACCESS_TOKEN';
  USER_FOLDER_ID = 'USER_FOLDER_ID';
  SCHEDULE_URL = 'SCHEDULE_URL';

  SCHEDULE = {
    SHEET_NAME: 'schedule',
    ROW_OFFSET: 2,
    START_ROW: 2,
    START_COL: 1,

    COURSE_NAME_COL: 6,
    CAPACITY_COL: 8,
    RESERVED_LIST_COL: 9,
    WAITING_LIST_COL: 10,
    COURSE_KEY_COL: 11,
    SECONDARY_KEY_COL: 12,
    TERTIARY_KEY_COL: 13
  };

  STUDENT = {
    SHEET_NAME: 'Sheet1',
    ROW_OFFSET: 9,
    RECORD_COURSEKEY_COL: 1,
    RECORD_QUANTITY_COL: 2
  };

  ACTION = {
    ADD: 'add',
    CANCEL: 'cancel'
  };

  CODE = {
    ERROR: -1,
    SUCCESS_RESERVE: 1,
    SUCCESS_WAIT: 2,
    SUCCESS_CANCEL: 3
  }

  USER_REQUEST = {
    ADD: ['預約', '約'],
    ADD_ONE: ['+1', '加一', '＋1', '十1', '預約', '約'],
    ADD_TWO: ['+2', '加二', '＋2', '十2'],
    CANCEL: ['-1', '減一', '取消', '請假'],
    MULTIPLE_USER: '位'
  };
  
  COURSE_NAMES = ['哈達', '基礎', '流動', '空瑜', '美體', '陰陽', '敲筋'];
  COURSE_KEY_TYPE = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    TERTIARY: 'tertiary'
  };

  DATETIME_KEYWORDS = {
    TODAY: ['今天', '今晚', '早上', '下午', '晚上'],
    EVENING: ['今晚', '晚上', '明晚'],
    TOMORROW: ['明天', '明晚', '明日', '明早'],
    WEEKDAY: {
      '日': 0,
      // Unicode CJK 19968 and Bopomofo 12583. Ref: https://www.ssec.wisc.edu/~tomw/java/unicode.html
      '一': 1,
      'ㄧ': 1,
      '二': 2,
      '三': 3,
      '四': 4,
      '五': 5,
      '六': 6,
      '週1': 1,
      '週2': 2,
      '週3': 3,
      '週4': 4,
      '週5': 5,
      '週6': 6,
      '周1': 1,
      '周2': 2,
      '周3': 3,
      '周4': 4,
      '周5': 5,
      '周6': 6
    },
    NEXT_WEEK: ['下', '下週'],
    TIMESLOT: ['早上', '下午', '晚上']
  }

  IDENTIFIERS = {
    SLASH: ['/', '／'],
    COLON: [':', '：'],
    HOUR: ['點', '.'],
    HALFHOUR: '點半'
  }

  QUANTITY_KEYWORDS = {
    "一": 1,
    "二": 2,
    "兩": 2,
    "三": 3
  }
}

// initConfig for local testing
initConfig();

// export variables for local testing
var exports = exports || {};
var module = module || { exports: exports };
Object.defineProperty(exports, '__esModule', { value: true });

module.exports = {
  CHANNEL_ACCESS_TOKEN,
  USER_FOLDER_ID,
  SCHEDULE_URL,
  SCHEDULE,
  STUDENT,
  ACTION,
  CODE,
  IDENTIFIERS,
  USER_REQUEST,
  COURSE_NAMES,
  COURSE_KEY_TYPE,
  DATETIME_KEYWORDS,
  QUANTITY_KEYWORDS
}
