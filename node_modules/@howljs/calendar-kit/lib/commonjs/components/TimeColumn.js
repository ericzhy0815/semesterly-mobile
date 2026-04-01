"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../constants");
var _BodyContext = require("../context/BodyContext");
var _ThemeProvider = require("../context/ThemeProvider");
var _Text = _interopRequireDefault(require("./Text"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const selectTimeColumnTheme = state => ({
  cellBorderColor: state.hourBorderColor ?? state.colors.border,
  hourTextColor: state.colors.onBackground,
  hourTextStyle: state.hourTextStyle,
  hourBackgroundColor: state.hourBackgroundColor || state.colors.background
});
const TimeColumn = () => {
  const {
    hours,
    maxTimelineHeight,
    spaceFromTop,
    spaceFromBottom,
    timelineHeight,
    renderHour,
    hourWidth,
    showTimeColumnRightLine
  } = (0, _BodyContext.useBody)();
  const {
    cellBorderColor,
    hourTextColor,
    hourTextStyle,
    hourBackgroundColor
  } = (0, _ThemeProvider.useTheme)(selectTimeColumnTheme);
  const fontSize = (hourTextStyle === null || hourTextStyle === void 0 ? void 0 : hourTextStyle.fontSize) ?? 10;
  const style = (0, _react.useMemo)(() => _reactNative.StyleSheet.flatten([styles.hourText, {
    top: -fontSize / 2,
    color: hourTextColor
  }, hourTextStyle]), [fontSize, hourTextColor, hourTextStyle]);
  const totalSlots = hours.length;
  const _renderHour = (0, _react.useCallback)((hour, index) => {
    let children;
    if (renderHour) {
      children = renderHour({
        hourStr: hour.time,
        minutes: hour.slot,
        style
      });
    } else {
      children = /*#__PURE__*/_react.default.createElement(_Text.default, {
        style: style
      }, hour.time);
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: hour.slot,
      style: [styles.absolute, {
        top: `${index / totalSlots * 100}%`,
        width: '100%'
      }]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.absolute, styles.hour, {
        right: _constants.HOUR_SHORT_LINE_WIDTH + 8
      }]
    }, children), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.absolute, styles.shortLine, {
        backgroundColor: cellBorderColor,
        width: _constants.HOUR_SHORT_LINE_WIDTH
      }]
    }));
  }, [cellBorderColor, renderHour, style, totalSlots]);
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: timelineHeight.value - spaceFromTop - spaceFromBottom
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, styles.absolute, {
      height: maxTimelineHeight + _constants.EXTRA_HEIGHT * 2,
      width: hourWidth,
      backgroundColor: hourBackgroundColor
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.absolute, {
      width: hourWidth,
      top: _constants.EXTRA_HEIGHT + spaceFromTop
    }, animView]
  }, hours.map(_renderHour)), showTimeColumnRightLine && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.rightLine, {
      backgroundColor: cellBorderColor
    }]
  }));
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(TimeColumn);
const styles = _reactNative.StyleSheet.create({
  container: {
    zIndex: 998,
    elevation: -1
  },
  absolute: {
    position: 'absolute'
  },
  rightLine: {
    position: 'absolute',
    width: 1,
    right: 0,
    height: '100%'
  },
  hour: {
    left: 0
  },
  shortLine: {
    height: 1,
    right: 0
  },
  hourText: {
    fontSize: 10,
    textAlign: 'right',
    position: 'absolute',
    left: 0,
    right: 0
  }
});
//# sourceMappingURL=TimeColumn.js.map