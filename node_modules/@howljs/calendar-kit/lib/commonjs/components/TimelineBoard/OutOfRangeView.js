"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _BodyContext = require("../../context/BodyContext");
var _ThemeProvider = require("../../context/ThemeProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const OutOfRangeView = ({
  position,
  diffDays
}) => {
  const {
    columnWidth,
    renderCustomOutOfRange,
    timeIntervalHeight,
    totalSlots
  } = (0, _BodyContext.useBody)();
  const disableBackgroundColor = (0, _ThemeProvider.useTheme)(state => state.outOfRangeBackgroundColor || state.colors.surface);
  const disableHeight = (0, _reactNativeReanimated.useDerivedValue)(() => timeIntervalHeight.value * totalSlots, [totalSlots]);
  const disableWidth = (0, _reactNativeReanimated.useDerivedValue)(() => diffDays * columnWidth, [columnWidth, diffDays]);
  const positionStyle = (0, _react.useMemo)(() => position === 'left' ? {
    left: 0
  } : {
    right: 0
  }, [position]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.outOfRange, positionStyle, {
      backgroundColor: disableBackgroundColor,
      width: diffDays * columnWidth
    }]
  }, renderCustomOutOfRange && renderCustomOutOfRange({
    width: disableWidth,
    height: disableHeight
  }));
};
var _default = exports.default = OutOfRangeView;
const styles = _reactNative.StyleSheet.create({
  outOfRange: {
    position: 'absolute',
    height: '100%'
  }
});
//# sourceMappingURL=OutOfRangeView.js.map