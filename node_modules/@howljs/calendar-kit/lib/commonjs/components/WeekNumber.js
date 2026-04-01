"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _ThemeProvider = require("../context/ThemeProvider");
var _dateUtils = require("../utils/dateUtils");
var _Text = _interopRequireDefault(require("./Text"));
var _TimeZoneProvider = require("../context/TimeZoneProvider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const WeekNumber = ({
  date
}) => {
  const {
    timeZone
  } = (0, _TimeZoneProvider.useTimezone)();
  const theme = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => ({
    weekNumberBackgroundColor: state.colors.surface,
    weekNumber: state.weekNumber,
    weekNumberContainer: state.weekNumberContainer
  }), []));
  const [value, setValue] = (0, _react.useState)('');
  const _getWeekNumber = newValue => {
    setValue((0, _dateUtils.getWeekNumberOfYear)(newValue, timeZone));
  };
  (0, _reactNativeReanimated.useAnimatedReaction)(() => date.value, (newValue, prevValue) => {
    if (newValue !== prevValue) {
      (0, _reactNativeReanimated.runOnJS)(_getWeekNumber)(newValue);
    }
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      backgroundColor: theme.weekNumberBackgroundColor
    }, theme.weekNumberContainer]
  }, /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [styles.text, theme.weekNumber]
  }, value));
};
var _default = exports.default = WeekNumber;
const styles = _reactNative.StyleSheet.create({
  container: {
    backgroundColor: '#DADADA',
    marginHorizontal: 8,
    borderRadius: 4,
    marginTop: 8
  },
  text: {
    fontSize: 12,
    textAlign: 'center'
  }
});
//# sourceMappingURL=WeekNumber.js.map