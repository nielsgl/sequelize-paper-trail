'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var Sequelize = require('sequelize');
var diff = require('deep-diff').diff;
var jsdiff = require('diff');
var _ = require('lodash');

exports.default = {
    test: function test() {
        return true;
    },
    calcDelta: function calcDelta(current, next, exclude, strict) {
        var DEBUG = false;
        if (DEBUG) {
            console.log('current', current);
            console.log('next', next);
            console.log('exclude', exclude);
        }

        var di = diff(current, next);

        if (DEBUG) {
            console.log('di', di);

            var diffs2 = di ? di.map(function (i) {
                var str = JSON.stringify(i).replace("\"__data\",", "");
                return JSON.parse(str);
            }) : [];
            console.log('diffs2', diffs2);

            console.log('filter1', diffs2.filter(function (i) {
                return i.path.join(",").indexOf("_") === -1;
            }));

            console.log('filter2', diffs2.filter(function (i) {
                return exclude.every(function (x) {
                    return i.path.indexOf(x) === -1;
                });
            }));
        }

        var diffs = di ? di.map(function (i) {
            var str = JSON.stringify(i).replace("\"__data\",", "");
            return JSON.parse(str);
        }).filter(function (i) {
            // return i.path.join(",").indexOf("_") === -1;
            // console.log('i', i)
            if (!strict && i.kind === 'E') {
                // console.log('str & num', i.lhs == i.rhs)
                // console.log('str & num (strict)', i.lhs === i.rhs)
                if (i.lhs != i.rhs) {
                    return i;
                }
            } else {
                return i;
            }
        }).filter(function (i) {
            // console.log('i', i);
            return exclude.every(function (x) {
                return i.path.indexOf(x) === -1;
            });
        }) : [];
        if (diffs.length > 0) {
            return diffs;
        } else {
            return null;
        }
    },
    capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
    },
    diffToString: function diffToString(val) {
        if (typeof val === "undefined" || val === null) {
            return "";
        } else if (val === true) {
            return "1";
        } else if (val === false) {
            return "0";
        } else if (typeof val === "string") {
            return val;
        } else if (!isNaN(val)) {
            return String(val) + "";
        } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === "object") {
            return JSON.stringify(val) + "";
        } else if (Array.isArray(val)) {
            return JSON.stringify(val) + "";
        }
        return "";
    },
    toUnderscored: function toUnderscored(obj) {
        _.forEach(obj, function (k, v) {
            obj[k] = v.replace(/(?:^|\.?)([A-Z])/g, function (x, y) {
                return "_" + y.toLowerCase();
            }).replace(/^_/, "");
        });
        return obj;
    }
};
module.exports = exports['default'];
