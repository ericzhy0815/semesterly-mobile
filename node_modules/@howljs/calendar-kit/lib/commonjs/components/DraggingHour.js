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
var _DragEventProvider = require("../context/DragEventProvider");
var _LocaleProvider = require("../context/LocaleProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _dateUtils = require("../utils/dateUtils");
var _Text = _interopRequireDefault(require("./Text"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const selectTheme = state => ({
  hourTextColor: state.colors.onBackground,
  hourTextStyle: state.hourTextStyle,
  draggingTextColor: state.colors.primary
});
const DraggingHourInner = ({
  renderHour
}) => {
  const {
    hourTextColor,
    hourTextStyle,
    draggingTextColor
  } = (0, _ThemeProvider.useTheme)(selectTheme);
  const fontSize = (hourTextStyle === null || hourTextStyle === void 0 ? void 0 : hourTextStyle.fontSize) ?? 10;
  const style = _reactNative.StyleSheet.flatten([styles.hourText, {
    color: hourTextColor,
    top: -fontSize / 2
  }, hourTextStyle]);
  const {
    minuteHeight,
    hourFormat,
    start,
    hourWidth,
    numberOfDays
  } = (0, _BodyContext.useBody)();
  const locale = (0, _LocaleProvider.useLocale)();
  const {
    roundedDragStartMinutes,
    roundedDragDuration
  } = (0, _DragEventProvider.useDragEvent)();
  const [startMinutes, setStartMinutes] = (0, _react.useState)(-1);
  const [endMinutes, setEndMinutes] = (0, _react.useState)(-1);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => roundedDragStartMinutes.value, (value, prev) => {
    if (prev !== value) {
      (0, _reactNativeReanimated.runOnJS)(setStartMinutes)(value);
    }
  });
  (0, _reactNativeReanimated.useAnimatedReaction)(() => roundedDragStartMinutes.value + roundedDragDuration.value, (value, prev) => {
    if (prev !== value) {
      (0, _reactNativeReanimated.runOnJS)(setEndMinutes)(value);
    }
  });
  const startAnimStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    top: (roundedDragStartMinutes.value - start) * minuteHeight.value,
    opacity: roundedDragStartMinutes.value === -1 ? 0 : 1
  }));
  const endAnimStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    top: (roundedDragStartMinutes.value + roundedDragDuration.value - start) * minuteHeight.value,
    opacity: roundedDragStartMinutes.value === -1 ? 0 : 1
  }));
  const lineWidth = numberOfDays > 1 ? 0 : 1;
  const startHourStr = (0, _react.useMemo)(() => {
    return startMinutes !== -1 ? (0, _dateUtils.toHourStr)(startMinutes, hourFormat, locale.meridiem) : '';
  }, [startMinutes, hourFormat, locale.meridiem]);
  const endHourStr = (0, _react.useMemo)(() => {
    return endMinutes !== -1 ? (0, _dateUtils.toHourStr)(endMinutes, hourFormat, locale.meridiem) : '';
  }, [endMinutes, hourFormat, locale.meridiem]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.absolute, {
      width: hourWidth - _constants.HOUR_SHORT_LINE_WIDTH - 8 - lineWidth
    }, startAnimStyle]
  }, renderHour ? renderHour({
    hourStr: startHourStr,
    minutes: startMinutes,
    style
  }) : /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [style, {
      color: draggingTextColor
    }]
  }, startHourStr)), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.absolute, {
      width: hourWidth - _constants.HOUR_SHORT_LINE_WIDTH - 8 - lineWidth
    }, endAnimStyle]
  }, renderHour ? renderHour({
    hourStr: endHourStr,
    minutes: endMinutes,
    style
  }) : /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [style, {
      color: draggingTextColor
    }]
  }, endHourStr)));
};
const DraggingHour = ({
  renderHour
}) => {
  const {
    isDragging
  } = (0, _DragEventProvider.useDragEvent)();
  if (!isDragging) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(DraggingHourInner, {
    renderHour: renderHour
  });
};
var _default = exports.default = DraggingHour;
const styles = _reactNative.StyleSheet.create({
  absolute: {
    position: 'absolute'
  },
  hourText: {
    fontSize: 10,
    textAlign: 'right',
    position: 'absolute',
    left: 0,
    right: 0
  }
});
//# sourceMappingURL=DraggingHour.js.map