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
var _DraggableEvent = _interopRequireDefault(require("./DraggableEvent"));
var _Events = _interopRequireDefault(require("./Events"));
var _Overlay = _interopRequireDefault(require("./Loading/Overlay"));
var _NowIndicator = _interopRequireDefault(require("./NowIndicator"));
var _TimelineBoard = _interopRequireDefault(require("./TimelineBoard"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BodyItem = ({
  pageIndex,
  startUnix,
  renderDraggableEvent,
  resources
}) => {
  const {
    spaceFromTop,
    timelineHeight,
    spaceFromBottom,
    hourWidth,
    numberOfDays,
    calendarData,
    columns
  } = (0, _BodyContext.useBody)();
  const visibleDates = (0, _react.useMemo)(() => {
    const data = {};
    let diffDays = 1;
    for (let i = 0; i < columns; i++) {
      const currentUnix = calendarData.visibleDatesArray[pageIndex + i];
      if (currentUnix) {
        data[currentUnix] = {
          unix: currentUnix,
          diffDays
        };
        diffDays += 1;
      }
    }
    return data;
  }, [calendarData.visibleDatesArray, columns, pageIndex]);
  const leftSpacing = numberOfDays === 1 ? hourWidth : 0;
  const height = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return timelineHeight.value - spaceFromTop - spaceFromBottom;
  }, [spaceFromTop, spaceFromBottom]);
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: height.value
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_TimelineBoard.default, {
    pageIndex: pageIndex,
    dateUnix: startUnix,
    visibleDates: visibleDates,
    resources: resources
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    pointerEvents: "box-none",
    style: [styles.content, {
      left: resources ? 0 : Math.max(0, leftSpacing - 1),
      top: _constants.EXTRA_HEIGHT + spaceFromTop
    }, animView]
  }, /*#__PURE__*/_react.default.createElement(_Events.default, {
    startUnix: startUnix,
    visibleDates: visibleDates,
    resources: resources
  }), /*#__PURE__*/_react.default.createElement(_NowIndicator.default, {
    visibleDates: visibleDates
  }), /*#__PURE__*/_react.default.createElement(_DraggableEvent.default, {
    startUnix: startUnix,
    visibleDates: visibleDates,
    renderDraggableEvent: renderDraggableEvent,
    resources: resources
  })), /*#__PURE__*/_react.default.createElement(_Overlay.default, null));
};
var _default = exports.default = BodyItem;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    position: 'absolute',
    width: '100%'
  }
});
//# sourceMappingURL=BodyItem.js.map