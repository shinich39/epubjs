// libs/util.js
var __uniq__ = 0;
function isBoolean(obj) {
  return typeof obj === "boolean";
}
function isNumber(obj) {
  return typeof obj === "number" && !Number.isNaN(obj) && Number.isFinite(obj);
}
function isNumeric(obj) {
  if (isString(obj)) {
    return !Number.isNaN(parseFloat(obj)) && Number.isFinite(parseFloat(obj));
  } else {
    return isNumber(obj);
  }
}
function isString(obj) {
  return typeof obj === "string";
}
function isEmptyString(obj) {
  return isString(obj) && obj.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "") === "";
}
function isObject(obj) {
  return typeof obj === "object" && obj !== null && obj.constructor === Object && Object.getPrototypeOf(obj) === Object.prototype;
}
function isEmptyObject(obj) {
  return isObject(obj) && Object.keys(obj).length === 0;
}
function isNull(obj) {
  return typeof obj === "object" && obj === null;
}
function isArray(obj) {
  if (Array && Array.isArray) {
    return Array.isArray(obj);
  } else {
    return Object.prototype.toString.call(obj) === "[object Array]";
  }
}
function isBooleanArray(obj) {
  if (!isArray(obj)) {
    return false;
  }
  for (const item of obj) {
    if (!isBoolean(item)) {
      return false;
    }
  }
  return true;
}
function isNumberArray(obj) {
  if (!isArray(obj)) {
    return false;
  }
  for (const item of obj) {
    if (!isNumber(item)) {
      return false;
    }
  }
  return true;
}
function isStringArray(obj) {
  if (!isArray(obj)) {
    return false;
  }
  for (const item of obj) {
    if (!isString(item)) {
      return false;
    }
  }
  return true;
}
function isObjectArray(obj) {
  if (!isArray(obj)) {
    return false;
  }
  for (const item of obj) {
    if (!isObject(item)) {
      return false;
    }
  }
  return true;
}
function isEmptyArray(obj) {
  return isArray(obj) && obj.length === 0;
}
function isFunction(obj) {
  return typeof obj === "function";
}
function isEmpty(obj) {
  return obj === void 0 || isNull(obj);
}
function isUndefined(obj) {
  return obj === void 0;
}
function isSameType(objA, objB) {
  return typeof objA === typeof objB && objA.constructor === objB.constructor;
}
function random(min, max) {
  return Math.random() * (max - min) + min;
}
function splitInt(str) {
  return str.split(/([0-9]+)/);
}
function splitFloat(str) {
  return str.split(/([0-9]{0,}\.{0,1}[0-9]{1,})+/);
}
function toHalfWidth(str) {
  return str.replace(/[！-～]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 65248);
  }).replace(/[^\S\r\n]/g, function(ch) {
    return " ";
  });
}
function toFullWidth(str) {
  return str.replace(/[!-~]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 65248);
  }).replace(/[^\S\r\n]/g, function(ch) {
    return "\u3000";
  });
}
function compareStrings(strA, strB) {
  function C(a, b) {
    const dp = [];
    for (let i = 0; i < a.length + 1; i++) {
      dp.push([]);
      for (let j = 0; j < b.length + 1; j++) {
        dp[i][j] = 0;
      }
    }
    return dp;
  }
  function M(dp, a, b) {
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    return dp;
  }
  function P(dp, a, b) {
    let MATCH2 = 0, INSERT = 1, DELETE = -1, res = [], matches = 0, i = a.length, j = b.length;
    while (i > 0 || j > 0) {
      const prev = res[res.length - 1];
      const itemA = a[i - 1];
      const itemB = b[j - 1];
      if (i > 0 && j > 0 && itemA === itemB) {
        if (prev && prev.type === MATCH2) {
          prev.value = itemA + prev.value;
        } else {
          res.push({ type: MATCH2, value: itemA });
        }
        matches++;
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        if (prev && prev.type === INSERT) {
          prev.value = itemB + prev.value;
        } else {
          res.push({ type: INSERT, value: itemB });
        }
        j--;
      } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
        if (prev && prev.type === DELETE) {
          prev.value = itemA + prev.value;
        } else {
          res.push({ type: DELETE, value: itemA });
        }
        i--;
      }
    }
    return {
      acc: matches * 2 / (a.length + b.length),
      result: res.reverse()
    };
  }
  return P(M(C(strA, strB), strA, strB), strA, strB);
}
function id() {
  return Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3).toString(16) + "xxxxxx".replace(/x/g, function(v) {
    return Math.floor(Math.random() * 16).toString(16);
  }) + (__uniq__++).toString(16).padStart(6, "0");
}
function xor(str, salt) {
  if (salt.length === 0) {
    return str;
  }
  let res = "", i = 0;
  while (salt.length < str.length) {
    salt += salt;
  }
  while (i < str.length) {
    res += String.fromCharCode(str.charCodeAt(i) ^ salt.charCodeAt(i));
    i++;
  }
  return res;
}
function parseCommand(str) {
  let result = [], i = 0, tmp = str.replace(/\\'|\\"/g, "00"), bracket = null, part = "";
  while (i < str.length) {
    if (!bracket) {
      if (tmp[i] === "'" || tmp[i] === '"') {
        bracket = str[i];
      } else if (tmp[i] === " ") {
        if (part !== "") {
          result.push(part);
          part = "";
        }
      } else {
        part += str[i];
      }
    } else {
      if (tmp[i] === bracket) {
        result.push(part);
        part = "";
        bracket = null;
      } else {
        part += str[i];
      }
    }
    i++;
  }
  if (part.trim() !== "") {
    result.push(part);
  }
  return result;
}
function parseQuery(str) {
  const qs = str.indexOf("?") > -1 ? str.split("?").pop() : str;
  let result = {};
  for (const [key, value] of new URLSearchParams(qs).entries()) {
    if (!result[key]) {
      result[key] = [value];
    } else {
      result[key].push(value);
    }
  }
  return result;
}
function parseTemplate(str, obj) {
  return str.replace(/\$\{[^}]+\}/g, function(item) {
    const key = item.substring(2, item.length - 1) ?? "";
    if (key.indexOf(".") > -1) {
      return parseTemplate(
        "${" + key.split(".").slice(1).join(".") + "}",
        obj[key.split(".")[0]]
      );
    } else {
      return obj[key] ?? "";
    }
  });
}
function createArray(len, value) {
  let arr = new Array(len);
  if (isFunction(value)) {
    for (let i = 0; i < len; i++) {
      arr[i] = value(i);
    }
  } else if (isObject(value)) {
    for (let i = 0; i < len; i++) {
      arr[i] = clone(value);
    }
  } else if (isArray(value)) {
    for (let i = 0; i < len; i++) {
      arr[i] = clone(value);
    }
  } else if (typeof value !== "undefined") {
    for (let i = 0; i < len; i++) {
      arr[i] = value;
    }
  }
  return arr;
}
function getMinValue(arr) {
  return arr.reduce(function(prev, curr) {
    return curr < prev ? curr : prev;
  }, arr[0] || 0);
}
function getMaxValue(arr) {
  return arr.reduce(function(prev, curr) {
    return curr > prev ? curr : prev;
  }, arr[0] || 0);
}
function getMeanValue(arr) {
  return arr.reduce(function(prev, curr) {
    return prev + curr;
  }, 0) / arr.length;
}
function getModeValue(arr) {
  let seen = {}, maxValue = arr[0], maxCount = 1;
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    seen[value] = seen[value] ? seen[value] + 1 : 1;
    if (seen[value] > maxCount) {
      maxValue = value;
      maxCount = seen[value];
    }
  }
  return maxValue;
}
function sortArray(arr) {
  const priorities = [
    isUndefined,
    isNull,
    isBoolean,
    isNumber,
    isString,
    isObject,
    isArray,
    isFunction
  ];
  return arr.sort(function(a, b) {
    const aIdx = priorities.findIndex(function(fn) {
      return fn(a);
    });
    const bIdx = priorities.findIndex(function(fn) {
      return fn(b);
    });
    if (aIdx !== bIdx) {
      return aIdx - bIdx;
    } else if (aIdx === 0 || aIdx === 1) {
      return 0;
    } else if (aIdx === 2) {
      return a !== b ? a ? 1 : -1 : 0;
    } else if (aIdx === 3) {
      return a - b;
    } else if (aIdx === 4) {
      return a.localeCompare(b, void 0, {
        numeric: true,
        sensitivity: "base"
      });
    } else if (aIdx === 5) {
      return Object.keys(a).length - Object.keys(b).length;
    } else if (aIdx === 6) {
      return a.length - b.length;
    } else {
      return 0;
    }
  });
}
function shuffleArray(arr) {
  let i = arr.length;
  while (i > 0) {
    let j = Math.floor(Math.random() * i);
    i--;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function getRandomValue(arr) {
  return arr[Math.floor(random(0, arr.length))];
}
function getAllCases(arr) {
  function getFirstIndexes(a) {
    if (a.length < 1) {
      return;
    }
    const result2 = [];
    for (let i = 0; i < a.length; i++) {
      result2.push(0);
    }
    return result2;
  }
  function getNextIndexes(a, indexes2) {
    for (let i = a.length - 1; i >= 0; i--) {
      if (indexes2[i] < a[i].length - 1) {
        indexes2[i] += 1;
        return indexes2;
      }
      indexes2[i] = 0;
    }
    return;
  }
  function getValues(a, indexes2) {
    const result2 = [];
    for (let i = 0; i < a.length; i++) {
      result2.push(a[i][indexes2[i]]);
    }
    return result2;
  }
  const result = [];
  let indexes = getFirstIndexes(arr);
  while (indexes) {
    const values = getValues(arr, indexes);
    result.push(values);
    indexes = getNextIndexes(arr, indexes);
  }
  return result;
}
function copyObject(obj) {
  const result = isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = isObject(value) && !isNull(value) ? copyObject(value) : value;
  }
  return result;
}
function groupByKey(arr, key) {
  const group = {};
  for (const obj of arr) {
    if (!group[String(obj[key])]) {
      group[String(obj[key])] = [obj];
    } else {
      group[String(obj[key])].push(obj);
    }
  }
  return group;
}
function queryObject(obj, qry) {
  const QUERY_OPERATORS = {
    and: ["$and"],
    notAnd: ["$notAnd", "$nand"],
    or: ["$or"],
    notOr: ["$notOr", "$nor"],
    not: ["$not"],
    include: ["$include", "$in"],
    exclude: ["$exclude", "$nin"],
    greaterThan: ["$greaterThan", "$gt"],
    greaterThanOrEqual: ["$greaterThanOrEqual", "$gte"],
    lessThan: ["$lessThan", "$lt"],
    lessThanOrEqual: ["$lessThanOrEqual", "$lte"],
    equal: ["$equal", "$eq"],
    notEqual: ["$notEqual", "$neq", "$ne"],
    function: ["$function", "$func", "$fn"],
    regexp: ["$regexp", "$regex", "$re", "$reg"]
  };
  function A(d, q) {
    for (const [key, value] of Object.entries(q)) {
      if (!B(d, value, key.split("."))) {
        return false;
      }
    }
    return true;
  }
  function B(d, q, k) {
    const o = k.shift();
    if (k.length > 0) {
      if (isObject(d)) {
        return B(d[o], q, k);
      } else {
        return false;
      }
    }
    return C(d, q, o);
  }
  function C(d, q, o) {
    if (QUERY_OPERATORS.and.indexOf(o) > -1) {
      for (const v of q) {
        if (!A(d, v)) {
          return false;
        }
      }
      return true;
    } else if (QUERY_OPERATORS.notAnd.indexOf(o) > -1) {
      return !C(d, q, "$and");
    } else if (QUERY_OPERATORS.or.indexOf(o) > -1) {
      for (const v of q) {
        if (A(d, v)) {
          return true;
        }
      }
      return false;
    } else if (QUERY_OPERATORS.notOr.indexOf(o) > -1) {
      return !C(d, q, "$or");
    } else if (QUERY_OPERATORS.not.indexOf(o) > -1) {
      return !A(d, q);
    } else if (QUERY_OPERATORS.include.indexOf(o) > -1) {
      if (isArray(d)) {
        for (const v of d) {
          if (!C(v, q, "$include")) {
            return false;
          }
        }
        return true;
      } else {
        for (const v of q) {
          if (C(d, v, "$equal")) {
            return true;
          }
        }
        return false;
      }
    } else if (QUERY_OPERATORS.exclude.indexOf(o) > -1) {
      return !C(d, q, "$include");
    } else if (QUERY_OPERATORS.greaterThan.indexOf(o) > -1) {
      return d > q;
    } else if (QUERY_OPERATORS.greaterThanOrEqual.indexOf(o) > -1) {
      return d >= q;
    } else if (QUERY_OPERATORS.lessThan.indexOf(o) > -1) {
      return d < q;
    } else if (QUERY_OPERATORS.lessThanOrEqual.indexOf(o) > -1) {
      return d <= q;
    } else if (QUERY_OPERATORS.equal.indexOf(o) > -1) {
      if (isArray(d) && isArray(q)) {
        if (d.length !== q.length) {
          return false;
        }
        for (let i = 0; i < q.length; i++) {
          if (d[i] !== q[i]) {
            return false;
          }
        }
        return true;
      } else {
        return d === q;
      }
    } else if (QUERY_OPERATORS.notEqual.indexOf(o) > -1) {
      return !C(d, q, "$equal");
    } else if (QUERY_OPERATORS.function.indexOf(o) > -1) {
      return q(d);
    } else if (QUERY_OPERATORS.regexp.indexOf(o) > -1) {
      return q.test(d);
    } else if (!isObject(d)) {
      return false;
    } else if (isObject(q)) {
      return A(d[o], q);
    } else {
      return C(d[o], q, "$equal");
    }
  }
  return A(obj, qry);
}
function getContainedSize(src, dst) {
  const aspectRatio = src.width / src.height;
  if (aspectRatio < dst.width / dst.height) {
    return {
      width: dst.height * aspectRatio,
      height: dst.height
    };
  } else {
    return {
      width: dst.width,
      height: dst.width / aspectRatio
    };
  }
}
function getCoveredSize(src, dst) {
  const aspectRatio = src.width / src.height;
  if (aspectRatio < dst.width / dst.height) {
    return {
      width: dst.width,
      height: dst.width / aspectRatio
    };
  } else {
    return {
      width: dst.height * aspectRatio,
      height: dst.height
    };
  }
}
function wait(delay2) {
  return new Promise(function(resolve) {
    return setTimeout(resolve, delay2);
  });
}
function promiseAll(funcs) {
  return funcs.reduce(function(prev, curr) {
    return prev.then(function(prevResult) {
      return curr().then(function(currResult) {
        return prevResult.concat([currResult]);
      });
    });
  }, Promise.resolve([]));
}
var __module__ = {
  isBoolean,
  isNumber,
  isNumeric,
  isString,
  isEmptyString,
  isObject,
  isEmptyObject,
  isNull,
  isArray,
  isBooleanArray,
  isNumberArray,
  isStringArray,
  isObjectArray,
  isEmptyArray,
  isFunction,
  isEmpty,
  isSameType,
  random,
  id,
  xor,
  // XOR
  splitInt,
  splitFloat,
  toHalfWidth,
  toFullWidth,
  diff: compareStrings,
  compare: compareStrings,
  parseCommand,
  parseQuery,
  parseTemplate,
  min: getMinValue,
  max: getMaxValue,
  avg: getMeanValue,
  mean: getMeanValue,
  mode: getModeValue,
  choose: getRandomValue,
  array: createArray,
  sort: sortArray,
  shuffle: shuffleArray,
  cases: getAllCases,
  copy: copyObject,
  clone: copyObject,
  group: groupByKey,
  query: queryObject,
  contain: getContainedSize,
  cover: getCoveredSize,
  wait,
  promiseAll
};
var util_default = __module__;

// libs/jszip.min.js
var external = { Promise };
var support = {
  base64: true,
  array: true,
  string: true,
  nodebuffer: false,
  nodestream: false,
  get arraybuffer() {
    return "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array;
  },
  get uint8array() {
    return "undefined" != typeof Uint8Array;
  },
  get blob() {
    return blob();
  }
};
var blob = function() {
  var e3;
  if ("undefined" == typeof ArrayBuffer) e3 = false;
  else {
    var t = new ArrayBuffer(0);
    try {
      e3 = 0 === new Blob([t], { type: "application/zip" }).size;
    } catch (t2) {
      e3 = false;
    }
  }
  return blob = function() {
    return e3;
  }, e3;
};
var support$1 = support;
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var encode = function(e3) {
  for (var t, r, i, n, a, s, o, h = [], d = 0, l = e3.length, c = l, _ = "string" != typeof e3; d < e3.length; )
    c = l - d, _ ? (t = e3[d++], r = d < l ? e3[d++] : 0, i = d < l ? e3[d++] : 0) : (t = e3.charCodeAt(d++), r = d < l ? e3.charCodeAt(d++) : 0, i = d < l ? e3.charCodeAt(d++) : 0), n = t >> 2, a = (3 & t) << 4 | r >> 4, s = c > 1 ? (15 & r) << 2 | i >> 6 : 64, o = c > 2 ? 63 & i : 64, h.push(
      _keyStr.charAt(n) + _keyStr.charAt(a) + _keyStr.charAt(s) + _keyStr.charAt(o)
    );
  return h.join("");
};
var decode = function(e3) {
  var t, r, i, n, a, s, o = 0, h = 0, d = "data:";
  if (e3.substr(0, 5) === d)
    throw new Error("Invalid base64 input, it looks like a data url.");
  var l, c = 3 * (e3 = e3.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
  if (e3.charAt(e3.length - 1) === _keyStr.charAt(64) && c--, e3.charAt(e3.length - 2) === _keyStr.charAt(64) && c--, c % 1 != 0)
    throw new Error("Invalid base64 input, bad content length.");
  for (l = support$1.uint8array ? new Uint8Array(0 | c) : new Array(0 | c); o < e3.length; )
    t = _keyStr.indexOf(e3.charAt(o++)) << 2 | (n = _keyStr.indexOf(e3.charAt(o++))) >> 4, r = (15 & n) << 4 | (a = _keyStr.indexOf(e3.charAt(o++))) >> 2, i = (3 & a) << 6 | (s = _keyStr.indexOf(e3.charAt(o++))), l[h++] = t, 64 !== a && (l[h++] = r), 64 !== s && (l[h++] = i);
  return l;
};
function string2binary(e3) {
  return stringToArrayLike(
    e3,
    support$1.uint8array ? new Uint8Array(e3.length) : new Array(e3.length)
  );
}
var newBlob = function(e3, t) {
  return checkSupport("blob"), new Blob([e3], { type: t });
};
function identity(e3) {
  return e3;
}
function stringToArrayLike(e3, t) {
  for (var r = 0; r < e3.length; ++r) t[r] = 255 & e3.charCodeAt(r);
  return t;
}
function stringifyByChunk(e3, t, r) {
  var i = [], n = 0, a = e3.length;
  if (a <= r) return String.fromCharCode.apply(null, e3);
  for (; n < a; )
    "array" === t ? i.push(String.fromCharCode.apply(null, e3.slice(n, Math.min(n + r, a)))) : i.push(
      String.fromCharCode.apply(null, e3.subarray(n, Math.min(n + r, a)))
    ), n += r;
  return i.join("");
}
function stringifyByChar(e3) {
  for (var t = "", r = 0; r < e3.length; r++) t += String.fromCharCode(e3[r]);
  return t;
}
var fromCharCodeSupportsTypedArrays = function() {
  var e3;
  try {
    e3 = support$1.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
  } catch (t) {
    e3 = false;
  }
  return fromCharCodeSupportsTypedArrays = function() {
    return e3;
  }, e3;
};
function arrayLikeToString(e3) {
  var t = 65536, r = getTypeOf(e3), i = true;
  if ("uint8array" === r && (i = fromCharCodeSupportsTypedArrays()), i)
    for (; t > 1; )
      try {
        return stringifyByChunk(e3, r, t);
      } catch (e4) {
        t = Math.floor(t / 2);
      }
  return stringifyByChar(e3);
}
var applyFromCharCode = arrayLikeToString;
function arrayLikeToArrayLike(e3, t) {
  for (var r = 0; r < e3.length; r++) t[r] = e3[r];
  return t;
}
var transform = {
  string: {
    string: identity,
    array: function(e3) {
      return stringToArrayLike(e3, new Array(e3.length));
    },
    arraybuffer: function(e3) {
      return transform.string.uint8array(e3).buffer;
    },
    uint8array: function(e3) {
      return stringToArrayLike(e3, new Uint8Array(e3.length));
    }
  },
  array: {
    string: arrayLikeToString,
    array: identity,
    arraybuffer: function(e3) {
      return new Uint8Array(e3).buffer;
    },
    uint8array: function(e3) {
      return new Uint8Array(e3);
    }
  },
  arraybuffer: {
    string: function(e3) {
      return arrayLikeToString(new Uint8Array(e3));
    },
    array: function(e3) {
      return arrayLikeToArrayLike(new Uint8Array(e3), new Array(e3.byteLength));
    },
    arraybuffer: identity,
    uint8array: function(e3) {
      return new Uint8Array(e3);
    }
  },
  uint8array: {
    string: arrayLikeToString,
    array: function(e3) {
      return arrayLikeToArrayLike(e3, new Array(e3.length));
    },
    arraybuffer: function(e3) {
      return e3.buffer;
    },
    uint8array: identity
  }
};
var transformTo = function(e3, t) {
  if (t || (t = ""), !e3) return t;
  checkSupport(e3);
  var r = getTypeOf(t);
  return transform[r][e3](t);
};
var getTypeOf = function(e3) {
  return "string" == typeof e3 ? "string" : "[object Array]" === Object.prototype.toString.call(e3) ? "array" : support$1.uint8array && e3 instanceof Uint8Array ? "uint8array" : support$1.arraybuffer && e3 instanceof ArrayBuffer ? "arraybuffer" : void 0;
};
var checkSupport = function(e3) {
  if (!support$1[e3.toLowerCase()])
    throw new Error(e3 + " is not supported by this platform");
};
var MAX_VALUE_16BITS = 65535;
var MAX_VALUE_32BITS = -1;
var pretty = function(e3) {
  var t, r, i = "";
  for (r = 0; r < (e3 || "").length; r++)
    i += "\\x" + ((t = e3.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
  return i;
};
var delay = function(e3, t, r) {
  setTimeout(function() {
    e3.apply(r || null, t || []);
  }, 0);
};
var extend = function() {
  var e3, t, r = arguments, i = {};
  for (e3 = 0; e3 < arguments.length; e3++)
    for (t in arguments[e3])
      Object.hasOwnProperty.call(r[e3], t) && void 0 === i[t] && (i[t] = r[e3][t]);
  return i;
};
var prepareContent = function(e3, t, r, i, n) {
  return external.Promise.resolve(t).then(function(e4) {
    return support$1.blob && (e4 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(
      Object.prototype.toString.call(e4)
    )) && "undefined" != typeof FileReader ? new external.Promise(function(t2, r2) {
      var i2 = new FileReader();
      i2.onload = function(e5) {
        t2(e5.target.result);
      }, i2.onerror = function(e5) {
        r2(e5.target.error);
      }, i2.readAsArrayBuffer(e4);
    }) : e4;
  }).then(function(t2) {
    var a = getTypeOf(t2);
    return a ? ("arraybuffer" === a ? t2 = transformTo("uint8array", t2) : "string" === a && (n ? t2 = decode(t2) : r && true !== i && (t2 = string2binary(t2))), t2) : external.Promise.reject(
      new Error(
        "Can't read the data of '" + e3 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"
      )
    );
  });
};
var GenericWorker = function(e3) {
  this.name = e3 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
};
GenericWorker.prototype.push = function(e3) {
  this.emit("data", e3);
}, GenericWorker.prototype.end = function() {
  if (this.isFinished) return false;
  this.flush();
  try {
    this.emit("end"), this.cleanUp(), this.isFinished = true;
  } catch (e3) {
    this.emit("error", e3);
  }
  return true;
}, GenericWorker.prototype.error = function(e3) {
  return !this.isFinished && (this.isPaused ? this.generatedError = e3 : (this.isFinished = true, this.emit("error", e3), this.previous && this.previous.error(e3), this.cleanUp()), true);
}, GenericWorker.prototype.on = function(e3, t) {
  return this._listeners[e3].push(t), this;
}, GenericWorker.prototype.cleanUp = function() {
  this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
}, GenericWorker.prototype.emit = function(e3, t) {
  if (this._listeners[e3])
    for (var r = 0; r < this._listeners[e3].length; r++)
      this._listeners[e3][r].call(this, t);
}, GenericWorker.prototype.pipe = function(e3) {
  return e3.registerPrevious(this);
}, GenericWorker.prototype.registerPrevious = function(e3) {
  if (this.isLocked)
    throw new Error("The stream '" + this + "' has already been used.");
  this.streamInfo = e3.streamInfo, this.mergeStreamInfo(), this.previous = e3;
  var t = this;
  return e3.on("data", function(e4) {
    t.processChunk(e4);
  }), e3.on("end", function() {
    t.end();
  }), e3.on("error", function(e4) {
    t.error(e4);
  }), this;
}, GenericWorker.prototype.pause = function() {
  return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
}, GenericWorker.prototype.resume = function() {
  if (!this.isPaused || this.isFinished) return false;
  this.isPaused = false;
  var e3 = false;
  return this.generatedError && (this.error(this.generatedError), e3 = true), this.previous && this.previous.resume(), !e3;
}, GenericWorker.prototype.flush = function() {
}, GenericWorker.prototype.processChunk = function(e3) {
  this.push(e3);
}, GenericWorker.prototype.withStreamInfo = function(e3, t) {
  return this.extraStreamInfo[e3] = t, this.mergeStreamInfo(), this;
}, GenericWorker.prototype.mergeStreamInfo = function() {
  for (var e3 in this.extraStreamInfo)
    this.extraStreamInfo.hasOwnProperty(e3) && (this.streamInfo[e3] = this.extraStreamInfo[e3]);
}, GenericWorker.prototype.lock = function() {
  if (this.isLocked)
    throw new Error("The stream '" + this + "' has already been used.");
  this.isLocked = true, this.previous && this.previous.lock();
}, GenericWorker.prototype.toString = function() {
  var e3 = "Worker " + this.name;
  return this.previous ? this.previous + " -> " + e3 : e3;
};
var GenericWorker$1 = GenericWorker;
var utf8len$1 = function(e3) {
  for (var t = new Array(256), r = 0; r < 256; r++)
    t[r] = r >= 252 ? 6 : r >= 248 ? 5 : r >= 240 ? 4 : r >= 224 ? 3 : r >= 192 ? 2 : 1;
  return t[254] = t[254] = 1, utf8len$1 = function(e4) {
    return t[e4];
  }, t[e3];
};
var string2buf$1 = function(e3) {
  var t, r, i, n, a, s = e3.length, o = 0;
  for (n = 0; n < s; n++)
    55296 == (64512 & (r = e3.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = e3.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
  for (t = support$1.uint8array ? new Uint8Array(o) : new Array(o), a = 0, n = 0; a < o; n++)
    55296 == (64512 & (r = e3.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = e3.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? t[a++] = r : r < 2048 ? (t[a++] = 192 | r >>> 6, t[a++] = 128 | 63 & r) : r < 65536 ? (t[a++] = 224 | r >>> 12, t[a++] = 128 | r >>> 6 & 63, t[a++] = 128 | 63 & r) : (t[a++] = 240 | r >>> 18, t[a++] = 128 | r >>> 12 & 63, t[a++] = 128 | r >>> 6 & 63, t[a++] = 128 | 63 & r);
  return t;
};
var utf8border$1 = function(e3, t) {
  var r;
  for ((t = t || e3.length) > e3.length && (t = e3.length), r = t - 1; r >= 0 && 128 == (192 & e3[r]); )
    r--;
  return r < 0 || 0 === r ? t : r + utf8len$1(e3[r]) > t ? r : t;
};
var buf2string$1 = function(e3) {
  var t, r, i, n, a = e3.length, s = new Array(2 * a);
  for (r = 0, t = 0; t < a; )
    if ((i = e3[t++]) < 128) s[r++] = i;
    else if ((n = utf8len$1(i)) > 4) s[r++] = 65533, t += n - 1;
    else {
      for (i &= 2 === n ? 31 : 3 === n ? 15 : 7; n > 1 && t < a; )
        i = i << 6 | 63 & e3[t++], n--;
      n > 1 ? s[r++] = 65533 : i < 65536 ? s[r++] = i : (i -= 65536, s[r++] = 55296 | i >> 10 & 1023, s[r++] = 56320 | 1023 & i);
    }
  return s.length !== r && (s.subarray ? s = s.subarray(0, r) : s.length = r), applyFromCharCode(s);
};
var utf8encode = function(e3) {
  return string2buf$1(e3);
};
var utf8decode = function(e3) {
  return e3 = transformTo(support$1.uint8array ? "uint8array" : "array", e3), buf2string$1(e3);
};
var Utf8DecodeWorker = function(e3) {
  function t() {
    e3.call(this, "utf-8 decode"), this.leftOver = null;
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(e4) {
    var t2 = transformTo(
      support$1.uint8array ? "uint8array" : "array",
      e4.data
    );
    if (this.leftOver && this.leftOver.length) {
      if (support$1.uint8array) {
        var r = t2;
        (t2 = new Uint8Array(r.length + this.leftOver.length)).set(
          this.leftOver,
          0
        ), t2.set(r, this.leftOver.length);
      } else t2 = this.leftOver.concat(t2);
      this.leftOver = null;
    }
    var i = utf8border$1(t2), n = t2;
    i !== t2.length && (support$1.uint8array ? (n = t2.subarray(0, i), this.leftOver = t2.subarray(i, t2.length)) : (n = t2.slice(0, i), this.leftOver = t2.slice(i, t2.length))), this.push({ data: utf8decode(n), meta: e4.meta });
  }, t.prototype.flush = function() {
    this.leftOver && this.leftOver.length && (this.push({ data: utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
  }, t;
}(GenericWorker$1);
var Utf8EncodeWorker = function(e3) {
  function t() {
    e3.call(this, "utf-8 encode");
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(e4) {
    this.push({ data: utf8encode(e4.data), meta: e4.meta });
  }, t;
}(GenericWorker$1);
var ConvertWorker = function(e3) {
  function t(t2) {
    e3.call(this, "ConvertWorker to " + t2), this.destType = t2;
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(e4) {
    this.push({ data: transformTo(this.destType, e4.data), meta: e4.meta });
  }, t;
}(GenericWorker$1);
var ConvertWorker$1 = ConvertWorker;
function transformZipOutput(e3, t, r) {
  switch (e3) {
    case "blob":
      return newBlob(transformTo("arraybuffer", t), r);
    case "base64":
      return encode(t);
    default:
      return transformTo(e3, t);
  }
}
function concat(e3, t) {
  var r, i = 0, n = null, a = 0;
  for (r = 0; r < t.length; r++) a += t[r].length;
  switch (e3) {
    case "string":
      return t.join("");
    case "array":
      return Array.prototype.concat.apply([], t);
    case "uint8array":
      for (n = new Uint8Array(a), r = 0; r < t.length; r++)
        n.set(t[r], i), i += t[r].length;
      return n;
    default:
      throw new Error("concat : unsupported type '" + e3 + "'");
  }
}
function accumulate(e3, t) {
  return new external.Promise(function(r, i) {
    var n = [], a = e3._internalType, s = e3._outputType, o = e3._mimeType;
    e3.on("data", function(e4, r2) {
      n.push(e4), t && t(r2);
    }).on("error", function(e4) {
      n = [], i(e4);
    }).on("end", function() {
      try {
        var e4 = transformZipOutput(s, concat(a, n), o);
        r(e4);
      } catch (e5) {
        i(e5);
      }
      n = [];
    }).resume();
  });
}
var StreamHelper = function(e3, t, r) {
  var i = t;
  switch (t) {
    case "blob":
    case "arraybuffer":
      i = "uint8array";
      break;
    case "base64":
      i = "string";
  }
  try {
    this._internalType = i, this._outputType = t, this._mimeType = r, checkSupport(i), this._worker = e3.pipe(new ConvertWorker$1(i)), e3.lock();
  } catch (e4) {
    this._worker = new GenericWorker$1("error"), this._worker.error(e4);
  }
};
StreamHelper.prototype.accumulate = function(e3) {
  return accumulate(this, e3);
}, StreamHelper.prototype.on = function(e3, t) {
  var r = this;
  return "data" === e3 ? this._worker.on(e3, function(e4) {
    t.call(r, e4.data, e4.meta);
  }) : this._worker.on(e3, function() {
    delay(t, arguments, r);
  }), this;
}, StreamHelper.prototype.resume = function() {
  return delay(this._worker.resume, [], this._worker), this;
}, StreamHelper.prototype.pause = function() {
  return this._worker.pause(), this;
};
var StreamHelper$1 = StreamHelper;
var base64 = false;
var binary = false;
var dir = false;
var createFolders = true;
var date = null;
var compression = null;
var compressionOptions = null;
var comment = null;
var unixPermissions = null;
var dosPermissions = null;
var defaults = Object.freeze({
  __proto__: null,
  base64,
  binary,
  dir,
  createFolders,
  date,
  compression,
  compressionOptions,
  comment,
  unixPermissions,
  dosPermissions
});
var DEFAULT_BLOCK_SIZE = 16384;
var DataWorker = function(e3) {
  function t(t2) {
    e3.call(this, "DataWorker");
    var r = this;
    this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, t2.then(
      function(e4) {
        r.dataIsReady = true, r.data = e4, r.max = e4 && e4.length || 0, r.type = getTypeOf(e4), r.isPaused || r._tickAndRepeat();
      },
      function(e4) {
        r.error(e4);
      }
    );
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.cleanUp = function() {
    e3.prototype.cleanUp.call(this), this.data = null;
  }, t.prototype.resume = function() {
    return !!e3.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, delay(this._tickAndRepeat, [], this)), true);
  }, t.prototype._tickAndRepeat = function() {
    this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
  }, t.prototype._tick = function() {
    if (this.isPaused || this.isFinished) return false;
    var e4 = DEFAULT_BLOCK_SIZE, t2 = null, r = Math.min(this.max, this.index + e4);
    if (this.index >= this.max) return this.end();
    switch (this.type) {
      case "string":
        t2 = this.data.substring(this.index, r);
        break;
      case "uint8array":
        t2 = this.data.subarray(this.index, r);
        break;
      case "array":
        t2 = this.data.slice(this.index, r);
    }
    return this.index = r, this.push({
      data: t2,
      meta: { percent: this.max ? this.index / this.max * 100 : 0 }
    });
  }, t;
}(GenericWorker$1);
var DataWorker$1 = DataWorker;
var DataLengthProbe = function(e3) {
  function t(t2) {
    e3.call(this, "DataLengthProbe for " + t2), this.propName = t2, this.withStreamInfo(t2, 0);
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(t2) {
    if (t2) {
      var r = this.streamInfo[this.propName] || 0;
      this.streamInfo[this.propName] = r + t2.data.length;
    }
    e3.prototype.processChunk.call(this, t2);
  }, t;
}(GenericWorker$1);
var DataLengthProbe$1 = DataLengthProbe;
var makeTable$1 = function() {
  for (var e3 = [], t = 0; t < 256; t++) {
    for (var r = t, i = 0; i < 8; i++)
      r = 1 & r ? 3988292384 ^ r >>> 1 : r >>> 1;
    e3[t] = r;
  }
  return makeTable$1 = function() {
    return e3;
  }, e3;
};
function crc32$1(e3, t, r, i) {
  var n = makeTable$1(), a = i + r;
  e3 ^= -1;
  for (var s = i; s < a; s++) e3 = e3 >>> 8 ^ n[255 & (e3 ^ t[s])];
  return -1 ^ e3;
}
function crc32str(e3, t, r, i) {
  var n = makeTable$1(), a = i + r;
  e3 ^= -1;
  for (var s = i; s < a; s++) e3 = e3 >>> 8 ^ n[255 & (e3 ^ t.charCodeAt(s))];
  return -1 ^ e3;
}
function crc32wrapper(e3, t) {
  return void 0 !== e3 && e3.length ? "string" !== getTypeOf(e3) ? crc32$1(0 | t, e3, e3.length, 0) : crc32str(0 | t, e3, e3.length, 0) : 0;
}
var Crc32Probe = function(e3) {
  function t() {
    e3.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(e4) {
    this.streamInfo.crc32 = crc32wrapper(
      e4.data,
      this.streamInfo.crc32 || 0
    ), this.push(e4);
  }, t;
}(GenericWorker$1);
var Crc32Probe$1 = Crc32Probe;
var CompressedObject = function(e3, t, r, i, n) {
  this.compressedSize = e3, this.uncompressedSize = t, this.crc32 = r, this.compression = i, this.compressedContent = n;
};
CompressedObject.prototype.getContentWorker = function() {
  var e3 = new DataWorker$1(external.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new DataLengthProbe$1("data_length")), t = this;
  return e3.on("end", function() {
    if (this.streamInfo.data_length !== t.uncompressedSize)
      throw new Error("Bug : uncompressed data size mismatch");
  }), e3;
}, CompressedObject.prototype.getCompressedWorker = function() {
  return new DataWorker$1(external.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
}, CompressedObject.createWorkerFrom = function(e3, t, r) {
  return e3.pipe(new Crc32Probe$1()).pipe(new DataLengthProbe$1("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new DataLengthProbe$1("compressedSize")).withStreamInfo("compression", t);
};
var CompressedObject$1 = CompressedObject;
var ZipObject = function(e3, t, r) {
  this.name = e3, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = t, this._dataBinary = r.binary, this.options = {
    compression: r.compression,
    compressionOptions: r.compressionOptions
  };
};
ZipObject.prototype.internalStream = function(e3) {
  var t = null, r = "string";
  try {
    if (!e3) throw new Error("No output type specified.");
    var i = "string" === (r = e3.toLowerCase()) || "text" === r;
    "binarystring" !== r && "text" !== r || (r = "string"), t = this._decompressWorker();
    var n = !this._dataBinary;
    n && !i && (t = t.pipe(new Utf8EncodeWorker())), !n && i && (t = t.pipe(new Utf8DecodeWorker()));
  } catch (e4) {
    (t = new GenericWorker$1("error")).error(e4);
  }
  return new StreamHelper$1(t, r, "");
}, ZipObject.prototype.async = function(e3, t) {
  return this.internalStream(e3).accumulate(t);
}, ZipObject.prototype._compressWorker = function(e3, t) {
  if (this._data instanceof CompressedObject$1 && this._data.compression.magic === e3.magic)
    return this._data.getCompressedWorker();
  var r = this._decompressWorker();
  return this._dataBinary || (r = r.pipe(new Utf8EncodeWorker())), CompressedObject$1.createWorkerFrom(r, e3, t);
}, ZipObject.prototype._decompressWorker = function() {
  return this._data instanceof CompressedObject$1 ? this._data.getContentWorker() : this._data instanceof GenericWorker$1 ? this._data : new DataWorker$1(this._data);
};
var ZipObject$1 = ZipObject;
var Z_NO_FLUSH = 0;
var Z_PARTIAL_FLUSH = 1;
var Z_SYNC_FLUSH = 2;
var Z_FULL_FLUSH = 3;
var Z_FINISH = 4;
var Z_BLOCK = 5;
var Z_OK = 0;
var Z_STREAM_END = 1;
var Z_NEED_DICT = 2;
var Z_STREAM_ERROR = -2;
var Z_DATA_ERROR = -3;
var Z_BUF_ERROR = -5;
var Z_DEFAULT_COMPRESSION = -1;
var Z_FILTERED = 1;
var Z_HUFFMAN_ONLY = 2;
var Z_RLE = 3;
var Z_FIXED = 4;
var Z_DEFAULT_STRATEGY = 0;
var Z_BINARY = 0;
var Z_TEXT = 1;
var Z_UNKNOWN = 2;
var Z_DEFLATED = 8;
function _has(e3, t) {
  return Object.prototype.hasOwnProperty.call(e3, t);
}
function assign(e3) {
  for (var t = Array.prototype.slice.call(arguments, 1); t.length; ) {
    var r = t.shift();
    if (r) {
      if ("object" != typeof r) throw new TypeError(r + "must be non-object");
      for (var i in r) _has(r, i) && (e3[i] = r[i]);
    }
  }
  return e3;
}
function shrinkBuf(e3, t) {
  return e3.length === t ? e3 : e3.subarray ? e3.subarray(0, t) : (e3.length = t, e3);
}
var fnTyped = {
  arraySet: function(e3, t, r, i, n) {
    if (t.subarray && e3.subarray) e3.set(t.subarray(r, r + i), n);
    else for (var a = 0; a < i; a++) e3[n + a] = t[r + a];
  },
  flattenChunks: function(e3) {
    var t, r, i, n, a, s;
    for (i = 0, t = 0, r = e3.length; t < r; t++) i += e3[t].length;
    for (s = new Uint8Array(i), n = 0, t = 0, r = e3.length; t < r; t++)
      a = e3[t], s.set(a, n), n += a.length;
    return s;
  },
  Buf8: function(e3) {
    return new Uint8Array(e3);
  },
  Buf16: function(e3) {
    return new Uint16Array(e3);
  },
  Buf32: function(e3) {
    return new Int32Array(e3);
  }
};
var fnUntyped = {
  arraySet: function(e3, t, r, i, n) {
    for (var a = 0; a < i; a++) e3[n + a] = t[r + a];
  },
  flattenChunks: function(e3) {
    return [].concat.apply([], e3);
  },
  Buf8: function(e3) {
    return new Array(e3);
  },
  Buf16: function(e3) {
    return new Array(e3);
  },
  Buf32: function(e3) {
    return new Array(e3);
  }
};
var typedOK = function() {
  var e3 = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
  return typedOK = function() {
    return e3;
  }, e3;
};
var arraySet = function(e3, t, r, i, n) {
  return (arraySet = typedOK() ? fnTyped.arraySet : fnUntyped.arraySet)(
    e3,
    t,
    r,
    i,
    n
  );
};
var flattenChunks = function(e3) {
  return (flattenChunks = typedOK() ? fnTyped.flattenChunks : fnUntyped.flattenChunks)(e3);
};
var Buf8 = function(e3) {
  return (Buf8 = typedOK() ? fnTyped.Buf8 : fnUntyped.Buf8)(e3);
};
var Buf16 = function(e3) {
  return (Buf16 = typedOK() ? fnTyped.Buf16 : fnUntyped.Buf16)(e3);
};
var Buf32 = function(e3) {
  return (Buf32 = typedOK() ? fnTyped.Buf32 : fnUntyped.Buf32)(e3);
};
var strApplyOK = function() {
  var e3 = true;
  try {
    String.fromCharCode.apply(null, [0]);
  } catch (t) {
    e3 = false;
  }
  return strApplyOK = function() {
    return e3;
  }, e3;
};
var strApplyUintOK = function() {
  var e3 = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (t) {
    e3 = false;
  }
  return strApplyUintOK = function() {
    return e3;
  }, e3;
};
var utf8len = function(e3) {
  for (var t = Buf8(256), r = 0; r < 256; r++)
    t[r] = r >= 252 ? 6 : r >= 248 ? 5 : r >= 240 ? 4 : r >= 224 ? 3 : r >= 192 ? 2 : 1;
  return t[254] = t[254] = 1, utf8len = function(e4) {
    return t[e4];
  }, t[e3];
};
function string2buf(e3) {
  var t, r, i, n, a, s = e3.length, o = 0;
  for (n = 0; n < s; n++)
    55296 == (64512 & (r = e3.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = e3.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
  for (t = new Uint8Array(o), a = 0, n = 0; a < o; n++)
    55296 == (64512 & (r = e3.charCodeAt(n))) && n + 1 < s && 56320 == (64512 & (i = e3.charCodeAt(n + 1))) && (r = 65536 + (r - 55296 << 10) + (i - 56320), n++), r < 128 ? t[a++] = r : r < 2048 ? (t[a++] = 192 | r >>> 6, t[a++] = 128 | 63 & r) : r < 65536 ? (t[a++] = 224 | r >>> 12, t[a++] = 128 | r >>> 6 & 63, t[a++] = 128 | 63 & r) : (t[a++] = 240 | r >>> 18, t[a++] = 128 | r >>> 12 & 63, t[a++] = 128 | r >>> 6 & 63, t[a++] = 128 | 63 & r);
  return t;
}
function _buf2binstring(e3, t) {
  if (t < 65534 && (e3.subarray && strApplyUintOK() || !e3.subarray && strApplyOK()))
    return String.fromCharCode.apply(null, shrinkBuf(e3, t));
  for (var r = "", i = 0; i < t; i++) r += String.fromCharCode(e3[i]);
  return r;
}
function buf2binstring(e3) {
  return _buf2binstring(e3, e3.length);
}
function binstring2buf(e3) {
  for (var t = new Uint8Array(e3.length), r = 0, i = t.length; r < i; r++)
    t[r] = e3.charCodeAt(r);
  return t;
}
function buf2string(e3, t) {
  var r, i, n, a, s = t || e3.length, o = new Array(2 * s);
  for (i = 0, r = 0; r < s; )
    if ((n = e3[r++]) < 128) o[i++] = n;
    else if ((a = utf8len(n)) > 4) o[i++] = 65533, r += a - 1;
    else {
      for (n &= 2 === a ? 31 : 3 === a ? 15 : 7; a > 1 && r < s; )
        n = n << 6 | 63 & e3[r++], a--;
      a > 1 ? o[i++] = 65533 : n < 65536 ? o[i++] = n : (n -= 65536, o[i++] = 55296 | n >> 10 & 1023, o[i++] = 56320 | 1023 & n);
    }
  return _buf2binstring(o, i);
}
function utf8border(e3, t) {
  var r;
  for ((t = t || e3.length) > e3.length && (t = e3.length), r = t - 1; r >= 0 && 128 == (192 & e3[r]); )
    r--;
  return r < 0 || 0 === r ? t : r + utf8len(e3[r]) > t ? r : t;
}
function adler32(e3, t, r, i) {
  for (var n = 65535 & e3 | 0, a = e3 >>> 16 & 65535 | 0, s = 0; 0 !== r; ) {
    r -= s = r > 2e3 ? 2e3 : r;
    do {
      a = a + (n = n + t[i++] | 0) | 0;
    } while (--s);
    n %= 65521, a %= 65521;
  }
  return n | a << 16 | 0;
}
function makeTable() {
  for (var e3, t = [], r = 0; r < 256; r++) {
    e3 = r;
    for (var i = 0; i < 8; i++) e3 = 1 & e3 ? 3988292384 ^ e3 >>> 1 : e3 >>> 1;
    t[r] = e3;
  }
  return t;
}
var crcTable = function() {
  var e3 = makeTable();
  return crcTable = function() {
    return e3;
  }, e3;
};
function crc32(e3, t, r, i) {
  var n = crcTable(), a = i + r;
  e3 ^= -1;
  for (var s = i; s < a; s++) e3 = e3 >>> 8 ^ n[255 & (e3 ^ t[s])];
  return -1 ^ e3;
}
var BAD = 30;
var TYPE = 12;
function inflate_fast(e3, t) {
  var r, i, n, a, s, o, h, d, l, c, _, u, f, p, m, g, E, y, b, S, T, A, k, w, v;
  r = e3.state, i = e3.next_in, w = e3.input, n = i + (e3.avail_in - 5), a = e3.next_out, v = e3.output, s = a - (t - e3.avail_out), o = a + (e3.avail_out - 257), h = r.dmax, d = r.wsize, l = r.whave, c = r.wnext, _ = r.window, u = r.hold, f = r.bits, p = r.lencode, m = r.distcode, g = (1 << r.lenbits) - 1, E = (1 << r.distbits) - 1;
  e: do {
    f < 15 && (u += w[i++] << f, f += 8, u += w[i++] << f, f += 8), y = p[u & g];
    t: for (; ; ) {
      if (u >>>= b = y >>> 24, f -= b, 0 === (b = y >>> 16 & 255))
        v[a++] = 65535 & y;
      else {
        if (!(16 & b)) {
          if (0 == (64 & b)) {
            y = p[(65535 & y) + (u & (1 << b) - 1)];
            continue t;
          }
          if (32 & b) {
            r.mode = TYPE;
            break e;
          }
          e3.msg = "invalid literal/length code", r.mode = BAD;
          break e;
        }
        S = 65535 & y, (b &= 15) && (f < b && (u += w[i++] << f, f += 8), S += u & (1 << b) - 1, u >>>= b, f -= b), f < 15 && (u += w[i++] << f, f += 8, u += w[i++] << f, f += 8), y = m[u & E];
        r: for (; ; ) {
          if (u >>>= b = y >>> 24, f -= b, !(16 & (b = y >>> 16 & 255))) {
            if (0 == (64 & b)) {
              y = m[(65535 & y) + (u & (1 << b) - 1)];
              continue r;
            }
            e3.msg = "invalid distance code", r.mode = BAD;
            break e;
          }
          if (T = 65535 & y, f < (b &= 15) && (u += w[i++] << f, (f += 8) < b && (u += w[i++] << f, f += 8)), (T += u & (1 << b) - 1) > h) {
            e3.msg = "invalid distance too far back", r.mode = BAD;
            break e;
          }
          if (u >>>= b, f -= b, T > (b = a - s)) {
            if ((b = T - b) > l && r.sane) {
              e3.msg = "invalid distance too far back", r.mode = BAD;
              break e;
            }
            if (A = 0, k = _, 0 === c) {
              if (A += d - b, b < S) {
                S -= b;
                do {
                  v[a++] = _[A++];
                } while (--b);
                A = a - T, k = v;
              }
            } else if (c < b) {
              if (A += d + c - b, (b -= c) < S) {
                S -= b;
                do {
                  v[a++] = _[A++];
                } while (--b);
                if (A = 0, c < S) {
                  S -= b = c;
                  do {
                    v[a++] = _[A++];
                  } while (--b);
                  A = a - T, k = v;
                }
              }
            } else if (A += c - b, b < S) {
              S -= b;
              do {
                v[a++] = _[A++];
              } while (--b);
              A = a - T, k = v;
            }
            for (; S > 2; )
              v[a++] = k[A++], v[a++] = k[A++], v[a++] = k[A++], S -= 3;
            S && (v[a++] = k[A++], S > 1 && (v[a++] = k[A++]));
          } else {
            A = a - T;
            do {
              v[a++] = v[A++], v[a++] = v[A++], v[a++] = v[A++], S -= 3;
            } while (S > 2);
            S && (v[a++] = v[A++], S > 1 && (v[a++] = v[A++]));
          }
          break;
        }
      }
      break;
    }
  } while (i < n && a < o);
  i -= S = f >> 3, u &= (1 << (f -= S << 3)) - 1, e3.next_in = i, e3.next_out = a, e3.avail_in = i < n ? n - i + 5 : 5 - (i - n), e3.avail_out = a < o ? o - a + 257 : 257 - (a - o), r.hold = u, r.bits = f;
}
var MAXBITS = 15;
var ENOUGH_LENS = 852;
var ENOUGH_DISTS = 592;
var CODES = 0;
var LENS = 1;
var DISTS = 2;
var lbase = [
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
];
var lext = [
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
];
var dbase = [
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
];
var dext = [
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
];
function inflate_table(e3, t, r, i, n, a, s, o) {
  var h, d, l, c, _, u, f, p, m, g = o.bits, E = 0, y = 0, b = 0, S = 0, T = 0, A = 0, k = 0, w = 0, v = 0, O = 0, C = null, D = 0, I = Buf16(MAXBITS + 1), R = Buf16(MAXBITS + 1), x = null, N = 0;
  for (E = 0; E <= MAXBITS; E++) I[E] = 0;
  for (y = 0; y < i; y++) I[t[r + y]]++;
  for (T = g, S = MAXBITS; S >= 1 && 0 === I[S]; S--) ;
  if (T > S && (T = S), 0 === S)
    return n[a++] = 20971520, n[a++] = 20971520, o.bits = 1, 0;
  for (b = 1; b < S && 0 === I[b]; b++) ;
  for (T < b && (T = b), w = 1, E = 1; E <= MAXBITS; E++)
    if (w <<= 1, (w -= I[E]) < 0) return -1;
  if (w > 0 && (e3 === CODES || 1 !== S)) return -1;
  for (R[1] = 0, E = 1; E < MAXBITS; E++) R[E + 1] = R[E] + I[E];
  for (y = 0; y < i; y++) 0 !== t[r + y] && (s[R[t[r + y]]++] = y);
  if (e3 === CODES ? (C = x = s, u = 19) : e3 === LENS ? (C = lbase, D -= 257, x = lext, N -= 257, u = 256) : (C = dbase, x = dext, u = -1), O = 0, y = 0, E = b, _ = a, A = T, k = 0, l = -1, c = (v = 1 << T) - 1, e3 === LENS && v > ENOUGH_LENS || e3 === DISTS && v > ENOUGH_DISTS)
    return 1;
  for (; ; ) {
    f = E - k, s[y] < u ? (p = 0, m = s[y]) : s[y] > u ? (p = x[N + s[y]], m = C[D + s[y]]) : (p = 96, m = 0), h = 1 << E - k, b = d = 1 << A;
    do {
      n[_ + (O >> k) + (d -= h)] = f << 24 | p << 16 | m | 0;
    } while (0 !== d);
    for (h = 1 << E - 1; O & h; ) h >>= 1;
    if (0 !== h ? (O &= h - 1, O += h) : O = 0, y++, 0 == --I[E]) {
      if (E === S) break;
      E = t[r + s[y]];
    }
    if (E > T && (O & c) !== l) {
      for (0 === k && (k = T), _ += b, w = 1 << (A = E - k); A + k < S && !((w -= I[A + k]) <= 0); )
        A++, w <<= 1;
      if (v += 1 << A, e3 === LENS && v > ENOUGH_LENS || e3 === DISTS && v > ENOUGH_DISTS)
        return 1;
      n[l = O & c] = T << 24 | A << 16 | _ - a | 0;
    }
  }
  return 0 !== O && (n[_ + O] = E - k << 24 | 64 << 16 | 0), o.bits = T, 0;
}
var CODES$1 = 0;
var LENS$1 = 1;
var DISTS$1 = 2;
var Z_FINISH$1 = 4;
var Z_BLOCK$1 = 5;
var Z_TREES$1 = 6;
var Z_OK$1 = 0;
var Z_STREAM_END$1 = 1;
var Z_NEED_DICT$1 = 2;
var Z_STREAM_ERROR$1 = -2;
var Z_DATA_ERROR$1 = -3;
var Z_MEM_ERROR = -4;
var Z_BUF_ERROR$1 = -5;
var Z_DEFLATED$1 = 8;
var HEAD = 1;
var FLAGS = 2;
var TIME = 3;
var OS = 4;
var EXLEN = 5;
var EXTRA = 6;
var NAME = 7;
var COMMENT = 8;
var HCRC = 9;
var DICTID = 10;
var DICT = 11;
var TYPE$1 = 12;
var TYPEDO = 13;
var STORED = 14;
var COPY_ = 15;
var COPY = 16;
var TABLE = 17;
var LENLENS = 18;
var CODELENS = 19;
var LEN_ = 20;
var LEN = 21;
var LENEXT = 22;
var DIST = 23;
var DISTEXT = 24;
var MATCH = 25;
var LIT = 26;
var CHECK = 27;
var LENGTH = 28;
var DONE = 29;
var BAD$1 = 30;
var MEM = 31;
var ENOUGH_LENS$1 = 852;
var ENOUGH_DISTS$1 = 592;
function zswap32(e3) {
  return (e3 >>> 24 & 255) + (e3 >>> 8 & 65280) + ((65280 & e3) << 8) + ((255 & e3) << 24);
}
function InflateState() {
  this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = Buf16(320), this.work = Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
function inflateResetKeep(e3) {
  var t;
  return e3 && e3.state ? (t = e3.state, e3.total_in = e3.total_out = t.total = 0, e3.msg = "", t.wrap && (e3.adler = 1 & t.wrap), t.mode = HEAD, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = Buf32(ENOUGH_LENS$1), t.distcode = t.distdyn = Buf32(ENOUGH_DISTS$1), t.sane = 1, t.back = -1, Z_OK$1) : Z_STREAM_ERROR$1;
}
function inflateReset(e3) {
  var t;
  return e3 && e3.state ? ((t = e3.state).wsize = 0, t.whave = 0, t.wnext = 0, inflateResetKeep(e3)) : Z_STREAM_ERROR$1;
}
function inflateReset2(e3, t) {
  var r, i;
  return e3 && e3.state ? (i = e3.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? Z_STREAM_ERROR$1 : (null !== i.window && i.wbits !== t && (i.window = null), i.wrap = r, i.wbits = t, inflateReset(e3))) : Z_STREAM_ERROR$1;
}
function inflateInit2(e3, t) {
  var r, i;
  return e3 ? (i = new InflateState(), e3.state = i, i.window = null, (r = inflateReset2(e3, t)) !== Z_OK$1 && (e3.state = null), r) : Z_STREAM_ERROR$1;
}
var lenfix;
var distfix;
var virgin = true;
function fixedtables(e3) {
  if (virgin) {
    var t;
    for (lenfix = Buf32(512), distfix = Buf32(32), t = 0; t < 144; )
      e3.lens[t++] = 8;
    for (; t < 256; ) e3.lens[t++] = 9;
    for (; t < 280; ) e3.lens[t++] = 7;
    for (; t < 288; ) e3.lens[t++] = 8;
    for (inflate_table(LENS$1, e3.lens, 0, 288, lenfix, 0, e3.work, { bits: 9 }), t = 0; t < 32; )
      e3.lens[t++] = 5;
    inflate_table(DISTS$1, e3.lens, 0, 32, distfix, 0, e3.work, { bits: 5 }), virgin = false;
  }
  e3.lencode = lenfix, e3.lenbits = 9, e3.distcode = distfix, e3.distbits = 5;
}
function updatewindow(e3, t, r, i) {
  var n, a = e3.state;
  return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = Buf8(a.wsize)), i >= a.wsize ? (arraySet(a.window, t, r - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) : ((n = a.wsize - a.wnext) > i && (n = i), arraySet(a.window, t, r - i, n, a.wnext), (i -= n) ? (arraySet(a.window, t, r - i, i, 0), a.wnext = i, a.whave = a.wsize) : (a.wnext += n, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += n))), 0;
}
function inflate(e3, t) {
  var r, i, n, a, s, o, h, d, l, c, _, u, f, p, m, g, E, y, b, S, T, A, k, w, v = 0, O = Buf8(4), C = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  if (!e3 || !e3.state || !e3.output || !e3.input && 0 !== e3.avail_in)
    return Z_STREAM_ERROR$1;
  (r = e3.state).mode === TYPE$1 && (r.mode = TYPEDO), s = e3.next_out, n = e3.output, h = e3.avail_out, a = e3.next_in, i = e3.input, o = e3.avail_in, d = r.hold, l = r.bits, c = o, _ = h, A = Z_OK$1;
  e: for (; ; )
    switch (r.mode) {
      case HEAD:
        if (0 === r.wrap) {
          r.mode = TYPEDO;
          break;
        }
        for (; l < 16; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if (2 & r.wrap && 35615 === d) {
          r.check = 0, O[0] = 255 & d, O[1] = d >>> 8 & 255, r.check = crc32(r.check, O, 2, 0), d = 0, l = 0, r.mode = FLAGS;
          break;
        }
        if (r.flags = 0, r.head && (r.head.done = false), !(1 & r.wrap) || (((255 & d) << 8) + (d >> 8)) % 31) {
          e3.msg = "incorrect header check", r.mode = BAD$1;
          break;
        }
        if ((15 & d) !== Z_DEFLATED$1) {
          e3.msg = "unknown compression method", r.mode = BAD$1;
          break;
        }
        if (l -= 4, T = 8 + (15 & (d >>>= 4)), 0 === r.wbits) r.wbits = T;
        else if (T > r.wbits) {
          e3.msg = "invalid window size", r.mode = BAD$1;
          break;
        }
        r.dmax = 1 << T, e3.adler = r.check = 1, r.mode = 512 & d ? DICTID : TYPE$1, d = 0, l = 0;
        break;
      case FLAGS:
        for (; l < 16; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if (r.flags = d, (255 & r.flags) !== Z_DEFLATED$1) {
          e3.msg = "unknown compression method", r.mode = BAD$1;
          break;
        }
        if (57344 & r.flags) {
          e3.msg = "unknown header flags set", r.mode = BAD$1;
          break;
        }
        r.head && (r.head.text = d >> 8 & 1), 512 & r.flags && (O[0] = 255 & d, O[1] = d >>> 8 & 255, r.check = crc32(r.check, O, 2, 0)), d = 0, l = 0, r.mode = TIME;
      case TIME:
        for (; l < 32; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        r.head && (r.head.time = d), 512 & r.flags && (O[0] = 255 & d, O[1] = d >>> 8 & 255, O[2] = d >>> 16 & 255, O[3] = d >>> 24 & 255, r.check = crc32(r.check, O, 4, 0)), d = 0, l = 0, r.mode = OS;
      case OS:
        for (; l < 16; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        r.head && (r.head.xflags = 255 & d, r.head.os = d >> 8), 512 & r.flags && (O[0] = 255 & d, O[1] = d >>> 8 & 255, r.check = crc32(r.check, O, 2, 0)), d = 0, l = 0, r.mode = EXLEN;
      case EXLEN:
        if (1024 & r.flags) {
          for (; l < 16; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          r.length = d, r.head && (r.head.extra_len = d), 512 & r.flags && (O[0] = 255 & d, O[1] = d >>> 8 & 255, r.check = crc32(r.check, O, 2, 0)), d = 0, l = 0;
        } else r.head && (r.head.extra = null);
        r.mode = EXTRA;
      case EXTRA:
        if (1024 & r.flags && ((u = r.length) > o && (u = o), u && (r.head && (T = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), arraySet(r.head.extra, i, a, u, T)), 512 & r.flags && (r.check = crc32(r.check, i, u, a)), o -= u, a += u, r.length -= u), r.length))
          break e;
        r.length = 0, r.mode = NAME;
      case NAME:
        if (2048 & r.flags) {
          if (0 === o) break e;
          u = 0;
          do {
            T = i[a + u++], r.head && T && r.length < 65536 && (r.head.name += String.fromCharCode(T));
          } while (T && u < o);
          if (512 & r.flags && (r.check = crc32(r.check, i, u, a)), o -= u, a += u, T)
            break e;
        } else r.head && (r.head.name = null);
        r.length = 0, r.mode = COMMENT;
      case COMMENT:
        if (4096 & r.flags) {
          if (0 === o) break e;
          u = 0;
          do {
            T = i[a + u++], r.head && T && r.length < 65536 && (r.head.comment += String.fromCharCode(T));
          } while (T && u < o);
          if (512 & r.flags && (r.check = crc32(r.check, i, u, a)), o -= u, a += u, T)
            break e;
        } else r.head && (r.head.comment = null);
        r.mode = HCRC;
      case HCRC:
        if (512 & r.flags) {
          for (; l < 16; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          if (d !== (65535 & r.check)) {
            e3.msg = "header crc mismatch", r.mode = BAD$1;
            break;
          }
          d = 0, l = 0;
        }
        r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = true), e3.adler = r.check = 0, r.mode = TYPE$1;
        break;
      case DICTID:
        for (; l < 32; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        e3.adler = r.check = zswap32(d), d = 0, l = 0, r.mode = DICT;
      case DICT:
        if (0 === r.havedict)
          return e3.next_out = s, e3.avail_out = h, e3.next_in = a, e3.avail_in = o, r.hold = d, r.bits = l, Z_NEED_DICT$1;
        e3.adler = r.check = 1, r.mode = TYPE$1;
      case TYPE$1:
        if (t === Z_BLOCK$1 || t === Z_TREES$1) break e;
      case TYPEDO:
        if (r.last) {
          d >>>= 7 & l, l -= 7 & l, r.mode = CHECK;
          break;
        }
        for (; l < 3; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        switch (r.last = 1 & d, l -= 1, 3 & (d >>>= 1)) {
          case 0:
            r.mode = STORED;
            break;
          case 1:
            if (fixedtables(r), r.mode = LEN_, t === Z_TREES$1) {
              d >>>= 2, l -= 2;
              break e;
            }
            break;
          case 2:
            r.mode = TABLE;
            break;
          case 3:
            e3.msg = "invalid block type", r.mode = BAD$1;
        }
        d >>>= 2, l -= 2;
        break;
      case STORED:
        for (d >>>= 7 & l, l -= 7 & l; l < 32; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if ((65535 & d) != (d >>> 16 ^ 65535)) {
          e3.msg = "invalid stored block lengths", r.mode = BAD$1;
          break;
        }
        if (r.length = 65535 & d, d = 0, l = 0, r.mode = COPY_, t === Z_TREES$1)
          break e;
      case COPY_:
        r.mode = COPY;
      case COPY:
        if (u = r.length) {
          if (u > o && (u = o), u > h && (u = h), 0 === u) break e;
          arraySet(n, i, a, u, s), o -= u, a += u, h -= u, s += u, r.length -= u;
          break;
        }
        r.mode = TYPE$1;
        break;
      case TABLE:
        for (; l < 14; ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if (r.nlen = 257 + (31 & d), d >>>= 5, l -= 5, r.ndist = 1 + (31 & d), d >>>= 5, l -= 5, r.ncode = 4 + (15 & d), d >>>= 4, l -= 4, r.nlen > 286 || r.ndist > 30) {
          e3.msg = "too many length or distance symbols", r.mode = BAD$1;
          break;
        }
        r.have = 0, r.mode = LENLENS;
      case LENLENS:
        for (; r.have < r.ncode; ) {
          for (; l < 3; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          r.lens[C[r.have++]] = 7 & d, d >>>= 3, l -= 3;
        }
        for (; r.have < 19; ) r.lens[C[r.have++]] = 0;
        if (r.lencode = r.lendyn, r.lenbits = 7, k = { bits: r.lenbits }, A = inflate_table(CODES$1, r.lens, 0, 19, r.lencode, 0, r.work, k), r.lenbits = k.bits, A) {
          e3.msg = "invalid code lengths set", r.mode = BAD$1;
          break;
        }
        r.have = 0, r.mode = CODELENS;
      case CODELENS:
        for (; r.have < r.nlen + r.ndist; ) {
          for (; g = (v = r.lencode[d & (1 << r.lenbits) - 1]) >>> 16 & 255, E = 65535 & v, !((m = v >>> 24) <= l); ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          if (E < 16) d >>>= m, l -= m, r.lens[r.have++] = E;
          else {
            if (16 === E) {
              for (w = m + 2; l < w; ) {
                if (0 === o) break e;
                o--, d += i[a++] << l, l += 8;
              }
              if (d >>>= m, l -= m, 0 === r.have) {
                e3.msg = "invalid bit length repeat", r.mode = BAD$1;
                break;
              }
              T = r.lens[r.have - 1], u = 3 + (3 & d), d >>>= 2, l -= 2;
            } else if (17 === E) {
              for (w = m + 3; l < w; ) {
                if (0 === o) break e;
                o--, d += i[a++] << l, l += 8;
              }
              l -= m, T = 0, u = 3 + (7 & (d >>>= m)), d >>>= 3, l -= 3;
            } else {
              for (w = m + 7; l < w; ) {
                if (0 === o) break e;
                o--, d += i[a++] << l, l += 8;
              }
              l -= m, T = 0, u = 11 + (127 & (d >>>= m)), d >>>= 7, l -= 7;
            }
            if (r.have + u > r.nlen + r.ndist) {
              e3.msg = "invalid bit length repeat", r.mode = BAD$1;
              break;
            }
            for (; u--; ) r.lens[r.have++] = T;
          }
        }
        if (r.mode === BAD$1) break;
        if (0 === r.lens[256]) {
          e3.msg = "invalid code -- missing end-of-block", r.mode = BAD$1;
          break;
        }
        if (r.lenbits = 9, k = { bits: r.lenbits }, A = inflate_table(
          LENS$1,
          r.lens,
          0,
          r.nlen,
          r.lencode,
          0,
          r.work,
          k
        ), r.lenbits = k.bits, A) {
          e3.msg = "invalid literal/lengths set", r.mode = BAD$1;
          break;
        }
        if (r.distbits = 6, r.distcode = r.distdyn, k = { bits: r.distbits }, A = inflate_table(
          DISTS$1,
          r.lens,
          r.nlen,
          r.ndist,
          r.distcode,
          0,
          r.work,
          k
        ), r.distbits = k.bits, A) {
          e3.msg = "invalid distances set", r.mode = BAD$1;
          break;
        }
        if (r.mode = LEN_, t === Z_TREES$1) break e;
      case LEN_:
        r.mode = LEN;
      case LEN:
        if (o >= 6 && h >= 258) {
          e3.next_out = s, e3.avail_out = h, e3.next_in = a, e3.avail_in = o, r.hold = d, r.bits = l, inflate_fast(e3, _), s = e3.next_out, n = e3.output, h = e3.avail_out, a = e3.next_in, i = e3.input, o = e3.avail_in, d = r.hold, l = r.bits, r.mode === TYPE$1 && (r.back = -1);
          break;
        }
        for (r.back = 0; g = (v = r.lencode[d & (1 << r.lenbits) - 1]) >>> 16 & 255, E = 65535 & v, !((m = v >>> 24) <= l); ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if (g && 0 == (240 & g)) {
          for (y = m, b = g, S = E; g = (v = r.lencode[S + ((d & (1 << y + b) - 1) >> y)]) >>> 16 & 255, E = 65535 & v, !(y + (m = v >>> 24) <= l); ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          d >>>= y, l -= y, r.back += y;
        }
        if (d >>>= m, l -= m, r.back += m, r.length = E, 0 === g) {
          r.mode = LIT;
          break;
        }
        if (32 & g) {
          r.back = -1, r.mode = TYPE$1;
          break;
        }
        if (64 & g) {
          e3.msg = "invalid literal/length code", r.mode = BAD$1;
          break;
        }
        r.extra = 15 & g, r.mode = LENEXT;
      case LENEXT:
        if (r.extra) {
          for (w = r.extra; l < w; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          r.length += d & (1 << r.extra) - 1, d >>>= r.extra, l -= r.extra, r.back += r.extra;
        }
        r.was = r.length, r.mode = DIST;
      case DIST:
        for (; g = (v = r.distcode[d & (1 << r.distbits) - 1]) >>> 16 & 255, E = 65535 & v, !((m = v >>> 24) <= l); ) {
          if (0 === o) break e;
          o--, d += i[a++] << l, l += 8;
        }
        if (0 == (240 & g)) {
          for (y = m, b = g, S = E; g = (v = r.distcode[S + ((d & (1 << y + b) - 1) >> y)]) >>> 16 & 255, E = 65535 & v, !(y + (m = v >>> 24) <= l); ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          d >>>= y, l -= y, r.back += y;
        }
        if (d >>>= m, l -= m, r.back += m, 64 & g) {
          e3.msg = "invalid distance code", r.mode = BAD$1;
          break;
        }
        r.offset = E, r.extra = 15 & g, r.mode = DISTEXT;
      case DISTEXT:
        if (r.extra) {
          for (w = r.extra; l < w; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          r.offset += d & (1 << r.extra) - 1, d >>>= r.extra, l -= r.extra, r.back += r.extra;
        }
        if (r.offset > r.dmax) {
          e3.msg = "invalid distance too far back", r.mode = BAD$1;
          break;
        }
        r.mode = MATCH;
      case MATCH:
        if (0 === h) break e;
        if (u = _ - h, r.offset > u) {
          if ((u = r.offset - u) > r.whave && r.sane) {
            e3.msg = "invalid distance too far back", r.mode = BAD$1;
            break;
          }
          u > r.wnext ? (u -= r.wnext, f = r.wsize - u) : f = r.wnext - u, u > r.length && (u = r.length), p = r.window;
        } else p = n, f = s - r.offset, u = r.length;
        u > h && (u = h), h -= u, r.length -= u;
        do {
          n[s++] = p[f++];
        } while (--u);
        0 === r.length && (r.mode = LEN);
        break;
      case LIT:
        if (0 === h) break e;
        n[s++] = r.length, h--, r.mode = LEN;
        break;
      case CHECK:
        if (r.wrap) {
          for (; l < 32; ) {
            if (0 === o) break e;
            o--, d |= i[a++] << l, l += 8;
          }
          if (_ -= h, e3.total_out += _, r.total += _, _ && (e3.adler = r.check = r.flags ? crc32(r.check, n, _, s - _) : adler32(r.check, n, _, s - _)), _ = h, (r.flags ? d : zswap32(d)) !== r.check) {
            e3.msg = "incorrect data check", r.mode = BAD$1;
            break;
          }
          d = 0, l = 0;
        }
        r.mode = LENGTH;
      case LENGTH:
        if (r.wrap && r.flags) {
          for (; l < 32; ) {
            if (0 === o) break e;
            o--, d += i[a++] << l, l += 8;
          }
          if (d !== (4294967295 & r.total)) {
            e3.msg = "incorrect length check", r.mode = BAD$1;
            break;
          }
          d = 0, l = 0;
        }
        r.mode = DONE;
      case DONE:
        A = Z_STREAM_END$1;
        break e;
      case BAD$1:
        A = Z_DATA_ERROR$1;
        break e;
      case MEM:
        return Z_MEM_ERROR;
      default:
        return Z_STREAM_ERROR$1;
    }
  return e3.next_out = s, e3.avail_out = h, e3.next_in = a, e3.avail_in = o, r.hold = d, r.bits = l, (r.wsize || _ !== e3.avail_out && r.mode < BAD$1 && (r.mode < CHECK || t !== Z_FINISH$1)) && updatewindow(e3, e3.output, e3.next_out, _ - e3.avail_out), c -= e3.avail_in, _ -= e3.avail_out, e3.total_in += c, e3.total_out += _, r.total += _, r.wrap && _ && (e3.adler = r.check = r.flags ? crc32(r.check, n, _, e3.next_out - _) : adler32(r.check, n, _, e3.next_out - _)), e3.data_type = r.bits + (r.last ? 64 : 0) + (r.mode === TYPE$1 ? 128 : 0) + (r.mode === LEN_ || r.mode === COPY_ ? 256 : 0), (0 === c && 0 === _ || t === Z_FINISH$1) && A === Z_OK$1 && (A = Z_BUF_ERROR$1), A;
}
function inflateEnd(e3) {
  if (!e3 || !e3.state) return Z_STREAM_ERROR$1;
  var t = e3.state;
  return t.window && (t.window = null), e3.state = null, Z_OK$1;
}
function inflateGetHeader(e3, t) {
  var r;
  return e3 && e3.state ? 0 == (2 & (r = e3.state).wrap) ? Z_STREAM_ERROR$1 : (r.head = t, t.done = false, Z_OK$1) : Z_STREAM_ERROR$1;
}
function inflateSetDictionary(e3, t) {
  var r, i = t.length;
  return e3 && e3.state ? 0 !== (r = e3.state).wrap && r.mode !== DICT ? Z_STREAM_ERROR$1 : r.mode === DICT && adler32(1, t, i, 0) !== r.check ? Z_DATA_ERROR$1 : updatewindow(e3, t, i, i) ? (r.mode = MEM, Z_MEM_ERROR) : (r.havedict = 1, Z_OK$1) : Z_STREAM_ERROR$1;
}
var msg = {
  2: "need dictionary",
  1: "stream end",
  0: "",
  "-1": "file error",
  "-2": "stream error",
  "-3": "data error",
  "-4": "insufficient memory",
  "-5": "buffer error",
  "-6": "incompatible version"
};
function ZStream() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
function GZheader() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
}
var toString = Object.prototype.toString;
var Inflate = function e(t) {
  if (!(this instanceof e)) return new e(t);
  this.options = assign({ chunkSize: 16384, windowBits: 0, to: "" }, t || {});
  var r = this.options;
  r.raw && r.windowBits >= 0 && r.windowBits < 16 && (r.windowBits = -r.windowBits, 0 === r.windowBits && (r.windowBits = -15)), !(r.windowBits >= 0 && r.windowBits < 16) || t && t.windowBits || (r.windowBits += 32), r.windowBits > 15 && r.windowBits < 48 && 0 == (15 & r.windowBits) && (r.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new ZStream(), this.strm.avail_out = 0;
  var i = inflateInit2(this.strm, r.windowBits);
  if (i !== Z_OK) throw new Error(msg[i]);
  if (this.header = new GZheader(), inflateGetHeader(this.strm, this.header), r.dictionary && ("string" == typeof r.dictionary ? r.dictionary = string2buf(r.dictionary) : "[object ArrayBuffer]" === toString.call(r.dictionary) && (r.dictionary = new Uint8Array(r.dictionary)), r.raw && (i = inflateSetDictionary(this.strm, r.dictionary)) !== Z_OK))
    throw new Error(msg[i]);
};
function zero(e3) {
  for (var t = e3.length; --t >= 0; ) e3[t] = 0;
}
Inflate.prototype.push = function(e3, t) {
  var r, i, n, a, s, o, h = this.strm, d = this.options.chunkSize, l = this.options.dictionary, c = false;
  if (this.ended) return false;
  i = t === ~~t ? t : true === t ? Z_FINISH : Z_NO_FLUSH, "string" == typeof e3 ? h.input = binstring2buf(e3) : "[object ArrayBuffer]" === toString.call(e3) ? h.input = new Uint8Array(e3) : h.input = e3, h.next_in = 0, h.avail_in = h.input.length;
  do {
    if (0 === h.avail_out && (h.output = Buf8(d), h.next_out = 0, h.avail_out = d), (r = inflate(h, Z_NO_FLUSH)) === Z_NEED_DICT && l && (o = "string" == typeof l ? string2buf(l) : "[object ArrayBuffer]" === toString.call(l) ? new Uint8Array(l) : l, r = inflateSetDictionary(this.strm, o)), r === Z_BUF_ERROR && true === c && (r = Z_OK, c = false), r !== Z_STREAM_END && r !== Z_OK)
      return this.onEnd(r), this.ended = true, false;
    h.next_out && (0 !== h.avail_out && r !== Z_STREAM_END && (0 !== h.avail_in || i !== Z_FINISH && i !== Z_SYNC_FLUSH) || ("string" === this.options.to ? (n = utf8border(h.output, h.next_out), a = h.next_out - n, s = buf2string(h.output, n), h.next_out = a, h.avail_out = d - a, a && arraySet(h.output, h.output, n, a, 0), this.onData(s)) : this.onData(shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (c = true);
  } while ((h.avail_in > 0 || 0 === h.avail_out) && r !== Z_STREAM_END);
  return r === Z_STREAM_END && (i = Z_FINISH), i === Z_FINISH ? (r = inflateEnd(this.strm), this.onEnd(r), this.ended = true, r === Z_OK) : i !== Z_SYNC_FLUSH || (this.onEnd(Z_OK), h.avail_out = 0, true);
}, Inflate.prototype.onData = function(e3) {
  this.chunks.push(e3);
}, Inflate.prototype.onEnd = function(e3) {
  e3 === Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = flattenChunks(this.chunks)), this.chunks = [], this.err = e3, this.msg = this.strm.msg;
};
var static_ltree;
var static_dtree;
var _dist_code;
var _length_code;
var base_length;
var base_dist;
var static_l_desc;
var static_d_desc;
var static_bl_desc;
var STORED_BLOCK = 0;
var STATIC_TREES = 1;
var DYN_TREES = 2;
var MIN_MATCH = 3;
var MAX_MATCH = 258;
var LENGTH_CODES = 29;
var LITERALS = 256;
var L_CODES = LITERALS + 1 + LENGTH_CODES;
var D_CODES = 30;
var BL_CODES = 19;
var HEAP_SIZE = 2 * L_CODES + 1;
var MAX_BITS = 15;
var Buf_size = 16;
var MAX_BL_BITS = 7;
var END_BLOCK = 256;
var REP_3_6 = 16;
var REPZ_3_10 = 17;
var REPZ_11_138 = 18;
var extra_lbits = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0
];
var extra_dbits = [
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13
];
var extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
var bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
var DIST_CODE_LEN = 512;
function StaticTreeDesc(e3, t, r, i, n) {
  this.static_tree = e3, this.extra_bits = t, this.extra_base = r, this.elems = i, this.max_length = n, this.has_stree = e3 && e3.length;
}
function TreeDesc(e3, t) {
  this.dyn_tree = e3, this.max_code = 0, this.stat_desc = t;
}
function d_code(e3) {
  return e3 < 256 ? _dist_code[e3] : _dist_code[256 + (e3 >>> 7)];
}
function put_short(e3, t) {
  e3.pending_buf[e3.pending++] = 255 & t, e3.pending_buf[e3.pending++] = t >>> 8 & 255;
}
function send_bits(e3, t, r) {
  e3.bi_valid > Buf_size - r ? (e3.bi_buf |= t << e3.bi_valid & 65535, put_short(e3, e3.bi_buf), e3.bi_buf = t >> Buf_size - e3.bi_valid, e3.bi_valid += r - Buf_size) : (e3.bi_buf |= t << e3.bi_valid & 65535, e3.bi_valid += r);
}
function send_code(e3, t, r) {
  send_bits(e3, r[2 * t], r[2 * t + 1]);
}
function bi_reverse(e3, t) {
  var r = 0;
  do {
    r |= 1 & e3, e3 >>>= 1, r <<= 1;
  } while (--t > 0);
  return r >>> 1;
}
function bi_flush(e3) {
  16 === e3.bi_valid ? (put_short(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : e3.bi_valid >= 8 && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
}
function gen_bitlen(e3, t) {
  var r, i, n, a, s, o, h = t.dyn_tree, d = t.max_code, l = t.stat_desc.static_tree, c = t.stat_desc.has_stree, _ = t.stat_desc.extra_bits, u = t.stat_desc.extra_base, f = t.stat_desc.max_length, p = 0;
  for (a = 0; a <= MAX_BITS; a++) e3.bl_count[a] = 0;
  for (h[2 * e3.heap[e3.heap_max] + 1] = 0, r = e3.heap_max + 1; r < HEAP_SIZE; r++)
    (a = h[2 * h[2 * (i = e3.heap[r]) + 1] + 1] + 1) > f && (a = f, p++), h[2 * i + 1] = a, i > d || (e3.bl_count[a]++, s = 0, i >= u && (s = _[i - u]), o = h[2 * i], e3.opt_len += o * (a + s), c && (e3.static_len += o * (l[2 * i + 1] + s)));
  if (0 !== p) {
    do {
      for (a = f - 1; 0 === e3.bl_count[a]; ) a--;
      e3.bl_count[a]--, e3.bl_count[a + 1] += 2, e3.bl_count[f]--, p -= 2;
    } while (p > 0);
    for (a = f; 0 !== a; a--)
      for (i = e3.bl_count[a]; 0 !== i; )
        (n = e3.heap[--r]) > d || (h[2 * n + 1] !== a && (e3.opt_len += (a - h[2 * n + 1]) * h[2 * n], h[2 * n + 1] = a), i--);
  }
}
function gen_codes(e3, t, r) {
  var i, n, a = new Array(MAX_BITS + 1), s = 0;
  for (i = 1; i <= MAX_BITS; i++) a[i] = s = s + r[i - 1] << 1;
  for (n = 0; n <= t; n++) {
    var o = e3[2 * n + 1];
    0 !== o && (e3[2 * n] = bi_reverse(a[o]++, o));
  }
}
function tr_static_init() {
  var e3, t, r, i, n, a = new Array(MAX_BITS + 1);
  for (zero(static_ltree = new Array(2 * (L_CODES + 2))), zero(static_dtree = new Array(2 * D_CODES)), zero(_dist_code = new Array(DIST_CODE_LEN)), zero(_length_code = new Array(MAX_MATCH - MIN_MATCH + 1)), zero(base_length = new Array(LENGTH_CODES)), zero(base_dist = new Array(D_CODES)), r = 0, i = 0; i < LENGTH_CODES - 1; i++)
    for (base_length[i] = r, e3 = 0; e3 < 1 << extra_lbits[i]; e3++)
      _length_code[r++] = i;
  for (_length_code[r - 1] = i, n = 0, i = 0; i < 16; i++)
    for (base_dist[i] = n, e3 = 0; e3 < 1 << extra_dbits[i]; e3++)
      _dist_code[n++] = i;
  for (n >>= 7; i < D_CODES; i++)
    for (base_dist[i] = n << 7, e3 = 0; e3 < 1 << extra_dbits[i] - 7; e3++)
      _dist_code[256 + n++] = i;
  for (t = 0; t <= MAX_BITS; t++) a[t] = 0;
  for (e3 = 0; e3 <= 143; ) static_ltree[2 * e3 + 1] = 8, e3++, a[8]++;
  for (; e3 <= 255; ) static_ltree[2 * e3 + 1] = 9, e3++, a[9]++;
  for (; e3 <= 279; ) static_ltree[2 * e3 + 1] = 7, e3++, a[7]++;
  for (; e3 <= 287; ) static_ltree[2 * e3 + 1] = 8, e3++, a[8]++;
  for (gen_codes(static_ltree, L_CODES + 1, a), e3 = 0; e3 < D_CODES; e3++)
    static_dtree[2 * e3 + 1] = 5, static_dtree[2 * e3] = bi_reverse(e3, 5);
  static_l_desc = new StaticTreeDesc(
    static_ltree,
    extra_lbits,
    LITERALS + 1,
    L_CODES,
    MAX_BITS
  ), static_d_desc = new StaticTreeDesc(
    static_dtree,
    extra_dbits,
    0,
    D_CODES,
    MAX_BITS
  ), static_bl_desc = new StaticTreeDesc(
    new Array(0),
    extra_blbits,
    0,
    BL_CODES,
    MAX_BL_BITS
  );
}
function init_block(e3) {
  var t;
  for (t = 0; t < L_CODES; t++) e3.dyn_ltree[2 * t] = 0;
  for (t = 0; t < D_CODES; t++) e3.dyn_dtree[2 * t] = 0;
  for (t = 0; t < BL_CODES; t++) e3.bl_tree[2 * t] = 0;
  e3.dyn_ltree[2 * END_BLOCK] = 1, e3.opt_len = e3.static_len = 0, e3.last_lit = e3.matches = 0;
}
function bi_windup(e3) {
  e3.bi_valid > 8 ? put_short(e3, e3.bi_buf) : e3.bi_valid > 0 && (e3.pending_buf[e3.pending++] = e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0;
}
function copy_block(e3, t, r, i) {
  bi_windup(e3), i && (put_short(e3, r), put_short(e3, ~r)), arraySet(e3.pending_buf, e3.window, t, r, e3.pending), e3.pending += r;
}
function smaller(e3, t, r, i) {
  var n = 2 * t, a = 2 * r;
  return e3[n] < e3[a] || e3[n] === e3[a] && i[t] <= i[r];
}
function pqdownheap(e3, t, r) {
  for (var i = e3.heap[r], n = r << 1; n <= e3.heap_len && (n < e3.heap_len && smaller(t, e3.heap[n + 1], e3.heap[n], e3.depth) && n++, !smaller(t, i, e3.heap[n], e3.depth)); )
    e3.heap[r] = e3.heap[n], r = n, n <<= 1;
  e3.heap[r] = i;
}
function compress_block(e3, t, r) {
  var i, n, a, s, o = 0;
  if (0 !== e3.last_lit)
    do {
      i = e3.pending_buf[e3.d_buf + 2 * o] << 8 | e3.pending_buf[e3.d_buf + 2 * o + 1], n = e3.pending_buf[e3.l_buf + o], o++, 0 === i ? send_code(e3, n, t) : (send_code(e3, (a = _length_code[n]) + LITERALS + 1, t), 0 !== (s = extra_lbits[a]) && send_bits(e3, n -= base_length[a], s), send_code(e3, a = d_code(--i), r), 0 !== (s = extra_dbits[a]) && send_bits(e3, i -= base_dist[a], s));
    } while (o < e3.last_lit);
  send_code(e3, END_BLOCK, t);
}
function build_tree(e3, t) {
  var r, i, n, a = t.dyn_tree, s = t.stat_desc.static_tree, o = t.stat_desc.has_stree, h = t.stat_desc.elems, d = -1;
  for (e3.heap_len = 0, e3.heap_max = HEAP_SIZE, r = 0; r < h; r++)
    0 !== a[2 * r] ? (e3.heap[++e3.heap_len] = d = r, e3.depth[r] = 0) : a[2 * r + 1] = 0;
  for (; e3.heap_len < 2; )
    a[2 * (n = e3.heap[++e3.heap_len] = d < 2 ? ++d : 0)] = 1, e3.depth[n] = 0, e3.opt_len--, o && (e3.static_len -= s[2 * n + 1]);
  for (t.max_code = d, r = e3.heap_len >> 1; r >= 1; r--) pqdownheap(e3, a, r);
  n = h;
  do {
    r = e3.heap[1], e3.heap[1] = e3.heap[e3.heap_len--], pqdownheap(e3, a, 1), i = e3.heap[1], e3.heap[--e3.heap_max] = r, e3.heap[--e3.heap_max] = i, a[2 * n] = a[2 * r] + a[2 * i], e3.depth[n] = (e3.depth[r] >= e3.depth[i] ? e3.depth[r] : e3.depth[i]) + 1, a[2 * r + 1] = a[2 * i + 1] = n, e3.heap[1] = n++, pqdownheap(e3, a, 1);
  } while (e3.heap_len >= 2);
  e3.heap[--e3.heap_max] = e3.heap[1], gen_bitlen(e3, t), gen_codes(a, d, e3.bl_count);
}
function scan_tree(e3, t, r) {
  var i, n, a = -1, s = t[1], o = 0, h = 7, d = 4;
  for (0 === s && (h = 138, d = 3), t[2 * (r + 1) + 1] = 65535, i = 0; i <= r; i++)
    n = s, s = t[2 * (i + 1) + 1], ++o < h && n === s || (o < d ? e3.bl_tree[2 * n] += o : 0 !== n ? (n !== a && e3.bl_tree[2 * n]++, e3.bl_tree[2 * REP_3_6]++) : o <= 10 ? e3.bl_tree[2 * REPZ_3_10]++ : e3.bl_tree[2 * REPZ_11_138]++, o = 0, a = n, 0 === s ? (h = 138, d = 3) : n === s ? (h = 6, d = 3) : (h = 7, d = 4));
}
function send_tree(e3, t, r) {
  var i, n, a = -1, s = t[1], o = 0, h = 7, d = 4;
  for (0 === s && (h = 138, d = 3), i = 0; i <= r; i++)
    if (n = s, s = t[2 * (i + 1) + 1], !(++o < h && n === s)) {
      if (o < d)
        do {
          send_code(e3, n, e3.bl_tree);
        } while (0 != --o);
      else
        0 !== n ? (n !== a && (send_code(e3, n, e3.bl_tree), o--), send_code(e3, REP_3_6, e3.bl_tree), send_bits(e3, o - 3, 2)) : o <= 10 ? (send_code(e3, REPZ_3_10, e3.bl_tree), send_bits(e3, o - 3, 3)) : (send_code(e3, REPZ_11_138, e3.bl_tree), send_bits(e3, o - 11, 7));
      o = 0, a = n, 0 === s ? (h = 138, d = 3) : n === s ? (h = 6, d = 3) : (h = 7, d = 4);
    }
}
function build_bl_tree(e3) {
  var t;
  for (scan_tree(e3, e3.dyn_ltree, e3.l_desc.max_code), scan_tree(e3, e3.dyn_dtree, e3.d_desc.max_code), build_tree(e3, e3.bl_desc), t = BL_CODES - 1; t >= 3 && 0 === e3.bl_tree[2 * bl_order[t] + 1]; t--) ;
  return e3.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}
function send_all_trees(e3, t, r, i) {
  var n;
  for (send_bits(e3, t - 257, 5), send_bits(e3, r - 1, 5), send_bits(e3, i - 4, 4), n = 0; n < i; n++)
    send_bits(e3, e3.bl_tree[2 * bl_order[n] + 1], 3);
  send_tree(e3, e3.dyn_ltree, t - 1), send_tree(e3, e3.dyn_dtree, r - 1);
}
function detect_data_type(e3) {
  var t, r = 4093624447;
  for (t = 0; t <= 31; t++, r >>>= 1)
    if (1 & r && 0 !== e3.dyn_ltree[2 * t]) return Z_BINARY;
  if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26])
    return Z_TEXT;
  for (t = 32; t < LITERALS; t++) if (0 !== e3.dyn_ltree[2 * t]) return Z_TEXT;
  return Z_BINARY;
}
var static_init_done = false;
function _tr_init(e3) {
  static_init_done || (tr_static_init(), static_init_done = true), e3.l_desc = new TreeDesc(e3.dyn_ltree, static_l_desc), e3.d_desc = new TreeDesc(e3.dyn_dtree, static_d_desc), e3.bl_desc = new TreeDesc(e3.bl_tree, static_bl_desc), e3.bi_buf = 0, e3.bi_valid = 0, init_block(e3);
}
function _tr_stored_block(e3, t, r, i) {
  send_bits(e3, (STORED_BLOCK << 1) + (i ? 1 : 0), 3), copy_block(e3, t, r, true);
}
function _tr_align(e3) {
  send_bits(e3, STATIC_TREES << 1, 3), send_code(e3, END_BLOCK, static_ltree), bi_flush(e3);
}
function _tr_flush_block(e3, t, r, i) {
  var n, a, s = 0;
  e3.level > 0 ? (e3.strm.data_type === Z_UNKNOWN && (e3.strm.data_type = detect_data_type(e3)), build_tree(e3, e3.l_desc), build_tree(e3, e3.d_desc), s = build_bl_tree(e3), n = e3.opt_len + 3 + 7 >>> 3, (a = e3.static_len + 3 + 7 >>> 3) <= n && (n = a)) : n = a = r + 5, r + 4 <= n && -1 !== t ? _tr_stored_block(e3, t, r, i) : e3.strategy === Z_FIXED || a === n ? (send_bits(e3, (STATIC_TREES << 1) + (i ? 1 : 0), 3), compress_block(e3, static_ltree, static_dtree)) : (send_bits(e3, (DYN_TREES << 1) + (i ? 1 : 0), 3), send_all_trees(
    e3,
    e3.l_desc.max_code + 1,
    e3.d_desc.max_code + 1,
    s + 1
  ), compress_block(e3, e3.dyn_ltree, e3.dyn_dtree)), init_block(e3), i && bi_windup(e3);
}
function _tr_tally(e3, t, r) {
  return e3.pending_buf[e3.d_buf + 2 * e3.last_lit] = t >>> 8 & 255, e3.pending_buf[e3.d_buf + 2 * e3.last_lit + 1] = 255 & t, e3.pending_buf[e3.l_buf + e3.last_lit] = 255 & r, e3.last_lit++, 0 === t ? e3.dyn_ltree[2 * r]++ : (e3.matches++, t--, e3.dyn_ltree[2 * (_length_code[r] + LITERALS + 1)]++, e3.dyn_dtree[2 * d_code(t)]++), e3.last_lit === e3.lit_bufsize - 1;
}
var MAX_MEM_LEVEL = 9;
var LENGTH_CODES$1 = 29;
var LITERALS$1 = 256;
var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
var D_CODES$1 = 30;
var BL_CODES$1 = 19;
var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
var MAX_BITS$1 = 15;
var MIN_MATCH$1 = 3;
var MAX_MATCH$1 = 258;
var MIN_LOOKAHEAD = MAX_MATCH$1 + MIN_MATCH$1 + 1;
var PRESET_DICT = 32;
var INIT_STATE = 42;
var EXTRA_STATE = 69;
var NAME_STATE = 73;
var COMMENT_STATE = 91;
var HCRC_STATE = 103;
var BUSY_STATE = 113;
var FINISH_STATE = 666;
var BS_NEED_MORE = 1;
var BS_BLOCK_DONE = 2;
var BS_FINISH_STARTED = 3;
var BS_FINISH_DONE = 4;
var OS_CODE = 3;
function err(e3, t) {
  return e3.msg = msg[t], t;
}
function rank(e3) {
  return (e3 << 1) - (e3 > 4 ? 9 : 0);
}
function zero$1(e3) {
  for (var t = e3.length; --t >= 0; ) e3[t] = 0;
}
function flush_pending(e3) {
  var t = e3.state, r = t.pending;
  r > e3.avail_out && (r = e3.avail_out), 0 !== r && (arraySet(e3.output, t.pending_buf, t.pending_out, r, e3.next_out), e3.next_out += r, t.pending_out += r, e3.total_out += r, e3.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));
}
function flush_block_only(e3, t) {
  _tr_flush_block(
    e3,
    e3.block_start >= 0 ? e3.block_start : -1,
    e3.strstart - e3.block_start,
    t
  ), e3.block_start = e3.strstart, flush_pending(e3.strm);
}
function put_byte(e3, t) {
  e3.pending_buf[e3.pending++] = t;
}
function putShortMSB(e3, t) {
  e3.pending_buf[e3.pending++] = t >>> 8 & 255, e3.pending_buf[e3.pending++] = 255 & t;
}
function read_buf(e3, t, r, i) {
  var n = e3.avail_in;
  return n > i && (n = i), 0 === n ? 0 : (e3.avail_in -= n, arraySet(t, e3.input, e3.next_in, n, r), 1 === e3.state.wrap ? e3.adler = adler32(e3.adler, t, n, r) : 2 === e3.state.wrap && (e3.adler = crc32(e3.adler, t, n, r)), e3.next_in += n, e3.total_in += n, n);
}
function longest_match(e3, t) {
  var r, i, n = e3.max_chain_length, a = e3.strstart, s = e3.prev_length, o = e3.nice_match, h = e3.strstart > e3.w_size - MIN_LOOKAHEAD ? e3.strstart - (e3.w_size - MIN_LOOKAHEAD) : 0, d = e3.window, l = e3.w_mask, c = e3.prev, _ = e3.strstart + MAX_MATCH$1, u = d[a + s - 1], f = d[a + s];
  e3.prev_length >= e3.good_match && (n >>= 2), o > e3.lookahead && (o = e3.lookahead);
  do {
    if (d[(r = t) + s] === f && d[r + s - 1] === u && d[r] === d[a] && d[++r] === d[a + 1]) {
      a += 2, r++;
      do {
      } while (d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && d[++a] === d[++r] && a < _);
      if (i = MAX_MATCH$1 - (_ - a), a = _ - MAX_MATCH$1, i > s) {
        if (e3.match_start = t, s = i, i >= o) break;
        u = d[a + s - 1], f = d[a + s];
      }
    }
  } while ((t = c[t & l]) > h && 0 != --n);
  return s <= e3.lookahead ? s : e3.lookahead;
}
function fill_window(e3) {
  var t, r, i, n, a, s = e3.w_size;
  do {
    if (n = e3.window_size - e3.lookahead - e3.strstart, e3.strstart >= s + (s - MIN_LOOKAHEAD)) {
      arraySet(e3.window, e3.window, s, s, 0), e3.match_start -= s, e3.strstart -= s, e3.block_start -= s, t = r = e3.hash_size;
      do {
        i = e3.head[--t], e3.head[t] = i >= s ? i - s : 0;
      } while (--r);
      t = r = s;
      do {
        i = e3.prev[--t], e3.prev[t] = i >= s ? i - s : 0;
      } while (--r);
      n += s;
    }
    if (0 === e3.strm.avail_in) break;
    if (r = read_buf(e3.strm, e3.window, e3.strstart + e3.lookahead, n), e3.lookahead += r, e3.lookahead + e3.insert >= MIN_MATCH$1)
      for (a = e3.strstart - e3.insert, e3.ins_h = e3.window[a], e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[a + 1]) & e3.hash_mask; e3.insert && (e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[a + MIN_MATCH$1 - 1]) & e3.hash_mask, e3.prev[a & e3.w_mask] = e3.head[e3.ins_h], e3.head[e3.ins_h] = a, a++, e3.insert--, !(e3.lookahead + e3.insert < MIN_MATCH$1)); ) ;
  } while (e3.lookahead < MIN_LOOKAHEAD && 0 !== e3.strm.avail_in);
}
function deflate_stored(e3, t) {
  var r = 65535;
  for (r > e3.pending_buf_size - 5 && (r = e3.pending_buf_size - 5); ; ) {
    if (e3.lookahead <= 1) {
      if (fill_window(e3), 0 === e3.lookahead && t === Z_NO_FLUSH)
        return BS_NEED_MORE;
      if (0 === e3.lookahead) break;
    }
    e3.strstart += e3.lookahead, e3.lookahead = 0;
    var i = e3.block_start + r;
    if ((0 === e3.strstart || e3.strstart >= i) && (e3.lookahead = e3.strstart - i, e3.strstart = i, flush_block_only(e3, false), 0 === e3.strm.avail_out))
      return BS_NEED_MORE;
    if (e3.strstart - e3.block_start >= e3.w_size - MIN_LOOKAHEAD && (flush_block_only(e3, false), 0 === e3.strm.avail_out))
      return BS_NEED_MORE;
  }
  return e3.insert = 0, t === Z_FINISH ? (flush_block_only(e3, true), 0 === e3.strm.avail_out ? BS_FINISH_STARTED : BS_FINISH_DONE) : (e3.strstart > e3.block_start && (flush_block_only(e3, false), e3.strm.avail_out), BS_NEED_MORE);
}
function deflate_fast(e3, t) {
  for (var r, i; ; ) {
    if (e3.lookahead < MIN_LOOKAHEAD) {
      if (fill_window(e3), e3.lookahead < MIN_LOOKAHEAD && t === Z_NO_FLUSH)
        return BS_NEED_MORE;
      if (0 === e3.lookahead) break;
    }
    if (r = 0, e3.lookahead >= MIN_MATCH$1 && (e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[e3.strstart + MIN_MATCH$1 - 1]) & e3.hash_mask, r = e3.prev[e3.strstart & e3.w_mask] = e3.head[e3.ins_h], e3.head[e3.ins_h] = e3.strstart), 0 !== r && e3.strstart - r <= e3.w_size - MIN_LOOKAHEAD && (e3.match_length = longest_match(e3, r)), e3.match_length >= MIN_MATCH$1)
      if (i = _tr_tally(
        e3,
        e3.strstart - e3.match_start,
        e3.match_length - MIN_MATCH$1
      ), e3.lookahead -= e3.match_length, e3.match_length <= e3.max_lazy_match && e3.lookahead >= MIN_MATCH$1) {
        e3.match_length--;
        do {
          e3.strstart++, e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[e3.strstart + MIN_MATCH$1 - 1]) & e3.hash_mask, r = e3.prev[e3.strstart & e3.w_mask] = e3.head[e3.ins_h], e3.head[e3.ins_h] = e3.strstart;
        } while (0 != --e3.match_length);
        e3.strstart++;
      } else
        e3.strstart += e3.match_length, e3.match_length = 0, e3.ins_h = e3.window[e3.strstart], e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[e3.strstart + 1]) & e3.hash_mask;
    else
      i = _tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++;
    if (i && (flush_block_only(e3, false), 0 === e3.strm.avail_out))
      return BS_NEED_MORE;
  }
  return e3.insert = e3.strstart < MIN_MATCH$1 - 1 ? e3.strstart : MIN_MATCH$1 - 1, t === Z_FINISH ? (flush_block_only(e3, true), 0 === e3.strm.avail_out ? BS_FINISH_STARTED : BS_FINISH_DONE) : e3.last_lit && (flush_block_only(e3, false), 0 === e3.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
}
function deflate_slow(e3, t) {
  for (var r, i, n; ; ) {
    if (e3.lookahead < MIN_LOOKAHEAD) {
      if (fill_window(e3), e3.lookahead < MIN_LOOKAHEAD && t === Z_NO_FLUSH)
        return BS_NEED_MORE;
      if (0 === e3.lookahead) break;
    }
    if (r = 0, e3.lookahead >= MIN_MATCH$1 && (e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[e3.strstart + MIN_MATCH$1 - 1]) & e3.hash_mask, r = e3.prev[e3.strstart & e3.w_mask] = e3.head[e3.ins_h], e3.head[e3.ins_h] = e3.strstart), e3.prev_length = e3.match_length, e3.prev_match = e3.match_start, e3.match_length = MIN_MATCH$1 - 1, 0 !== r && e3.prev_length < e3.max_lazy_match && e3.strstart - r <= e3.w_size - MIN_LOOKAHEAD && (e3.match_length = longest_match(e3, r), e3.match_length <= 5 && (e3.strategy === Z_FILTERED || e3.match_length === MIN_MATCH$1 && e3.strstart - e3.match_start > 4096) && (e3.match_length = MIN_MATCH$1 - 1)), e3.prev_length >= MIN_MATCH$1 && e3.match_length <= e3.prev_length) {
      n = e3.strstart + e3.lookahead - MIN_MATCH$1, i = _tr_tally(
        e3,
        e3.strstart - 1 - e3.prev_match,
        e3.prev_length - MIN_MATCH$1
      ), e3.lookahead -= e3.prev_length - 1, e3.prev_length -= 2;
      do {
        ++e3.strstart <= n && (e3.ins_h = (e3.ins_h << e3.hash_shift ^ e3.window[e3.strstart + MIN_MATCH$1 - 1]) & e3.hash_mask, r = e3.prev[e3.strstart & e3.w_mask] = e3.head[e3.ins_h], e3.head[e3.ins_h] = e3.strstart);
      } while (0 != --e3.prev_length);
      if (e3.match_available = 0, e3.match_length = MIN_MATCH$1 - 1, e3.strstart++, i && (flush_block_only(e3, false), 0 === e3.strm.avail_out))
        return BS_NEED_MORE;
    } else if (e3.match_available) {
      if ((i = _tr_tally(e3, 0, e3.window[e3.strstart - 1])) && flush_block_only(e3, false), e3.strstart++, e3.lookahead--, 0 === e3.strm.avail_out)
        return BS_NEED_MORE;
    } else e3.match_available = 1, e3.strstart++, e3.lookahead--;
  }
  return e3.match_available && (i = _tr_tally(e3, 0, e3.window[e3.strstart - 1]), e3.match_available = 0), e3.insert = e3.strstart < MIN_MATCH$1 - 1 ? e3.strstart : MIN_MATCH$1 - 1, t === Z_FINISH ? (flush_block_only(e3, true), 0 === e3.strm.avail_out ? BS_FINISH_STARTED : BS_FINISH_DONE) : e3.last_lit && (flush_block_only(e3, false), 0 === e3.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
}
function deflate_rle(e3, t) {
  for (var r, i, n, a, s = e3.window; ; ) {
    if (e3.lookahead <= MAX_MATCH$1) {
      if (fill_window(e3), e3.lookahead <= MAX_MATCH$1 && t === Z_NO_FLUSH)
        return BS_NEED_MORE;
      if (0 === e3.lookahead) break;
    }
    if (e3.match_length = 0, e3.lookahead >= MIN_MATCH$1 && e3.strstart > 0 && (i = s[n = e3.strstart - 1]) === s[++n] && i === s[++n] && i === s[++n]) {
      a = e3.strstart + MAX_MATCH$1;
      do {
      } while (i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && i === s[++n] && n < a);
      e3.match_length = MAX_MATCH$1 - (a - n), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
    }
    if (e3.match_length >= MIN_MATCH$1 ? (r = _tr_tally(e3, 1, e3.match_length - MIN_MATCH$1), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r = _tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r && (flush_block_only(e3, false), 0 === e3.strm.avail_out))
      return BS_NEED_MORE;
  }
  return e3.insert = 0, t === Z_FINISH ? (flush_block_only(e3, true), 0 === e3.strm.avail_out ? BS_FINISH_STARTED : BS_FINISH_DONE) : e3.last_lit && (flush_block_only(e3, false), 0 === e3.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
}
function deflate_huff(e3, t) {
  for (var r; ; ) {
    if (0 === e3.lookahead && (fill_window(e3), 0 === e3.lookahead)) {
      if (t === Z_NO_FLUSH) return BS_NEED_MORE;
      break;
    }
    if (e3.match_length = 0, r = _tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r && (flush_block_only(e3, false), 0 === e3.strm.avail_out))
      return BS_NEED_MORE;
  }
  return e3.insert = 0, t === Z_FINISH ? (flush_block_only(e3, true), 0 === e3.strm.avail_out ? BS_FINISH_STARTED : BS_FINISH_DONE) : e3.last_lit && (flush_block_only(e3, false), 0 === e3.strm.avail_out) ? BS_NEED_MORE : BS_BLOCK_DONE;
}
function Config(e3, t, r, i, n) {
  this.good_length = e3, this.max_lazy = t, this.nice_length = r, this.max_chain = i, this.func = n;
}
var configurationTable = function() {
  var e3 = [
    new Config(0, 0, 0, 0, deflate_stored),
    new Config(4, 4, 8, 4, deflate_fast),
    new Config(4, 5, 16, 8, deflate_fast),
    new Config(4, 6, 32, 32, deflate_fast),
    new Config(4, 4, 16, 16, deflate_slow),
    new Config(8, 16, 32, 32, deflate_slow),
    new Config(8, 16, 128, 128, deflate_slow),
    new Config(8, 32, 128, 256, deflate_slow),
    new Config(32, 128, 258, 1024, deflate_slow),
    new Config(32, 258, 258, 4096, deflate_slow)
  ];
  return configurationTable = function() {
    return e3;
  }, e3;
};
function lm_init(e3) {
  e3.window_size = 2 * e3.w_size, zero$1(e3.head);
  var t = configurationTable();
  e3.max_lazy_match = t[e3.level].max_lazy, e3.good_match = t[e3.level].good_length, e3.nice_match = t[e3.level].nice_length, e3.max_chain_length = t[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = MIN_MATCH$1 - 1, e3.match_available = 0, e3.ins_h = 0;
}
function DeflateState() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z_DEFLATED, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = Buf16(2 * HEAP_SIZE$1), this.dyn_dtree = Buf16(2 * (2 * D_CODES$1 + 1)), this.bl_tree = Buf16(2 * (2 * BL_CODES$1 + 1)), zero$1(this.dyn_ltree), zero$1(this.dyn_dtree), zero$1(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = Buf16(MAX_BITS$1 + 1), this.heap = Buf16(2 * L_CODES$1 + 1), zero$1(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = Buf16(2 * L_CODES$1 + 1), zero$1(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
function deflateResetKeep(e3) {
  var t;
  return e3 && e3.state ? (e3.total_in = e3.total_out = 0, e3.data_type = Z_UNKNOWN, (t = e3.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? INIT_STATE : BUSY_STATE, e3.adler = 2 === t.wrap ? 0 : 1, t.last_flush = Z_NO_FLUSH, _tr_init(t), Z_OK) : err(e3, Z_STREAM_ERROR);
}
function deflateReset(e3) {
  var t = deflateResetKeep(e3);
  return t === Z_OK && lm_init(e3.state), t;
}
function deflateSetHeader(e3, t) {
  return e3 && e3.state ? 2 !== e3.state.wrap ? Z_STREAM_ERROR : (e3.state.gzhead = t, Z_OK) : Z_STREAM_ERROR;
}
function deflateInit2(e3, t, r, i, n, a) {
  if (!e3) return Z_STREAM_ERROR;
  var s = 1;
  if (t === Z_DEFAULT_COMPRESSION && (t = 6), i < 0 ? (s = 0, i = -i) : i > 15 && (s = 2, i -= 16), n < 1 || n > MAX_MEM_LEVEL || r !== Z_DEFLATED || i < 8 || i > 15 || t < 0 || t > 9 || a < 0 || a > Z_FIXED)
    return err(e3, Z_STREAM_ERROR);
  8 === i && (i = 9);
  var o = new DeflateState();
  return e3.state = o, o.strm = e3, o.wrap = s, o.gzhead = null, o.w_bits = i, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = n + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + MIN_MATCH$1 - 1) / MIN_MATCH$1), o.window = Buf8(2 * o.w_size), o.head = Buf16(o.hash_size), o.prev = Buf16(o.w_size), o.lit_bufsize = 1 << n + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = t, o.strategy = a, o.method = r, deflateReset(e3);
}
function deflate(e3, t) {
  var r, i, n, a;
  if (!e3 || !e3.state || t > Z_BLOCK || t < 0)
    return e3 ? err(e3, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  if (i = e3.state, !e3.output || !e3.input && 0 !== e3.avail_in || i.status === FINISH_STATE && t !== Z_FINISH)
    return err(e3, 0 === e3.avail_out ? Z_BUF_ERROR : Z_STREAM_ERROR);
  if (i.strm = e3, r = i.last_flush, i.last_flush = t, i.status === INIT_STATE)
    if (2 === i.wrap)
      e3.adler = 0, put_byte(i, 31), put_byte(i, 139), put_byte(i, 8), i.gzhead ? (put_byte(
        i,
        (i.gzhead.text ? 1 : 0) + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)
      ), put_byte(i, 255 & i.gzhead.time), put_byte(i, i.gzhead.time >> 8 & 255), put_byte(i, i.gzhead.time >> 16 & 255), put_byte(i, i.gzhead.time >> 24 & 255), put_byte(
        i,
        9 === i.level ? 2 : i.strategy >= Z_HUFFMAN_ONLY || i.level < 2 ? 4 : 0
      ), put_byte(i, 255 & i.gzhead.os), i.gzhead.extra && i.gzhead.extra.length && (put_byte(i, 255 & i.gzhead.extra.length), put_byte(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = EXTRA_STATE) : (put_byte(i, 0), put_byte(i, 0), put_byte(i, 0), put_byte(i, 0), put_byte(i, 0), put_byte(
        i,
        9 === i.level ? 2 : i.strategy >= Z_HUFFMAN_ONLY || i.level < 2 ? 4 : 0
      ), put_byte(i, OS_CODE), i.status = BUSY_STATE);
    else {
      var s = Z_DEFLATED + (i.w_bits - 8 << 4) << 8;
      s |= (i.strategy >= Z_HUFFMAN_ONLY || i.level < 2 ? 0 : i.level < 6 ? 1 : 6 === i.level ? 2 : 3) << 6, 0 !== i.strstart && (s |= PRESET_DICT), s += 31 - s % 31, i.status = BUSY_STATE, putShortMSB(i, s), 0 !== i.strstart && (putShortMSB(i, e3.adler >>> 16), putShortMSB(i, 65535 & e3.adler)), e3.adler = 1;
    }
  if (i.status === EXTRA_STATE)
    if (i.gzhead.extra) {
      for (n = i.pending; i.gzindex < (65535 & i.gzhead.extra.length) && (i.pending !== i.pending_buf_size || (i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), flush_pending(e3), n = i.pending, i.pending !== i.pending_buf_size)); )
        put_byte(i, 255 & i.gzhead.extra[i.gzindex]), i.gzindex++;
      i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = NAME_STATE);
    } else i.status = NAME_STATE;
  if (i.status === NAME_STATE)
    if (i.gzhead.name) {
      n = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), flush_pending(e3), n = i.pending, i.pending === i.pending_buf_size)) {
          a = 1;
          break;
        }
        a = i.gzindex < i.gzhead.name.length ? 255 & i.gzhead.name.charCodeAt(i.gzindex++) : 0, put_byte(i, a);
      } while (0 !== a);
      i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), 0 === a && (i.gzindex = 0, i.status = COMMENT_STATE);
    } else i.status = COMMENT_STATE;
  if (i.status === COMMENT_STATE)
    if (i.gzhead.comment) {
      n = i.pending;
      do {
        if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), flush_pending(e3), n = i.pending, i.pending === i.pending_buf_size)) {
          a = 1;
          break;
        }
        a = i.gzindex < i.gzhead.comment.length ? 255 & i.gzhead.comment.charCodeAt(i.gzindex++) : 0, put_byte(i, a);
      } while (0 !== a);
      i.gzhead.hcrc && i.pending > n && (e3.adler = crc32(e3.adler, i.pending_buf, i.pending - n, n)), 0 === a && (i.status = HCRC_STATE);
    } else i.status = HCRC_STATE;
  if (i.status === HCRC_STATE && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && flush_pending(e3), i.pending + 2 <= i.pending_buf_size && (put_byte(i, 255 & e3.adler), put_byte(i, e3.adler >> 8 & 255), e3.adler = 0, i.status = BUSY_STATE)) : i.status = BUSY_STATE), 0 !== i.pending) {
    if (flush_pending(e3), 0 === e3.avail_out) return i.last_flush = -1, Z_OK;
  } else if (0 === e3.avail_in && rank(t) <= rank(r) && t !== Z_FINISH)
    return err(e3, Z_BUF_ERROR);
  if (i.status === FINISH_STATE && 0 !== e3.avail_in) return err(e3, Z_BUF_ERROR);
  if (0 !== e3.avail_in || 0 !== i.lookahead || t !== Z_NO_FLUSH && i.status !== FINISH_STATE) {
    var o = i.strategy === Z_HUFFMAN_ONLY ? deflate_huff(i, t) : i.strategy === Z_RLE ? deflate_rle(i, t) : configurationTable()[i.level].func(i, t);
    if (o !== BS_FINISH_STARTED && o !== BS_FINISH_DONE || (i.status = FINISH_STATE), o === BS_NEED_MORE || o === BS_FINISH_STARTED)
      return 0 === e3.avail_out && (i.last_flush = -1), Z_OK;
    if (o === BS_BLOCK_DONE && (t === Z_PARTIAL_FLUSH ? _tr_align(i) : t !== Z_BLOCK && (_tr_stored_block(i, 0, 0, false), t === Z_FULL_FLUSH && (zero$1(i.head), 0 === i.lookahead && (i.strstart = 0, i.block_start = 0, i.insert = 0))), flush_pending(e3), 0 === e3.avail_out))
      return i.last_flush = -1, Z_OK;
  }
  return t !== Z_FINISH ? Z_OK : i.wrap <= 0 ? Z_STREAM_END : (2 === i.wrap ? (put_byte(i, 255 & e3.adler), put_byte(i, e3.adler >> 8 & 255), put_byte(i, e3.adler >> 16 & 255), put_byte(i, e3.adler >> 24 & 255), put_byte(i, 255 & e3.total_in), put_byte(i, e3.total_in >> 8 & 255), put_byte(i, e3.total_in >> 16 & 255), put_byte(i, e3.total_in >> 24 & 255)) : (putShortMSB(i, e3.adler >>> 16), putShortMSB(i, 65535 & e3.adler)), flush_pending(e3), i.wrap > 0 && (i.wrap = -i.wrap), 0 !== i.pending ? Z_OK : Z_STREAM_END);
}
function deflateEnd(e3) {
  var t;
  return e3 && e3.state ? (t = e3.state.status) !== INIT_STATE && t !== EXTRA_STATE && t !== NAME_STATE && t !== COMMENT_STATE && t !== HCRC_STATE && t !== BUSY_STATE && t !== FINISH_STATE ? err(e3, Z_STREAM_ERROR) : (e3.state = null, t === BUSY_STATE ? err(e3, Z_DATA_ERROR) : Z_OK) : Z_STREAM_ERROR;
}
function deflateSetDictionary(e3, t) {
  var r, i, n, a, s, o, h, d, l = t.length;
  if (!e3 || !e3.state) return Z_STREAM_ERROR;
  if (2 === (a = (r = e3.state).wrap) || 1 === a && r.status !== INIT_STATE || r.lookahead)
    return Z_STREAM_ERROR;
  for (1 === a && (e3.adler = adler32(e3.adler, t, l, 0)), r.wrap = 0, l >= r.w_size && (0 === a && (zero$1(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), d = Buf8(r.w_size), arraySet(d, t, l - r.w_size, r.w_size, 0), t = d, l = r.w_size), s = e3.avail_in, o = e3.next_in, h = e3.input, e3.avail_in = l, e3.next_in = 0, e3.input = t, fill_window(r); r.lookahead >= MIN_MATCH$1; ) {
    i = r.strstart, n = r.lookahead - (MIN_MATCH$1 - 1);
    do {
      r.ins_h = (r.ins_h << r.hash_shift ^ r.window[i + MIN_MATCH$1 - 1]) & r.hash_mask, r.prev[i & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = i, i++;
    } while (--n);
    r.strstart = i, r.lookahead = MIN_MATCH$1 - 1, fill_window(r);
  }
  return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = MIN_MATCH$1 - 1, r.match_available = 0, e3.next_in = o, e3.input = h, e3.avail_in = s, r.wrap = a, Z_OK;
}
var toString$1 = Object.prototype.toString;
var Deflate = function(e3) {
  this.options = assign(
    {
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY,
      to: ""
    },
    e3 || {}
  );
  var t = this.options;
  t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new ZStream(), this.strm.avail_out = 0;
  var r = deflateInit2(
    this.strm,
    t.level,
    t.method,
    t.windowBits,
    t.memLevel,
    t.strategy
  );
  if (r !== Z_OK) throw new Error(msg[r]);
  if (t.header && deflateSetHeader(this.strm, t.header), t.dictionary) {
    var i;
    if (i = "string" == typeof t.dictionary ? string2buf(t.dictionary) : "[object ArrayBuffer]" === toString$1.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, (r = deflateSetDictionary(this.strm, i)) !== Z_OK)
      throw new Error(msg[r]);
    this._dict_set = true;
  }
};
Deflate.prototype.push = function(e3, t) {
  var r, i, n = this.strm, a = this.options.chunkSize;
  if (this.ended) return false;
  i = t === ~~t ? t : true === t ? Z_FINISH : Z_NO_FLUSH, "string" == typeof e3 ? n.input = string2buf(e3) : "[object ArrayBuffer]" === toString$1.call(e3) ? n.input = new Uint8Array(e3) : n.input = e3, n.next_in = 0, n.avail_in = n.input.length;
  do {
    if (0 === n.avail_out && (n.output = Buf8(a), n.next_out = 0, n.avail_out = a), (r = deflate(n, i)) !== Z_STREAM_END && r !== Z_OK)
      return this.onEnd(r), this.ended = true, false;
    0 !== n.avail_out && (0 !== n.avail_in || i !== Z_FINISH && i !== Z_SYNC_FLUSH) || ("string" === this.options.to ? this.onData(buf2binstring(shrinkBuf(n.output, n.next_out))) : this.onData(shrinkBuf(n.output, n.next_out)));
  } while ((n.avail_in > 0 || 0 === n.avail_out) && r !== Z_STREAM_END);
  return i === Z_FINISH ? (r = deflateEnd(this.strm), this.onEnd(r), this.ended = true, r === Z_OK) : i !== Z_SYNC_FLUSH || (this.onEnd(Z_OK), n.avail_out = 0, true);
}, Deflate.prototype.onData = function(e3) {
  this.chunks.push(e3);
}, Deflate.prototype.onEnd = function(e3) {
  e3 === Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = flattenChunks(this.chunks)), this.chunks = [], this.err = e3, this.msg = this.strm.msg;
};
var arrayType = function() {
  var e3 = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array ? "uint8array" : "array";
  arrayType = function() {
    return e3;
  };
};
var FlateWorker = function(e3) {
  function t(t2, r) {
    e3.call(this, "FlateWorker/" + t2), this._pako = null, this._pakoAction = t2, this._pakoOptions = r, this.meta = {};
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.processChunk = function(e4) {
    this.meta = e4.meta, null === this._pako && this._createPako(), this._pako.push(transformTo(arrayType(), e4.data), false);
  }, t.prototype.flush = function() {
    e3.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
  }, t.prototype.cleanUp = function() {
    e3.prototype.cleanUp.call(this), this._pako = null;
  }, t.prototype._createPako = function() {
    var e4 = this, t2 = { raw: true, level: this._pakoOptions.level || -1 };
    this._pako = "Deflate" === this._pakoAction ? new Deflate(t2) : new Inflate(t2), this._pako.onData = function(t3) {
      e4.push({ data: t3, meta: e4.meta });
    };
  }, t;
}(GenericWorker$1);
var DEFLATE = {
  magic: "\b\0",
  compressWorker: function(e3) {
    return new FlateWorker("Deflate", e3);
  },
  uncompressWorker: function() {
    return new FlateWorker("Inflate", {});
  }
};
var STORE = {
  magic: "\0\0",
  compressWorker: function() {
    return new GenericWorker$1("STORE compression");
  },
  uncompressWorker: function() {
    return new GenericWorker$1("STORE decompression");
  }
};
var compressions = { STORE, DEFLATE };
var LOCAL_FILE_HEADER = "PK";
var CENTRAL_FILE_HEADER = "PK";
var CENTRAL_DIRECTORY_END = "PK";
var ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
var ZIP64_CENTRAL_DIRECTORY_END = "PK";
var DATA_DESCRIPTOR = "PK\x07\b";
var decToHex = function(e3, t) {
  var r, i = "";
  for (r = 0; r < t; r++) i += String.fromCharCode(255 & e3), e3 >>>= 8;
  return i;
};
var generateUnixExternalFileAttr = function(e3, t) {
  var r = e3;
  return e3 || (r = t ? 16893 : 33204), (65535 & r) << 16;
};
var generateDosExternalFileAttr = function(e3, t) {
  return 63 & (e3 || 0);
};
var generateZipParts = function(e3, t, r, i, n, a) {
  var s, o, h = e3.file, d = e3.compression, l = a !== utf8encode, c = transformTo("string", a(h.name)), _ = transformTo("string", utf8encode(h.name)), u = h.comment, f = transformTo("string", a(u)), p = transformTo("string", utf8encode(u)), m = _.length !== h.name.length, g = p.length !== u.length, E = "", y = "", b = "", S = h.dir, T = h.date, A = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
  t && !r || (A.crc32 = e3.crc32, A.compressedSize = e3.compressedSize, A.uncompressedSize = e3.uncompressedSize);
  var k = 0;
  t && (k |= 8), l || !m && !g || (k |= 2048);
  var w = 0, v = 0;
  S && (w |= 16), "UNIX" === n ? (v = 798, w |= generateUnixExternalFileAttr(h.unixPermissions, S)) : (v = 20, w |= generateDosExternalFileAttr(h.dosPermissions)), s = T.getUTCHours(), s <<= 6, s |= T.getUTCMinutes(), s <<= 5, s |= T.getUTCSeconds() / 2, o = T.getUTCFullYear() - 1980, o <<= 4, o |= T.getUTCMonth() + 1, o <<= 5, o |= T.getUTCDate(), m && (y = decToHex(1, 1) + decToHex(crc32wrapper(c), 4) + _, E += "up" + decToHex(y.length, 2) + y), g && (b = decToHex(1, 1) + decToHex(crc32wrapper(f), 4) + p, E += "uc" + decToHex(b.length, 2) + b);
  var O = "";
  return O += "\n\0", O += decToHex(k, 2), O += d.magic, O += decToHex(s, 2), O += decToHex(o, 2), O += decToHex(A.crc32, 4), O += decToHex(A.compressedSize, 4), O += decToHex(A.uncompressedSize, 4), O += decToHex(c.length, 2), O += decToHex(E.length, 2), {
    fileRecord: LOCAL_FILE_HEADER + O + c + E,
    dirRecord: CENTRAL_FILE_HEADER + decToHex(v, 2) + O + decToHex(f.length, 2) + "\0\0\0\0" + decToHex(w, 4) + decToHex(i, 4) + c + E + f
  };
};
var generateCentralDirectoryEnd = function(e3, t, r, i, n) {
  var a = transformTo("string", n(i));
  return CENTRAL_DIRECTORY_END + "\0\0\0\0" + decToHex(e3, 2) + decToHex(e3, 2) + decToHex(t, 4) + decToHex(r, 4) + decToHex(a.length, 2) + a;
};
var generateDataDescriptors = function(e3) {
  return DATA_DESCRIPTOR + decToHex(e3.crc32, 4) + decToHex(e3.compressedSize, 4) + decToHex(e3.uncompressedSize, 4);
};
var ZipFileWorker = function(e3) {
  function t(t2, r, i, n) {
    e3.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = r, this.zipPlatform = i, this.encodeFileName = n, this.streamFiles = t2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.push = function(t2) {
    var r = t2.meta.percent || 0, i = this.entriesCount, n = this._sources.length;
    this.accumulate ? this.contentBuffer.push(t2) : (this.bytesWritten += t2.data.length, e3.prototype.push.call(this, {
      data: t2.data,
      meta: {
        currentFile: this.currentFile,
        percent: i ? (r + 100 * (i - n - 1)) / i : 100
      }
    }));
  }, t.prototype.openedSource = function(e4) {
    this.currentSourceOffset = this.bytesWritten, this.currentFile = e4.file.name;
    var t2 = this.streamFiles && !e4.file.dir;
    if (t2) {
      var r = generateZipParts(
        e4,
        t2,
        false,
        this.currentSourceOffset,
        this.zipPlatform,
        this.encodeFileName
      );
      this.push({ data: r.fileRecord, meta: { percent: 0 } });
    } else this.accumulate = true;
  }, t.prototype.closedSource = function(e4) {
    this.accumulate = false;
    var t2 = this.streamFiles && !e4.file.dir, r = generateZipParts(
      e4,
      t2,
      true,
      this.currentSourceOffset,
      this.zipPlatform,
      this.encodeFileName
    );
    if (this.dirRecords.push(r.dirRecord), t2)
      this.push({
        data: generateDataDescriptors(e4),
        meta: { percent: 100 }
      });
    else
      for (this.push({ data: r.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
        this.push(this.contentBuffer.shift());
    this.currentFile = null;
  }, t.prototype.flush = function() {
    for (var e4 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++)
      this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
    var r = this.bytesWritten - e4, i = generateCentralDirectoryEnd(
      this.dirRecords.length,
      r,
      e4,
      this.zipComment,
      this.encodeFileName
    );
    this.push({ data: i, meta: { percent: 100 } });
  }, t.prototype.prepareNextSource = function() {
    this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
  }, t.prototype.registerPrevious = function(e4) {
    this._sources.push(e4);
    var t2 = this;
    return e4.on("data", function(e5) {
      t2.processChunk(e5);
    }), e4.on("end", function() {
      t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
    }), e4.on("error", function(e5) {
      t2.error(e5);
    }), this;
  }, t.prototype.resume = function() {
    return !!e3.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
  }, t.prototype.error = function(t2) {
    var r = this._sources;
    if (!e3.prototype.error.call(this, t2)) return false;
    for (var i = 0; i < r.length; i++)
      try {
        r[i].error(t2);
      } catch (e4) {
      }
    return true;
  }, t.prototype.lock = function() {
    e3.prototype.lock.call(this);
    for (var t2 = this._sources, r = 0; r < t2.length; r++) t2[r].lock();
  }, t;
}(GenericWorker$1);
var ZipFileWorker$1 = ZipFileWorker;
var getCompression = function(e3, t) {
  var r = e3 || t, i = compressions[r];
  if (!i) throw new Error(r + " is not a valid compression method !");
  return i;
};
var generateWorker = function(e3, t, r) {
  var i = new ZipFileWorker$1(t.streamFiles, r, t.platform, t.encodeFileName), n = 0;
  try {
    e3.forEach(function(e4, r2) {
      n++;
      var a = getCompression(r2.options.compression, t.compression), s = r2.options.compressionOptions || t.compressionOptions || {}, o = r2.dir, h = r2.date;
      r2._compressWorker(a, s).withStreamInfo("file", {
        name: e4,
        dir: o,
        date: h,
        comment: r2.comment || "",
        unixPermissions: r2.unixPermissions,
        dosPermissions: r2.dosPermissions
      }).pipe(i);
    }), i.entriesCount = n;
  } catch (e4) {
    i.error(e4);
  }
  return i;
};
var DataReader = function(e3) {
  this.data = e3, this.length = e3.length, this.index = 0, this.zero = 0;
};
DataReader.prototype.checkOffset = function(e3) {
  this.checkIndex(this.index + e3);
}, DataReader.prototype.checkIndex = function(e3) {
  if (this.length < this.zero + e3 || e3 < 0)
    throw new Error(
      "End of data reached (data length = " + this.length + ", asked index = " + e3 + "). Corrupted zip ?"
    );
}, DataReader.prototype.setIndex = function(e3) {
  this.checkIndex(e3), this.index = e3;
}, DataReader.prototype.skip = function(e3) {
  this.setIndex(this.index + e3);
}, DataReader.prototype.byteAt = function(e3) {
}, DataReader.prototype.readInt = function(e3) {
  var t, r = 0;
  for (this.checkOffset(e3), t = this.index + e3 - 1; t >= this.index; t--)
    r = (r << 8) + this.byteAt(t);
  return this.index += e3, r;
}, DataReader.prototype.readString = function(e3) {
  return transformTo("string", this.readData(e3));
}, DataReader.prototype.readData = function(e3) {
}, DataReader.prototype.lastIndexOfSignature = function(e3) {
}, DataReader.prototype.readAndCheckSignature = function(e3) {
}, DataReader.prototype.readDate = function() {
  var e3 = this.readInt(4);
  return new Date(
    Date.UTC(
      1980 + (e3 >> 25 & 127),
      (e3 >> 21 & 15) - 1,
      e3 >> 16 & 31,
      e3 >> 11 & 31,
      e3 >> 5 & 63,
      (31 & e3) << 1
    )
  );
};
var DataReader$1 = DataReader;
var ArrayReader = function(e3) {
  function t(t2) {
    e3.call(this, t2);
    for (var r = 0; r < this.data.length; r++) t2[r] = 255 & t2[r];
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.byteAt = function(e4) {
    return this.data[this.zero + e4];
  }, t.prototype.lastIndexOfSignature = function(e4) {
    for (var t2 = e4.charCodeAt(0), r = e4.charCodeAt(1), i = e4.charCodeAt(2), n = e4.charCodeAt(3), a = this.length - 4; a >= 0; --a)
      if (this.data[a] === t2 && this.data[a + 1] === r && this.data[a + 2] === i && this.data[a + 3] === n)
        return a - this.zero;
    return -1;
  }, t.prototype.readAndCheckSignature = function(e4) {
    var t2 = e4.charCodeAt(0), r = e4.charCodeAt(1), i = e4.charCodeAt(2), n = e4.charCodeAt(3), a = this.readData(4);
    return t2 === a[0] && r === a[1] && i === a[2] && n === a[3];
  }, t.prototype.readData = function(e4) {
    if (this.checkOffset(e4), 0 === e4) return [];
    var t2 = this.data.slice(
      this.zero + this.index,
      this.zero + this.index + e4
    );
    return this.index += e4, t2;
  }, t;
}(DataReader$1);
var ArrayReader$1 = ArrayReader;
var StringReader = function(e3) {
  function t(t2) {
    e3.call(this, t2);
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.byteAt = function(e4) {
    return this.data.charCodeAt(this.zero + e4);
  }, t.prototype.lastIndexOfSignature = function(e4) {
    return this.data.lastIndexOf(e4) - this.zero;
  }, t.prototype.readAndCheckSignature = function(e4) {
    return e4 === this.readData(4);
  }, t.prototype.readData = function(e4) {
    this.checkOffset(e4);
    var t2 = this.data.slice(
      this.zero + this.index,
      this.zero + this.index + e4
    );
    return this.index += e4, t2;
  }, t;
}(DataReader$1);
var StringReader$1 = StringReader;
var Uint8ArrayReader = function(e3) {
  function t(t2) {
    e3.call(this, t2);
  }
  return e3 && (t.__proto__ = e3), t.prototype = Object.create(e3 && e3.prototype), t.prototype.constructor = t, t.prototype.readData = function(e4) {
    if (this.checkOffset(e4), 0 === e4) return new Uint8Array(0);
    var t2 = this.data.subarray(
      this.zero + this.index,
      this.zero + this.index + e4
    );
    return this.index += e4, t2;
  }, t;
}(ArrayReader$1);
var Uint8ArrayReader$1 = Uint8ArrayReader;
function readerFor(e3) {
  var t = getTypeOf(e3);
  return checkSupport(t), "string" !== t || support$1.uint8array ? support$1.uint8array ? new Uint8ArrayReader$1(transformTo("uint8array", e3)) : new ArrayReader$1(transformTo("array", e3)) : new StringReader$1(e3);
}
var MADE_BY_DOS = 0;
var MADE_BY_UNIX = 3;
var findCompression = function(e3) {
  for (var t in compressions)
    if (compressions.hasOwnProperty(t) && compressions[t].magic === e3)
      return compressions[t];
  return null;
};
var ZipEntry = function(e3, t) {
  this.options = e3, this.loadOptions = t;
};
ZipEntry.prototype.isEncrypted = function() {
  return 1 == (1 & this.bitFlag);
}, ZipEntry.prototype.useUTF8 = function() {
  return 2048 == (2048 & this.bitFlag);
}, ZipEntry.prototype.readLocalPart = function(e3) {
  var t, r;
  if (e3.skip(22), this.fileNameLength = e3.readInt(2), r = e3.readInt(2), this.fileName = e3.readData(this.fileNameLength), e3.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize)
    throw new Error(
      "Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)"
    );
  if (null === (t = findCompression(this.compressionMethod)))
    throw new Error(
      "Corrupted zip : compression " + pretty(this.compressionMethod) + " unknown (inner file : " + transformTo("string", this.fileName) + ")"
    );
  this.decompressed = new CompressedObject$1(
    this.compressedSize,
    this.uncompressedSize,
    this.crc32,
    t,
    e3.readData(this.compressedSize)
  );
}, ZipEntry.prototype.readCentralPart = function(e3) {
  this.versionMadeBy = e3.readInt(2), e3.skip(2), this.bitFlag = e3.readInt(2), this.compressionMethod = e3.readString(2), this.date = e3.readDate(), this.crc32 = e3.readInt(4), this.compressedSize = e3.readInt(4), this.uncompressedSize = e3.readInt(4);
  var t = e3.readInt(2);
  if (this.extraFieldsLength = e3.readInt(2), this.fileCommentLength = e3.readInt(2), this.diskNumberStart = e3.readInt(2), this.internalFileAttributes = e3.readInt(2), this.externalFileAttributes = e3.readInt(4), this.localHeaderOffset = e3.readInt(4), this.isEncrypted())
    throw new Error("Encrypted zip are not supported");
  e3.skip(t), this.readExtraFields(e3), this.parseZIP64ExtraField(e3), this.fileComment = e3.readData(this.fileCommentLength);
}, ZipEntry.prototype.processAttributes = function() {
  this.unixPermissions = null, this.dosPermissions = null;
  var e3 = this.versionMadeBy >> 8;
  this.dir = !!(16 & this.externalFileAttributes), e3 === MADE_BY_DOS && (this.dosPermissions = 63 & this.externalFileAttributes), e3 === MADE_BY_UNIX && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
}, ZipEntry.prototype.parseZIP64ExtraField = function(e3) {
  if (this.extraFields[1]) {
    var t = readerFor(this.extraFields[1].value);
    this.uncompressedSize === MAX_VALUE_32BITS && (this.uncompressedSize = t.readInt(8)), this.compressedSize === MAX_VALUE_32BITS && (this.compressedSize = t.readInt(8)), this.localHeaderOffset === MAX_VALUE_32BITS && (this.localHeaderOffset = t.readInt(8)), this.diskNumberStart === MAX_VALUE_32BITS && (this.diskNumberStart = t.readInt(4));
  }
}, ZipEntry.prototype.readExtraFields = function(e3) {
  var t, r, i, n = e3.index + this.extraFieldsLength;
  for (this.extraFields || (this.extraFields = {}); e3.index < n; )
    t = e3.readInt(2), r = e3.readInt(2), i = e3.readData(r), this.extraFields[t] = { id: t, length: r, value: i };
}, ZipEntry.prototype.handleUTF8 = function() {
  var e3 = support$1.uint8array ? "uint8array" : "array";
  if (this.useUTF8())
    this.fileNameStr = utf8decode(this.fileName), this.fileCommentStr = utf8decode(this.fileComment);
  else {
    var t = this.findExtraFieldUnicodePath();
    if (null !== t) this.fileNameStr = t;
    else {
      var r = transformTo(e3, this.fileName);
      this.fileNameStr = this.loadOptions.decodeFileName(r);
    }
    var i = this.findExtraFieldUnicodeComment();
    if (null !== i) this.fileCommentStr = i;
    else {
      var n = transformTo(e3, this.fileComment);
      this.fileCommentStr = this.loadOptions.decodeFileName(n);
    }
  }
}, ZipEntry.prototype.findExtraFieldUnicodePath = function() {
  var e3 = this.extraFields[28789];
  if (e3) {
    var t = readerFor(e3.value);
    return 1 !== t.readInt(1) || crc32wrapper(this.fileName) !== t.readInt(4) ? null : utf8decode(t.readData(e3.length - 5));
  }
  return null;
}, ZipEntry.prototype.findExtraFieldUnicodeComment = function() {
  var e3 = this.extraFields[25461];
  if (e3) {
    var t = readerFor(e3.value);
    return 1 !== t.readInt(1) || crc32wrapper(this.fileComment) !== t.readInt(4) ? null : utf8decode(t.readData(e3.length - 5));
  }
  return null;
};
var ZipEntry$1 = ZipEntry;
var ZipEntries = function(e3) {
  this.files = [], this.loadOptions = e3;
};
ZipEntries.prototype.checkSignature = function(e3) {
  if (!this.reader.readAndCheckSignature(e3)) {
    this.reader.index -= 4;
    var t = this.reader.readString(4);
    throw new Error(
      "Corrupted zip or bug: unexpected signature (" + pretty(t) + ", expected " + pretty(e3) + ")"
    );
  }
}, ZipEntries.prototype.isSignature = function(e3, t) {
  var r = this.reader.index;
  this.reader.setIndex(e3);
  var i = this.reader.readString(4) === t;
  return this.reader.setIndex(r), i;
}, ZipEntries.prototype.readBlockEndOfCentral = function() {
  this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
  var e3 = this.reader.readData(this.zipCommentLength), t = support$1.uint8array ? "uint8array" : "array", r = transformTo(t, e3);
  this.zipComment = this.loadOptions.decodeFileName(r);
}, ZipEntries.prototype.readBlockZip64EndOfCentral = function() {
  this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
  for (var e3, t, r, i = this.zip64EndOfCentralSize - 44; 0 < i; )
    e3 = this.reader.readInt(2), t = this.reader.readInt(4), r = this.reader.readData(t), this.zip64ExtensibleData[e3] = { id: e3, length: t, value: r };
}, ZipEntries.prototype.readBlockZip64EndOfCentralLocator = function() {
  if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1)
    throw new Error("Multi-volumes zip are not supported");
}, ZipEntries.prototype.readLocalFiles = function() {
  var e3, t;
  for (e3 = 0; e3 < this.files.length; e3++)
    t = this.files[e3], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes();
}, ZipEntries.prototype.readCentralDir = function() {
  var e3;
  for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(CENTRAL_FILE_HEADER); )
    (e3 = new ZipEntry$1(
      { zip64: this.zip64 },
      this.loadOptions
    )).readCentralPart(this.reader), this.files.push(e3);
  if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
    throw new Error(
      "Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length
    );
}, ZipEntries.prototype.readEndOfCentral = function() {
  var e3 = this.reader.lastIndexOfSignature(CENTRAL_DIRECTORY_END);
  if (e3 < 0)
    throw !this.isSignature(0, LOCAL_FILE_HEADER) ? new Error(
      "Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"
    ) : new Error("Corrupted zip: can't find end of central directory");
  this.reader.setIndex(e3);
  var t = e3;
  if (this.checkSignature(CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === MAX_VALUE_16BITS || this.diskWithCentralDirStart === MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === MAX_VALUE_16BITS || this.centralDirRecords === MAX_VALUE_16BITS || this.centralDirSize === MAX_VALUE_32BITS || this.centralDirOffset === MAX_VALUE_32BITS) {
    if (this.zip64 = true, (e3 = this.reader.lastIndexOfSignature(
      ZIP64_CENTRAL_DIRECTORY_LOCATOR
    )) < 0)
      throw new Error(
        "Corrupted zip: can't find the ZIP64 end of central directory locator"
      );
    if (this.reader.setIndex(e3), this.checkSignature(ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(
      this.relativeOffsetEndOfZip64CentralDir,
      ZIP64_CENTRAL_DIRECTORY_END
    ) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
      throw new Error(
        "Corrupted zip: can't find the ZIP64 end of central directory"
      );
    this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
  }
  var r = this.centralDirOffset + this.centralDirSize;
  this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize);
  var i = t - r;
  if (i > 0)
    this.isSignature(t, CENTRAL_FILE_HEADER) || (this.reader.zero = i);
  else if (i < 0)
    throw new Error("Corrupted zip: missing " + Math.abs(i) + " bytes.");
}, ZipEntries.prototype.prepareReader = function(e3) {
  this.reader = readerFor(e3);
}, ZipEntries.prototype.load = function(e3) {
  this.prepareReader(e3), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
};
var ZipEntries$1 = ZipEntries;
function checkEntryCRC32(e3) {
  return new external.Promise(function(t, r) {
    var i = e3.decompressed.getContentWorker().pipe(new Crc32Probe$1());
    i.on("error", function(e4) {
      r(e4);
    }).on("end", function() {
      i.streamInfo.crc32 !== e3.decompressed.crc32 ? r(new Error("Corrupted zip : CRC32 mismatch")) : t();
    }).resume();
  });
}
function load(e3, t) {
  var r = this;
  return t = extend(t || {}, {
    base64: false,
    checkCRC32: false,
    optimizedBinaryString: false,
    createFolders: false,
    decodeFileName: utf8decode
  }), prepareContent(
    "the loaded zip file",
    e3,
    true,
    t.optimizedBinaryString,
    t.base64
  ).then(function(e4) {
    var r2 = new ZipEntries$1(t);
    return r2.load(e4), r2;
  }).then(function(e4) {
    var r2 = [external.Promise.resolve(e4)], i = e4.files;
    if (t.checkCRC32)
      for (var n = 0; n < i.length; n++) r2.push(checkEntryCRC32(i[n]));
    return external.Promise.all(r2);
  }).then(function(e4) {
    for (var i = e4.shift(), n = i.files, a = 0; a < n.length; a++) {
      var s = n[a];
      r.file(s.fileNameStr, s.decompressed, {
        binary: true,
        optimizedBinaryString: true,
        date: s.date,
        dir: s.dir,
        comment: s.fileCommentStr.length ? s.fileCommentStr : null,
        unixPermissions: s.unixPermissions,
        dosPermissions: s.dosPermissions,
        createFolders: t.createFolders
      });
    }
    return i.zipComment.length && (r.comment = i.zipComment), r;
  });
}
var fileAdd = function(e3, t, r) {
  var i, n = getTypeOf(t), a = extend(r || {}, defaults);
  a.date = a.date || /* @__PURE__ */ new Date(), null !== a.compression && (a.compression = a.compression.toUpperCase()), "string" == typeof a.unixPermissions && (a.unixPermissions = parseInt(a.unixPermissions, 8)), a.unixPermissions && 16384 & a.unixPermissions && (a.dir = true), a.dosPermissions && 16 & a.dosPermissions && (a.dir = true), a.dir && (e3 = forceTrailingSlash(e3)), a.createFolders && (i = parentFolder(e3)) && folderAdd.call(this, i, true);
  var s = "string" === n && false === a.binary && false === a.base64;
  r && void 0 !== r.binary || (a.binary = !s), (t instanceof CompressedObject$1 && 0 === t.uncompressedSize || a.dir || !t || 0 === t.length) && (a.base64 = false, a.binary = true, t = "", a.compression = "STORE", n = "string");
  var o = null;
  o = t instanceof CompressedObject$1 || t instanceof GenericWorker$1 ? t : prepareContent(e3, t, a.binary, a.optimizedBinaryString, a.base64);
  var h = new ZipObject$1(e3, o, a);
  this.files[e3] = h;
};
var parentFolder = function(e3) {
  "/" === e3.slice(-1) && (e3 = e3.substring(0, e3.length - 1));
  var t = e3.lastIndexOf("/");
  return t > 0 ? e3.substring(0, t) : "";
};
var forceTrailingSlash = function(e3) {
  return "/" !== e3.slice(-1) && (e3 += "/"), e3;
};
var folderAdd = function(e3, t) {
  return t = void 0 !== t ? t : createFolders, e3 = forceTrailingSlash(e3), this.files[e3] || fileAdd.call(this, e3, null, { dir: true, createFolders: t }), this.files[e3];
};
function isRegExp(e3) {
  return "[object RegExp]" === Object.prototype.toString.call(e3);
}
var JSZip = function e2() {
  if (arguments.length)
    throw new Error(
      "The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide."
    );
  this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
    var t = new e2();
    for (var r in this) "function" != typeof this[r] && (t[r] = this[r]);
    return t;
  };
};
var staticAccessors = {
  support: { configurable: true },
  defaults: { configurable: true },
  version: { configurable: true },
  external: { configurable: true }
};
JSZip.prototype.load = function() {
  throw new Error(
    "This method has been removed in JSZip 3.0, please check the upgrade guide."
  );
}, JSZip.prototype.forEach = function(e3) {
  var t, r, i;
  for (t in this.files)
    i = this.files[t], (r = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e3(r, i);
}, JSZip.prototype.filter = function(e3) {
  var t = [];
  return this.forEach(function(r, i) {
    e3(r, i) && t.push(i);
  }), t;
}, JSZip.prototype.file = function(e3, t, r) {
  if (1 === arguments.length) {
    if (isRegExp(e3)) {
      var i = e3;
      return this.filter(function(e4, t2) {
        return !t2.dir && i.test(e4);
      });
    }
    var n = this.files[this.root + e3];
    return n && !n.dir ? n : null;
  }
  return e3 = this.root + e3, fileAdd.call(this, e3, t, r), this;
}, JSZip.prototype.folder = function(e3) {
  if (!e3) return this;
  if (isRegExp(e3))
    return this.filter(function(t2, r2) {
      return r2.dir && e3.test(t2);
    });
  var t = this.root + e3, r = folderAdd.call(this, t), i = this.clone();
  return i.root = r.name, i;
}, JSZip.prototype.remove = function(e3) {
  e3 = this.root + e3;
  var t = this.files[e3];
  if (t || ("/" !== e3.slice(-1) && (e3 += "/"), t = this.files[e3]), t && !t.dir)
    delete this.files[e3];
  else
    for (var r = this.filter(function(t2, r2) {
      return r2.name.slice(0, e3.length) === e3;
    }), i = 0; i < r.length; i++)
      delete this.files[r[i].name];
  return this;
}, JSZip.prototype.generate = function(e3) {
  throw new Error(
    "This method has been removed in JSZip 3.0, please check the upgrade guide."
  );
}, JSZip.prototype.generateInternalStream = function(e3) {
  var t, r = {};
  try {
    if ((r = extend(e3 || {}, {
      streamFiles: false,
      compression: "STORE",
      compressionOptions: null,
      type: "",
      platform: "DOS",
      comment: null,
      mimeType: "application/zip",
      encodeFileName: utf8encode
    })).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type)
      throw new Error("No output type specified.");
    checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS");
    var i = r.comment || this.comment || "";
    t = generateWorker(this, r, i);
  } catch (e4) {
    (t = new GenericWorker$1("error")).error(e4);
  }
  return new StreamHelper$1(t, r.type || "string", r.mimeType);
}, JSZip.prototype.generateAsync = function(e3, t) {
  return this.generateInternalStream(e3).accumulate(t);
}, JSZip.prototype.loadAsync = function(e3, t) {
  return load.apply(this, [e3, t]);
}, JSZip.loadAsync = function(e3, t) {
  return new JSZip().loadAsync(e3, t);
}, staticAccessors.support.get = function() {
  return support$1;
}, staticAccessors.defaults.get = function() {
  return defaults;
}, staticAccessors.version.get = function() {
  return "3.2.2-esm";
}, staticAccessors.external.get = function() {
  return external;
}, Object.defineProperties(JSZip, staticAccessors);
var jszip_min_default = JSZip;

// index.js
var DEFAULT_TITLE = "No title";
var DEFAULT_CHAPTER_TITLE = "No title";
var DEFAULT_AUTHOR = "Anonymous";
var MIME_TYPES = {
  epub: "application/epub+zip",
  ncx: "application/x-dtbncx+xml",
  xml: "application/xml",
  // https://datatracker.ietf.org/doc/html/rfc7303#section-4.1
  xhtml: "application/xhtml+xml",
  doc: "application/msword",
  json: "application/json",
  txt: "text/plain",
  html: "text/html",
  htm: "text/html",
  js: "text/javascript",
  csv: "text/csv",
  css: "text/css",
  bmp: "image/bmp",
  avif: "image/avif",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  tiff: "image/tiff",
  tif: "image/tiff",
  webp: "image/webp",
  svg: "image/svg+xml",
  wav: "audio/wav",
  weba: "audio/webm",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  ttf: "font/ttf",
  avi: "video/x-msvideo",
  webm: "video/webm",
  mp4: "video/mp4"
};
function getMimetype(p) {
  return MIME_TYPES[p.split(".").pop()];
}
function getISOString(v) {
  return new Date(v).toISOString().replace(/\.[0-9]+Z$/, "Z");
}
function getRelativePath(p) {
  return p.replace(/^EPUB\//, "");
}
function renderProps(obj) {
  if (!obj) {
    obj = {};
  }
  let result = "", entries = Object.entries(obj);
  for (const [key, value] of entries) {
    if (value) {
      result += ` ${key}="${value}"`;
    }
  }
  return result;
}
function removeHeaderFromBase64(base642) {
  return base642.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
}
function getMimetypeFromBase64(base642) {
  const res = /^data:([A-Za-z-+\/]+);base64,/.exec(base642);
  return res ? res[1] : null;
}
function getExtensionFromMimetype(mime) {
  if (!mime) {
    return null;
  }
  for (const [key, value] of Object.entries(MIME_TYPES)) {
    if (value === mime) {
      return "." + key;
    }
  }
  return null;
}
var EPUB = class {
  constructor() {
    this.__version__ = "3.0", this.__data__ = {
      // triggers
      isTitleChanged: false,
      isAuthorChanged: false,
      // book options
      id: util_default.id(),
      title: DEFAULT_TITLE,
      category: null,
      authors: [DEFAULT_AUTHOR],
      publisher: null,
      language: "en",
      textDirection: "auto",
      // ltr, rtl, auto
      pageDirection: null,
      // ltr, rtl
      cover: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAAAAFESAAQAAAABAAAAAAAAAAAAAYagAACxj//bAEMAAgEBAgEBAgICAgICAgIDBQMDAwMDBgQEAwUHBgcHBwYHBwgJCwkICAoIBwcKDQoKCwwMDAwHCQ4PDQwOCwwMDP/bAEMBAgICAwMDBgMDBgwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAEAAQAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AP38ooooAKKKKACiiigAooooAKKK8h8W/t2fDDwP8Um8I6jrmqJqEN3Fp93qEHh3UrnQtMu5SBHa3eqx27WFrOxZAIp50kzLENv7xNwB69RXiXxA/wCCiPwl+GnizxFoeoa9rd5q3g+6S18QW2j+FtW1htALwLOk14bO2lFtbmJwwuJSsPyuN+UcL6HpHxu8K+IfG2meHtP1q1vtU1rRT4isVtlaWG708Okf2hJlBiKlpEwN2SGyARzQB1VFfKf7U37YPh7SfGPwT17S/GF5Y+GF+JOoeG9bMP2m3W+nttP1KF7Jodoe5b7XEipGqv5kix+WHJXPYeKv2yfB3xT+AHjDWPC/jzVvAN14ZmtYNRu9Z8G39tqugNLNF5Zm0m+giuQsyttR2iCsHLqSFJAB75RXnOs/tXeCdE+MkPgN7zWrrxBJKkE7WHh7Ub7TdMmdA8cN5qEMD2dnK6shSO5mjd/Mj2g+Ym70agAr8/8ASv2BZtL+Kninwn4w+GPxs8d6H4o8V3uuW/iLSPjHfab4PNrd3b3Yjv8ASRrEDRvEzFHSDT7iOXajkku6p+gFFAHxL8K/iT48+G/7RX7TVr4S+E+pfEFdY8bWsFpdaZq+nWUenz/2Fpy7tQ+2TwutuMxkPardS48weTlVEmx4T+A3xB/Y68RfB3WNN8H6t8XI/DPgB/A2tQeHL3TrO8tbgy2863aLqFzaxPa5ikQhZRKuYyInBbZ9Q+DfhXoPw+8QeJtV0ew+x3/jC/XVNXl8+ST7XcrBFbh8MxCYihjXCBV+XOMkk9DQB8F+Fv2cvjR4W8F/DHWrz4dabqHiLwx8ZfEvjTVtGtddtWEemXf9reS9vPIyI8zJdQ7EbZ87gOYl3Oh+1l4c8aeO/g78ZPih4q8Jah8O7fXtI8PeGdH8NapeWV3qxFtq5la4uTZTT2ytJJdbY4455TtTLFGcxr96Vw/xD/Z18K/Fbx94f8R+ILfV9RvPDEizWFo2uX0elCZXDxzS6eswtJ5o3AaOWaF3jZQUZSAQAeF/FD4UeOtG/bFt9a+Gfhb4geFbrXNTsbrxP4gh1zS7nwT4isY/LSZLzT7i4N5DfC3jZEmsrSNmYQCS4eMMqfVlFFABRRRQAUUUUAFFFFABRRRQB//Z",
      style: "",
      // default style
      tags: [],
      publishedAt: null,
      createdAt: /* @__PURE__ */ new Date(),
      modifiedAt: /* @__PURE__ */ new Date(),
      // https://www.w3.org/TR/epub-33/#layout
      // spine options
      enableNCX: false,
      // legacy, EPUB 2 compatibility
      renditionLayout: null,
      // pre-paginated, reflowable(default)
      renditionOrientation: null,
      // landscape, portrait, auto(default)
      renditionSpread: null,
      // none, landscape, both, auto(default)
      renditionFlow: null,
      // paginated, scrolled-continuous, scrolled-doc, auto(default)
      // epub options
      containerPath: `META-INF/container.xml`,
      packagePath: `EPUB/${util_default.id()}.opf`,
      ncxPath: `EPUB/${util_default.id()}.ncx`,
      navPath: `EPUB/${util_default.id()}.xhtml`,
      navTitle: `Index`,
      navId: `navigation`,
      // manifest, spine
      coverPath: `EPUB/${util_default.id()}.jpg`,
      coverId: `cover-image`
      // manifest, package.meta
    };
    this.__files__ = [
      {
        path: "mimetype",
        data: "application/epub+zip",
        encoding: "utf8",
        // or "base64"
        // package.opf
        manifest: null,
        // object
        spine: null,
        // object
        // nav.xhtml
        toc: null,
        // array
        landmarks: null
        // array
      }
    ];
    this.update();
  }
  get data() {
    return this.__data__;
  }
};
EPUB.prototype.getFile = function(path) {
  return this.__files__.find(function(item) {
    return item.path === path;
  });
};
EPUB.prototype.setFile = function({
  path,
  data,
  encoding,
  manifest,
  spine,
  toc,
  landmarks
}) {
  encoding = encoding || "utf8";
  manifest = manifest || null;
  spine = spine || null;
  toc = toc || [];
  landmarks = landmarks || [];
  if (manifest) {
    manifest.mediaType = manifest.mediaType || getMimetype(manifest.href);
  }
  const file = this.getFile(path);
  if (file) {
    file.data = data;
    file.encoding = encoding;
    file.manifest = manifest;
    file.spine = spine;
    file.toc = toc;
    file.landmarks = landmarks;
  } else {
    this.__files__.push({
      path,
      data,
      encoding,
      manifest,
      spine,
      toc,
      landmarks
    });
  }
};
EPUB.prototype.update = function() {
  this.updateContainer();
  this.updateCover();
  this.updateNav();
  this.updateNCX();
  this.updatePackage();
};
EPUB.prototype.updateContainer = function() {
  const data = `
<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles>
<rootfile full-path="${this.__data__.packagePath}" media-type="application/oebps-package+xml"/>
</rootfiles>
</container>
  `;
  this.setFile({
    path: this.__data__.containerPath,
    data: data.trim()
  });
};
EPUB.prototype.updateCover = function() {
  this.setFile({
    path: this.__data__.coverPath,
    data: removeHeaderFromBase64(this.__data__.cover),
    encoding: "base64",
    manifest: {
      id: this.__data__.coverId,
      href: getRelativePath(this.__data__.coverPath),
      mediaType: "image/jpeg",
      properties: "cover-image"
    }
  });
};
EPUB.prototype.updateNav = function() {
  function createTOC(arr) {
    return arr.reduce((prev, curr) => {
      return prev + createTOCItem(curr);
    }, "\n");
  }
  function createTOCItem(arr) {
    return arr.reduce((prev, { id: id2, title, href, toc }) => {
      return prev + `<li><a href="${href}">${title}</a>${toc && toc.length > 0 ? createTOCItem(toc) : ""}</li>
`;
    }, "");
  }
  function createLandmarks(arr) {
    return arr.reduce((prev, curr) => {
      return prev + createLandmarkItem(curr);
    }, "\n");
  }
  function createLandmarkItem(arr) {
    return arr.reduce((prev, { id: id2, title, href, epubType }) => {
      return prev + `<li><a epub:type="${epubType || ""}" href="${href}">${title}</a></li>
`;
    }, "");
  }
  const data = `
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${this.__data__.language}" lang="${this.__data__.language}" dir="${this.__data__.textDirection}" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
<meta charset="utf-8"/>
<title>${this.__data__.navTitle}</title>${this.__data__.style}
</head>
<body>
<nav epub:type="toc" id="toc">			
<h1>${this.__data__.navTitle}</h1>
<ol>${createTOC(this.__files__.filter((e3) => e3.toc).map((e3) => e3.toc))}</ol>
</nav>
<!--
<nav epub:type="landmarks" id="landmarks">
<h1>Landmarks</h1>
<ol>${createLandmarks(this.__files__.filter((e3) => e3.landmarks).map((e3) => e3.landmarks))}</ol>
</nav>
-->
</body>
</html>
  `;
  this.setFile({
    path: this.__data__.navPath,
    data: data.trim(),
    manifest: {
      id: this.__data__.navId,
      href: getRelativePath(this.__data__.navPath),
      mediaType: "application/xhtml+xml",
      properties: "nav"
    },
    spine: {
      id: this.__data__.navId,
      linear: true
    },
    toc: [
      {
        href: getRelativePath(this.__data__.navPath),
        title: this.__data__.navTitle
      }
    ]
  });
};
EPUB.prototype.updateNCX = function() {
  if (!this.__data__.enableNCX) {
    return;
  }
  function createNavMap(arr) {
    return arr.reduce((prev, curr) => {
      return prev + createNavPoint(curr);
    }, "\n");
  }
  function createNavPoint(arr) {
    return arr.reduce((prev, { id: id2, title, href, toc }) => {
      return prev + `
<navPoint id="${id2 || ""}">
<navLabel>
<text>${title}</text>
</navLabel>
<content src="${href}"/>${toc && toc.length > 0 ? createNavPoint(toc) : ""}
</navPoint>
      `.trim() + "\n";
    }, "");
  }
  const data = `
<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns:m="http://www.w3.org/1998/Math/MathML" xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${this.__data__.language}">
<head>
<meta name="dtb:uid" content="${this.__data__.id}"/>
<meta name="dtb:depth" content="1"/>
<meta name="dtb:totalPageCount" content="0"/>
<meta name="dtb:maxPageNumber" content="0"/>
</head>
<docTitle><text>${this.__data__.title}</text></docTitle>
${this.__data__.authors.map((e3) => "<docAuthor><text>" + e3 + "</text></docAuthor>").join("\n")}
<navMap>${createNavMap(this.__files__.filter((e3) => e3.toc).map((e3) => e3.toc))}</navMap>
</ncx>
  `;
  this.setFile({
    path: this.__data__.ncxPath,
    data: data.trim(),
    manifest: {
      id: "ncx",
      href: getRelativePath(this.__data__.ncxPath),
      mediaType: "application/x-dtbncx+xml"
    }
  });
};
EPUB.prototype.updatePackage = function() {
  function createMetadata({
    id: id2,
    title,
    category,
    authors,
    publisher,
    language,
    publishedAt,
    modifiedAt,
    cover,
    coverId,
    tags,
    renditionLayout,
    renditionOrientation,
    renditionSpread,
    renditionFlow
  }) {
    let _id = id2 ? `<dc:identifier id="uid">${id2}</dc:identifier>
` : "";
    let _title = title ? `<dc:title id="title">${title}</dc:title>
` : "";
    let _authors = authors.map((e3, i) => `<dc:creator id="author-${i}">${e3}</dc:creator>
`).join("");
    let _publisher = publisher ? `<dc:publisher>${publisher}</dc:publisher>
` : "";
    let _category = category ? `<dc:type>${category}</dc:type>
` : "";
    let _language = language ? `<dc:language>${language}</dc:language>
` : "";
    let _publishedAt = publishedAt ? `<dc:date>${getISOString(publishedAt)}</dc:date>
` : "";
    let _modifiedAt = modifiedAt ? `<meta property="dcterms:modified">${getISOString(modifiedAt)}</meta>
` : "";
    let _tags = tags ? tags.map((e3) => `<dc:subject>${e3}</dc:subject>
`) : "";
    let _meta = "";
    _meta += cover ? `<meta name="cover" content="${coverId}"/>
` : "";
    _meta += title ? `<meta refines="#title" property="title-type">main</meta>
` : "";
    _meta += title ? `<meta refines="#title" property="file-as">${title}</meta>
` : "";
    _meta += authors.map(
      (e3, i) => `<meta refines="#author-${i}" property="role" scheme="marc:relators">aut</meta>
<meta refines="#author-${i}" property="file-as">${e3}</meta>
`
    ).join("");
    _meta += renditionLayout ? `<meta property="rendition:layout">${renditionLayout}</meta>
` : "";
    _meta += renditionOrientation ? `<meta property="rendition:orientation">${renditionOrientation}</meta>
` : "";
    _meta += renditionSpread ? `<meta property="rendition:spread">${renditionSpread}</meta>
` : "";
    _meta += renditionFlow ? `<meta property="rendition:flow">${renditionFlow}</meta>
` : "";
    return `
${_id}${_title}${_authors}${_publisher}${_category}${_language}${_tags}${_publishedAt}${_modifiedAt}${_meta}`;
  }
  function createManifest(arr) {
    return arr.reduce((prev, { id: id2, href, mediaType, properties }) => {
      id2 = id2 ? ` id="${id2}"` : "";
      href = href ? ` href="${href}"` : "";
      mediaType = mediaType ? ` media-type="${mediaType}"` : "";
      properties = properties && properties.trim() !== "" ? ` properties="${properties}"` : "";
      return prev + `<item${id2}${href}${mediaType}${properties} />
`;
    }, "\n");
  }
  function createSpine(arr) {
    return arr.reduce((prev, { id: id2, linear, properties }) => {
      id2 = id2 ? ` idref="${id2}"` : "";
      linear = linear ? "" : ` linear=no`;
      properties = properties && properties.trim() !== "" ? ` properties="${properties}"` : "";
      return prev + `<itemref${id2}${linear}${properties} />
`;
    }, "\n");
  }
  const metadata = createMetadata(this.__data__);
  const metadataProperties = {
    "xmlns:dc": "http://purl.org/dc/elements/1.1/"
    // fix calibre
  };
  const manifest = createManifest(
    this.__files__.filter((e3) => e3.manifest).map((e3) => e3.manifest)
  );
  const manifestProperties = {};
  const spine = createSpine(
    this.__files__.filter((e3) => e3.spine).map((e3) => e3.spine)
  );
  const spineProperties = {
    toc: this.__data__.enableNCX ? "ncx" : null,
    // legacy, EPUB 2 compatibility
    "page-progression-direction": this.__data__.pageDirection
    // flow direction
  };
  const data = `
<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${this.__data__.language}" dir="${this.__data__.textDirection}">
<metadata${renderProps(metadataProperties)}>${metadata}</metadata>
<manifest${renderProps(manifestProperties)}>${manifest}</manifest>
<spine${renderProps(spineProperties)}>${spine}</spine>
</package>
  `;
  this.setFile({
    path: this.__data__.packagePath,
    data: data.trim()
  });
};
EPUB.prototype.id = function(str) {
  this.__data__.id = str;
  return this;
};
EPUB.prototype.title = function(str) {
  this.__data__.title = str || DEFAULT_TITLE;
  this.isTitleChanged = true;
  return this;
};
EPUB.prototype.author = function(str) {
  if (!this.isAuthorChanged) {
    this.__data__.authors = [str || DEFAULT_AUTHOR];
  } else {
    this.__data__.authors.push(str || DEFAULT_AUTHOR);
  }
  this.isAuthorChanged = true;
  return this;
};
EPUB.prototype.publisher = function(str) {
  this.__data__.publisher = str;
  return this;
};
EPUB.prototype.category = function(str) {
  this.__data__.category = str;
  return this;
};
EPUB.prototype.language = function(str) {
  this.__data__.language = str;
  return this;
};
EPUB.prototype.textDirection = function(str) {
  this.__data__.textDirection = str || "auto";
  return this;
};
EPUB.prototype.pageDirection = function(str) {
  this.__data__.pageDirection = str || null;
  return this;
};
EPUB.prototype.layout = function(str) {
  this.__data__.renditionLayout = str || null;
  return this;
};
EPUB.prototype.orientation = function(str) {
  this.__data__.renditionOrientation = str || null;
  return this;
};
EPUB.prototype.spread = function(str) {
  this.__data__.renditionSpread = str || null;
  return this;
};
EPUB.prototype.flow = function(str) {
  this.__data__.renditionFlow = str || null;
  return this;
};
EPUB.prototype.cover = function(base642) {
  this.__data__.cover = base642;
  return this;
};
EPUB.prototype.tag = function(str) {
  this.__data__.tags.push(str);
  return this;
};
EPUB.prototype.style = function(str, properties) {
  if (!properties) {
    properties = {};
  }
  const id2 = util_default.id();
  properties.rel = properties.rel || "stylesheet";
  properties.type = properties.type || "text/css";
  properties.href = getRelativePath(`EPUB/${id2}.css`);
  this.__data__.style += `
<link${renderProps(properties)} />`;
  this.setFile({
    path: `EPUB/${id2}.css`,
    data: str,
    manifest: {
      id: id2,
      href: getRelativePath(`EPUB/${id2}.css`),
      mediaType: "text/css"
    }
  });
  return this;
};
EPUB.prototype.publishedAt = function(date2) {
  this.__data__.publishedAt = date2;
  return this;
};
EPUB.prototype.modifiedAt = function(date2) {
  this.__data__.modifiedAt = date2;
  return this;
};
EPUB.prototype.add = function() {
  let self = this, _id = util_default.id(), _path = `EPUB/${_id}.xhtml`, _title = DEFAULT_CHAPTER_TITLE, _language = this.__data__.language, _textDirection = this.__data__.textDirection, _body = "", _head = "", _style = "", _renditionLayout = null, _renditionOrientation = null, _renditionSpread = null, _renditionSpreadPlacement = null, _renditionFlow = null, _landmarks = [], _toc = [], _files = [];
  const pipe = {
    /**
     *
     * @returns
     */
    getId: function() {
      return _id;
    },
    /**
     *
     * @returns
     */
    getPath: function() {
      return getRelativePath(_path);
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @param {string} elementId optional, without #
     * @returns
     */
    getLink: function(str, properties, elementId) {
      delete properties.href;
      return `<a href="${getRelativePath(_path + (elementId ? "#" + elementId : ""))}"${renderProps(properties)}>${str}</a>`;
    },
    /**
     *
     * @returns
     */
    getStyle: function() {
      return _style;
    },
    /**
     *
     * @returns
     */
    getData: function() {
      return `
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${_language}" lang="${_language}" dir="${_textDirection}" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
<meta charset="utf-8"></meta>
<title>${_title}</title>${_head}${self.__data__.style}${_style}
</head>
<body>${_body}
</body>
</html>
      `.trim();
    },
    /**
     *
     * @param {string} str
     * @returns
     */
    title: function(str) {
      _title = str || DEFAULT_CHAPTER_TITLE;
      return pipe;
    },
    /**
     *
     * @param {string} str en, ko, ja...
     * @returns
     */
    language: function(str) {
      _language = str;
      return pipe;
    },
    /**
     *
     * @param {string} str auto, ltr, rtl
     * @returns
     */
    textDirection: function(str) {
      _textDirection = str;
      return pipe;
    },
    /**
     *
     * @param {string} str reflowable, pre-paginated
     */
    layout: function(str) {
      _renditionLayout = str ? `rendition:layout-${str}` : null;
    },
    /**
     *
     * @param {string} str auto, landscape, portrait
     */
    orientation: function(str) {
      _renditionOrientation = str ? `rendition:orientation-${str}` : null;
    },
    /**
     *
     * @param {string} str auto, both, landscape, none
     */
    spread: function(str) {
      _renditionSpread = str ? `rendition:spread-${str}` : null;
    },
    /**
     *
     * @param {string} str center, left, right
     */
    spreadPlacement: function(str) {
      _renditionSpreadPlacement = str ? `rendition:page-spread-${str}` : null;
    },
    /**
     *
     * @param {string} str auto, paginated, scrolled-continuous, scrolled-doc
     */
    flow: function(str) {
      _renditionFlow = str ? `rendition:flow-${str}` : null;
    },
    /**
     *
     * @param {string} str
     * @returns
     */
    head: function(str) {
      _head += "\n" + str;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { rel, type, title, class, media... }
     * @returns
     */
    style: function(str, properties) {
      if (!properties) {
        properties = {};
      }
      const id2 = util_default.id();
      properties.rel = properties.rel || "stylesheet";
      properties.type = properties.type || "text/css";
      properties.href = getRelativePath(`EPUB/${id2}.css`);
      _style += `
<link${renderProps(properties)} />`;
      _files.push({
        path: `EPUB/${id2}.css`,
        data: str,
        manifest: {
          id: id2,
          href: getRelativePath(`EPUB/${id2}.css`),
          mediaType: "text/css"
        }
      });
      return pipe;
    },
    /**
     *
     * @param {string} str <p>Line...</p>
     * @returns
     */
    body: function(str) {
      _body += "\n" + str;
      return pipe;
    },
    /**
     *
     * @param {boolean} type open, close
     * @param {object} properties { id, class... }
     * @returns
     */
    section: function(type, properties) {
      _body += type ? `
<section${renderProps(properties)}>` : `
</section>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h1: function(str, properties) {
      _body += `
<h1${renderProps(properties)}>${str}</h1>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h2: function(str, properties) {
      _body += `
<h2${renderProps(properties)}>${str}</h2>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h3: function(str, properties) {
      _body += `
<h3${renderProps(properties)}>${str}</h3>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h4: function(str, properties) {
      _body += `
<h4${renderProps(properties)}>${str}</h4>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h5: function(str, properties) {
      _body += `
<h5${renderProps(properties)}>${str}</h5>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    h6: function(str, properties) {
      _body += `
<h6${renderProps(properties)}>${str}</h6>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    p: function(str, properties) {
      _body += `
<p${renderProps(properties)}>${str}</p>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    span: function(str, properties) {
      _body += `
<span${renderProps(properties)}>${str}</span>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class, href... }
     * @returns
     */
    a: function(str, properties) {
      _body += `
<a${renderProps(properties)}>${str}</a>`;
      return pipe;
    },
    /**
     *
     * @param {boolean} type open, close
     * @param {object} properties { id, class... }
     * @returns
     */
    ol: function(type, properties) {
      _body += type ? `
<ol${renderProps(properties)}>` : `</ol>`;
      return pipe;
    },
    /**
     *
     * @param {boolean} type open, close
     * @param {object} properties { id, class... }
     * @returns
     */
    ul: function(type, properties) {
      _body += type ? `
<ul${renderProps(properties)}>` : `</ul>`;
      return pipe;
    },
    /**
     *
     * @param {string} str
     * @param {object} properties { id, class... }
     * @returns
     */
    li: function(str, properties) {
      _body += `
<li${renderProps(properties)}>${str}</li>`;
      return pipe;
    },
    /**
     *
     * @param {string} base64 image/jpeg type has been allowed type without base64 header.
     * @param {object} properties { id, class... }
     * @returns
     */
    img: function(base642, properties) {
      if (!properties) {
        properties = {};
      }
      const id2 = util_default.id();
      const mime = getMimetypeFromBase64(base642) || "image/jpeg";
      const ext = getExtensionFromMimetype(mime) || ".jpg";
      const path = `EPUB/${id2}${ext}`;
      properties.src = getRelativePath(path);
      _files.push({
        path,
        data: removeHeaderFromBase64(base642),
        encoding: "base64",
        manifest: {
          id: id2,
          href: getRelativePath(path),
          mediaType: mime
        }
      });
      _body += `
<img${renderProps(properties)} />`;
      return pipe;
    },
    /**
     *
     * @param {string} base64 default audio/mpeg, .mp3
     * @param {object} properties { id, class, controls... }
     * @returns
     */
    audio: function(base642, properties) {
      if (!properties) {
        properties = {};
      }
      const id2 = util_default.id();
      const mime = getMimetypeFromBase64(base642) || "audio/mpeg";
      const ext = getExtensionFromMimetype(mime) || ".mp3";
      const path = `EPUB/${id2}${ext}`;
      let sourceProperties = {
        src: getRelativePath(path),
        type: mime
      };
      _files.push({
        path,
        data: removeHeaderFromBase64(base642),
        encoding: "base64",
        manifest: {
          id: id2,
          href: getRelativePath(path),
          mediaType: mime
        }
      });
      _body += `
<audio${renderProps(properties)}>
<source${renderProps(sourceProperties)} />
</audio>`;
      return pipe;
    },
    /**
     *
     * @param {string} base64 default video/mpeg, .mp4
     * @param {object} properties { id, class, controls, width, height, poster... }
     * @returns
     */
    video: function(base642, properties) {
      if (!properties) {
        properties = {};
      }
      const id2 = util_default.id();
      const mime = getMimetypeFromBase64(base642) || "video/mp4";
      const ext = getExtensionFromMimetype(mime) || ".mp4";
      const path = `EPUB/${id2}${ext}`;
      let sourceProperties = {
        src: getRelativePath(path),
        type: mime
      };
      _files.push({
        path,
        data: removeHeaderFromBase64(base642),
        encoding: "base64",
        manifest: {
          id: id2,
          href: getRelativePath(path),
          mediaType: mime
        }
      });
      _body += `
<video${renderProps(properties)}>
<source${renderProps(sourceProperties)} />
</video>`;
      return pipe;
    },
    /**
     *
     * @returns
     */
    br: function() {
      _body += `
<br />`;
      return pipe;
    },
    /**
     *
     * @param {string} title optional
     * @param {string} elementId optional
     * @returns
     */
    nav: function(title, elementId) {
      _toc.push({
        title: title || _title,
        href: getRelativePath(`${_path}${elementId ? "#" + elementId : ""}`)
      });
      return pipe;
    },
    /**
     *
     * @param {string} title optional
     * @param {string} elementId optional, without #
     * @param {string} epubType optional, default "bodymetter"
     * @returns
     */
    landmark: function(title, elementId, epubType) {
      _landmarks.push({
        href: getRelativePath(`${_path}${elementId ? "#" + elementId : ""}`),
        title: title || _title,
        epubType: epubType || "bodymatter"
      });
      return pipe;
    },
    /**
     *
     * @returns
     */
    valueOf: function() {
      return {
        path: _path,
        data: pipe.getData(),
        manifest: {
          id: _id,
          href: getRelativePath(_path),
          mediaType: "application/xhtml+xml"
        },
        spine: {
          id: _id,
          linear: true,
          properties: [
            _renditionLayout,
            _renditionOrientation,
            _renditionSpread,
            _renditionSpreadPlacement,
            _renditionFlow
          ].filter((e3) => e3).join(" ")
        },
        toc: _toc,
        landmarks: _landmarks
      };
    },
    /**
     *
     * @returns
     */
    exec: function() {
      self.setFile(pipe.valueOf());
      for (const file of _files) {
        self.setFile(file);
      }
      return pipe;
    }
  };
  return pipe;
};
EPUB.prototype.getCoverPath = function() {
  return getRelativePath(this.__data__.coverPath);
};
EPUB.prototype.getNavPath = function() {
  return getRelativePath(this.__data__.navPath);
};
EPUB.prototype.getFilePath = function(id2) {
  const file = this.__files__.find(
    (e3) => e3.path === `EPUB/${id2}.xhtml` || e3.path === id2
  );
  return file ? getRelativePath(file.path) : null;
};
EPUB.prototype.toZip = async function(type) {
  this.update();
  const zip = new jszip_min_default();
  for (const file of this.__files__) {
    zip.file(file.path, file.data, { base64: file.encoding === "base64" });
  }
  return await zip.generateAsync({ type: type || "base64" });
};
EPUB.prototype.toArray = function() {
  this.update();
  return this.__files__.map((e3) => {
    return {
      path: e3.path,
      data: e3.data,
      encoding: e3.encoding || "utf8"
    };
  });
};
export {
  EPUB
};
