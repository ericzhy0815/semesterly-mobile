"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../../constants");
var _ActionsProvider = require("../../context/ActionsProvider");
var _BodyContext = require("../../context/BodyContext");
var _DragEventProvider = require("../../context/DragEventProvider");
var _ThemeProvider = require("../../context/ThemeProvider");
var _TimeZoneProvider = require("../../context/TimeZoneProvider");
var _dateUtils = require("../../utils/dateUtils");
var _HorizontalLine = _interopRequireDefault(require("../TimelineBoard/HorizontalLine"));
var _VerticalLine = _interopRequireDefault(require("../TimelineBoard/VerticalLine"));
var _Touchable = _interopRequireDefault(require("../Touchable"));
var _UnavailableHoursByResource = _interopRequireDefault(require("./UnavailableHoursByResource"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResourceBoard = ({
  resources
}) => {
  const colors = (0, _ThemeProvider.useTheme)(state => state.colors);
  const {
    spaceFromTop,
    totalSlots,
    columnWidth,
    minuteHeight,
    renderCustomHorizontalLine,
    visibleDateUnixAnim,
    start,
    resourcePerPage,
    spaceFromBottom,
    timelineHeight
  } = (0, _BodyContext.useBody)();
  const {
    timeZone
  } = (0, _TimeZoneProvider.useTimezone)();
  const {
    onPressBackground,
    onLongPressBackground
  } = (0, _ActionsProvider.useActions)();
  const {
    triggerDragCreateEvent
  } = (0, _DragEventProvider.useDragEventActions)();
  const contentView = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: timelineHeight.value - spaceFromTop - spaceFromBottom
  }));
  const onPress = event => {
    const dayUnix = visibleDateUnixAnim.value;
    const minutes = event.nativeEvent.locationY / minuteHeight.value + start;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const baseDateTime = (0, _dateUtils.parseDateTime)(dayUnix).set({
      hour,
      minute
    });
    const dateObj = (0, _dateUtils.forceUpdateZone)(baseDateTime, timeZone);
    const newProps = {
      dateTime: (0, _dateUtils.dateTimeToISOString)(dateObj)
    };
    if (resources) {
      var _resources$resourceId;
      const colWidth = columnWidth / resourcePerPage;
      const resourceIdx = Math.floor(event.nativeEvent.locationX / colWidth);
      newProps.resourceId = (_resources$resourceId = resources[resourceIdx]) === null || _resources$resourceId === void 0 ? void 0 : _resources$resourceId.id;
    }
    onPressBackground === null || onPressBackground === void 0 || onPressBackground(newProps, event);
  };
  const onLongPress = event => {
    const dayUnix = visibleDateUnixAnim.value;
    const minutes = event.nativeEvent.locationY / minuteHeight.value + start;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const baseDateTime = (0, _dateUtils.parseDateTime)(dayUnix).set({
      hour,
      minute
    });
    const dateObj = (0, _dateUtils.forceUpdateZone)(baseDateTime, timeZone);
    const dateString = (0, _dateUtils.dateTimeToISOString)(dateObj);
    const newProps = {
      dateTime: dateString
    };
    if (resources) {
      var _resources$resourceId2;
      const colWidth = columnWidth / resourcePerPage;
      const resourceIdx = Math.floor(event.nativeEvent.locationX / colWidth);
      newProps.resourceId = (_resources$resourceId2 = resources[resourceIdx]) === null || _resources$resourceId2 === void 0 ? void 0 : _resources$resourceId2.id;
    }
    onLongPressBackground === null || onLongPressBackground === void 0 || onLongPressBackground(newProps, event);
    if (triggerDragCreateEvent) {
      triggerDragCreateEvent === null || triggerDragCreateEvent === void 0 || triggerDragCreateEvent(newProps, event);
    }
  };
  const _renderVerticalLines = (0, _react.useMemo)(() => {
    const lines = [];
    for (let i = 0; i <= resources.length; i++) {
      lines.push(/*#__PURE__*/_react.default.createElement(_VerticalLine.default, {
        key: i,
        borderColor: colors.border,
        index: i,
        columnWidth: columnWidth,
        childColumns: resourcePerPage
      }));
    }
    return lines;
  }, [resources.length, colors.border, columnWidth, resourcePerPage]);
  const _renderHorizontalLines = (0, _react.useMemo)(() => {
    const rows = [];
    for (let i = 0; i < totalSlots; i++) {
      rows.push(/*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
        key: i,
        borderColor: colors.border,
        index: i,
        totalSlots: totalSlots,
        renderCustomHorizontalLine: renderCustomHorizontalLine
      }));
      rows.push(/*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
        key: `${i}.5`,
        borderColor: colors.border,
        index: i + 0.5,
        totalSlots: totalSlots,
        renderCustomHorizontalLine: renderCustomHorizontalLine
      }));
    }
    rows.push(/*#__PURE__*/_react.default.createElement(_HorizontalLine.default, {
      key: totalSlots,
      borderColor: colors.border,
      index: totalSlots,
      totalSlots: totalSlots,
      renderCustomHorizontalLine: renderCustomHorizontalLine
    }));
    return rows;
  }, [totalSlots, colors.border, renderCustomHorizontalLine]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.calendarGrid, {
      marginTop: _constants.EXTRA_HEIGHT + spaceFromTop
    }, contentView]
  }, /*#__PURE__*/_react.default.createElement(_Touchable.default, {
    style: styles.touchable,
    onPress: onPressBackground ? onPress : undefined,
    onLongPress: triggerDragCreateEvent || onLongPressBackground ? onLongPress : undefined,
    disabled: !onPressBackground && !triggerDragCreateEvent && !onLongPressBackground
  }), /*#__PURE__*/_react.default.createElement(_UnavailableHoursByResource.default, {
    resources: resources
  }), _renderHorizontalLines), resources.length > 1 && _renderVerticalLines);
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(ResourceBoard);
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  calendarGrid: {
    width: '100%'
  },
  touchable: {
    flex: 1
  }
});
//# sourceMappingURL=ResourceBoard.js.map