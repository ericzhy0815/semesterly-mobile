"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../constants");
var _BodyContext = require("../context/BodyContext");
var _VisibleDateProvider = require("../context/VisibleDateProvider");
var _Events = _interopRequireDefault(require("./Events"));
var _Overlay = _interopRequireDefault(require("./Loading/Overlay"));
var _ResourceBoard = _interopRequireDefault(require("./Resource/ResourceBoard"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const BodyResourceItem = ({
  resources
}) => {
  const {
    spaceFromTop,
    hourWidth,
    timelineHeight,
    spaceFromBottom
  } = (0, _BodyContext.useBody)();
  const visibleDateUnix = (0, _VisibleDateProvider.useDateChangedListener)();
  const height = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return timelineHeight.value - spaceFromTop - spaceFromBottom;
  }, [spaceFromTop, spaceFromBottom]);
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: height.value
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_ResourceBoard.default, {
    resources: resources
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.content, {
      left: resources ? 0 : Math.max(0, hourWidth - 1),
      top: _constants.EXTRA_HEIGHT + spaceFromTop
    }, animView]
  }, /*#__PURE__*/_react.default.createElement(_Events.default, {
    startUnix: visibleDateUnix,
    visibleDates: {
      [visibleDateUnix]: {
        diffDays: 1,
        unix: visibleDateUnix
      }
    },
    resources: resources
  })), /*#__PURE__*/_react.default.createElement(_Overlay.default, null));
};
var _default = exports.default = BodyResourceItem;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    position: 'absolute',
    width: '100%'
  }
});
//# sourceMappingURL=BodyResourceItem.js.map