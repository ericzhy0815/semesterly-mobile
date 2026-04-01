"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DraggingEvent = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _BodyContext = require("../context/BodyContext");
var _DragEventProvider = require("../context/DragEventProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _utils = require("../utils/utils");
var _DragDot = _interopRequireDefault(require("./DragDot"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const DraggingEvent = ({
  renderEvent,
  TopEdgeComponent,
  BottomEdgeComponent,
  containerStyle,
  resources
}) => {
  const theme = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => {
    return {
      primaryColor: state.colors.primary,
      eventContainerStyle: state.eventContainerStyle,
      eventTitleStyle: state.eventTitleStyle
    };
  }, []));
  const {
    minuteHeight,
    columnWidth,
    start,
    hourWidth,
    visibleDateUnixAnim,
    calendarData,
    columns,
    numberOfDays,
    dragToCreateMode,
    enableResourceScroll,
    resourcePerPage
  } = (0, _BodyContext.useBody)();
  const {
    dragDuration,
    dragStartMinutes,
    dragStartUnix,
    draggingEvent,
    dragX,
    selectedEvent
  } = (0, _DragEventProvider.useDragEvent)();
  const isCreate = !selectedEvent;
  const isShowDot = dragToCreateMode !== 'date-time' && isCreate || !isCreate;
  const totalResources = resources && resources.length > 1 ? resources.length : 1;
  const getDayIndex = dayUnix => {
    'worklet';

    let currentIndex = calendarData.visibleDatesArray.indexOf(dayUnix);
    if (currentIndex === -1) {
      var _calendarData$visible;
      const nearestVisibleUnix = (0, _utils.findNearestNumber)(calendarData.visibleDatesArray, dayUnix);
      const nearestVisibleIndex = (_calendarData$visible = calendarData.visibleDates[nearestVisibleUnix]) === null || _calendarData$visible === void 0 ? void 0 : _calendarData$visible.index;
      if (!nearestVisibleIndex) {
        return 0;
      }
      currentIndex = nearestVisibleIndex;
    }
    let startIndex = calendarData.visibleDatesArray.indexOf(visibleDateUnixAnim.value);
    if (startIndex === -1) {
      var _calendarData$visible2;
      const nearestVisibleUnix = (0, _utils.findNearestNumber)(calendarData.visibleDatesArray, dayUnix);
      const nearestVisibleIndex = (_calendarData$visible2 = calendarData.visibleDates[nearestVisibleUnix]) === null || _calendarData$visible2 === void 0 ? void 0 : _calendarData$visible2.index;
      if (!nearestVisibleIndex) {
        return 0;
      }
      startIndex = nearestVisibleIndex;
    }
    return (0, _utils.clampValues)(currentIndex - startIndex, 0, columns - 1);
  };
  const eventWidth = columnWidth / (enableResourceScroll ? resourcePerPage : totalResources);
  const eventWidthAnim = (0, _reactNativeReanimated.useDerivedValue)(() => eventWidth, [eventWidth]);
  const resourceIndex = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (totalResources === 1) {
      return 0;
    }
    const xWithoutHourWidth = dragX.value - hourWidth;
    const columnIndex = Math.floor(xWithoutHourWidth / eventWidth);
    return (0, _utils.clampValues)(columnIndex, 0, totalResources - 1);
  }, [totalResources, hourWidth]);
  const internalDayIndex = (0, _reactNativeReanimated.useSharedValue)(getDayIndex(dragStartUnix.value));
  (0, _reactNativeReanimated.useAnimatedReaction)(() => dragStartUnix.value, dayUnix => {
    if (dayUnix !== -1) {
      const dayIndex = getDayIndex(dayUnix);
      internalDayIndex.value = (0, _reactNativeReanimated.withTiming)(dayIndex, {
        duration: 100
      });
    }
  });
  const eventHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return dragDuration.value * minuteHeight.value;
  });
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    const startX = resourceIndex.value * eventWidth;
    const dIndex = enableResourceScroll ? 0 : internalDayIndex.value;
    return {
      top: (dragStartMinutes.value - start) * minuteHeight.value,
      height: dragDuration.value * minuteHeight.value,
      left: startX + hourWidth + eventWidth * dIndex - 1
    };
  }, [totalResources, hourWidth]);
  const renderTopEdgeComponent = () => {
    if (!isShowDot) {
      return null;
    }
    if (TopEdgeComponent) {
      return TopEdgeComponent;
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.dot, styles.dotLeft, numberOfDays === 1 && styles.dotLeftSingle]
    }, /*#__PURE__*/_react.default.createElement(_DragDot.default, null));
  };
  const renderBottomEdgeComponent = () => {
    if (!isShowDot) {
      return null;
    }
    if (BottomEdgeComponent) {
      return BottomEdgeComponent;
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.dot, styles.dotRight, numberOfDays === 1 && styles.dotRightSingle]
    }, /*#__PURE__*/_react.default.createElement(_DragDot.default, null));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, {
      width: eventWidth
    }, animView]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_reactNative.StyleSheet.absoluteFill, theme.eventContainerStyle, styles.event, {
      backgroundColor: (draggingEvent === null || draggingEvent === void 0 ? void 0 : draggingEvent.color) ?? 'transparent',
      borderColor: theme.primaryColor
    }, containerStyle]
  }, renderEvent ? renderEvent(draggingEvent, {
    width: eventWidthAnim,
    height: eventHeight
  }) : !!(draggingEvent !== null && draggingEvent !== void 0 && draggingEvent.title) && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.eventTitle, theme.eventTitleStyle]
  }, draggingEvent.title)), isShowDot && renderTopEdgeComponent(), isShowDot && renderBottomEdgeComponent());
};
exports.DraggingEvent = DraggingEvent;
const DraggingEventWrapper = ({
  renderDraggingEvent,
  renderEvent,
  resources
}) => {
  const {
    isDragging
  } = (0, _DragEventProvider.useDragEvent)();
  if (!isDragging) {
    return null;
  }
  if (renderDraggingEvent) {
    return renderDraggingEvent({
      renderEvent,
      resources
    });
  }
  return /*#__PURE__*/_react.default.createElement(DraggingEvent, {
    renderEvent: renderEvent,
    resources: resources
  });
};
var _default = exports.default = DraggingEventWrapper;
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'absolute'
  },
  dot: {
    position: 'absolute',
    borderRadius: 12,
    width: 24,
    height: 24
  },
  event: {
    borderWidth: 3,
    borderRadius: 4,
    overflow: 'hidden'
  },
  dotLeft: {
    top: -12,
    left: -12
  },
  dotRight: {
    bottom: -12,
    right: -12
  },
  eventTitle: {
    fontSize: 12,
    paddingHorizontal: 2
  },
  dotLeftSingle: {
    left: 0
  },
  dotRightSingle: {
    right: 0
  }
});
//# sourceMappingURL=DraggingEvent.js.map