"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _LoadingContext = require("../../context/LoadingContext");
var _ThemeProvider = require("../../context/ThemeProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const DEVICE_WIDTH = _reactNative.Dimensions.get('window').width;
const DURATION = 2000;
const BAR_HEIGHT = 3;
const ProgressBarInner = () => {
  const barColor = (0, _ThemeProvider.useTheme)(state => state.colors.primary);
  const sv = (0, _reactNativeReanimated.useSharedValue)(0);
  (0, _react.useEffect)(() => {
    sv.value = (0, _reactNativeReanimated.withRepeat)((0, _reactNativeReanimated.withTiming)(1, {
      duration: DURATION
    }), -1);
  }, [sv]);
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const translateX = (0, _reactNativeReanimated.interpolate)(sv.value, [0, 1], [-DEVICE_WIDTH, DEVICE_WIDTH]);
    return {
      transform: [{
        translateX
      }]
    };
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.progressBar, {
      height: BAR_HEIGHT
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.bgLoading, {
      backgroundColor: barColor,
      height: BAR_HEIGHT
    }]
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: animatedStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.loadingBar, {
      backgroundColor: barColor,
      height: BAR_HEIGHT
    }]
  })));
};
const ProgressBar = () => {
  const isLoading = (0, _LoadingContext.useLoading)();
  if (!isLoading) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(ProgressBarInner, null);
};
var _default = exports.default = ProgressBar;
const styles = _reactNative.StyleSheet.create({
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  },
  bgLoading: {
    position: 'absolute',
    width: '100%',
    opacity: 0.3
  },
  loadingBar: {
    width: '100%'
  }
});
//# sourceMappingURL=ProgressBar.js.map