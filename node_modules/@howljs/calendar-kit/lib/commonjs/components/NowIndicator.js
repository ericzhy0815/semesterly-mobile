"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NowIndicatorResource = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _BodyContext = require("../context/BodyContext");
var _NowIndicatorProvider = require("../context/NowIndicatorProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _VisibleDateProvider = require("../context/VisibleDateProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const NowIndicatorInner = ({
  dayIndex,
  currentTime,
  showDot = true,
  width,
  startLeft = 0
}) => {
  const {
    minuteHeight,
    start,
    end,
    startOffset,
    columnWidth,
    NowIndicatorComponent
  } = (0, _BodyContext.useBody)();
  const nowIndicatorColor = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => state.nowIndicatorColor || state.colors.primary, []));
  const opacity = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return currentTime.value >= start && currentTime.value <= end ? 1 : 0;
  }, [start, end]);
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: currentTime.value * minuteHeight.value - startOffset.value,
      opacity: opacity.value
    };
  }, [width]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.container, {
      width: width ?? columnWidth,
      left: dayIndex * columnWidth + startLeft
    }, animView]
  }, NowIndicatorComponent || /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.lineContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.line, {
      backgroundColor: nowIndicatorColor
    }]
  }), showDot && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dot, {
      backgroundColor: nowIndicatorColor
    }]
  })));
};
const NowIndicator = ({
  visibleDates,
  showDot = true
}) => {
  const {
    showNowIndicator
  } = (0, _BodyContext.useBody)();
  const {
    currentDateUnix,
    currentTime
  } = (0, _NowIndicatorProvider.useNowIndicator)();
  const visibleDate = visibleDates[currentDateUnix];
  const isShowNowIndicator = showNowIndicator && visibleDate;
  if (!isShowNowIndicator) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(NowIndicatorInner, {
    currentTime: currentTime,
    dayIndex: visibleDate.diffDays - 1,
    showDot: showDot
  });
};
const NowIndicatorResource = () => {
  const {
    showNowIndicator,
    hourWidth
  } = (0, _BodyContext.useBody)();
  const {
    currentDateUnix,
    currentTime
  } = (0, _NowIndicatorProvider.useNowIndicator)();
  const startUnix = (0, _VisibleDateProvider.useDateChangedListener)();
  const isShowNowIndicator = showNowIndicator && startUnix === currentDateUnix;
  if (!isShowNowIndicator) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(NowIndicatorInner, {
    currentTime: currentTime,
    dayIndex: 0,
    startLeft: hourWidth
  });
};
exports.NowIndicatorResource = NowIndicatorResource;
var _default = exports.default = /*#__PURE__*/_react.default.memo(NowIndicator);
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'absolute'
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007aff',
    width: '100%'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007aff',
    position: 'absolute',
    left: -4
  },
  lineContainer: {
    justifyContent: 'center'
  }
});
//# sourceMappingURL=NowIndicator.js.map