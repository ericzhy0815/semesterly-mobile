"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceDraggableEvent = exports.DraggableEventResource = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _BodyContext = require("../../context/BodyContext");
var _DragEventProvider = require("../../context/DragEventProvider");
var _ThemeProvider = require("../../context/ThemeProvider");
var _VisibleDateProvider = require("../../context/VisibleDateProvider");
var _DragDot = _interopRequireDefault(require("../DragDot"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResourceDraggableEvent = ({
  renderEvent,
  resources,
  TopEdgeComponent,
  BottomEdgeComponent,
  containerStyle
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
    numberOfDays,
    resourcePerPage
  } = (0, _BodyContext.useBody)();
  const {
    dragStartUnix,
    dragSelectedDuration,
    dragSelectedStartMinutes,
    selectedEvent,
    isDraggingAnim
  } = (0, _DragEventProvider.useDragEvent)();
  const {
    triggerDragSelectedEvent
  } = (0, _DragEventProvider.useDragEventActions)();
  const eventWidth = columnWidth / resourcePerPage;
  const eventWidthAnim = (0, _reactNativeReanimated.useDerivedValue)(() => eventWidth, [eventWidth]);
  const resourceIndex = (0, _react.useMemo)(() => {
    if (!resources) {
      return -1;
    }
    return resources.findIndex(resource => resource.id === (selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId));
  }, [resources, selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId]);
  const top = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return (dragSelectedStartMinutes.value - start) * minuteHeight.value;
  }, [start]);
  const eventHeight = (0, _reactNativeReanimated.useDerivedValue)(() => dragSelectedDuration.value * minuteHeight.value);
  const isDragging = (0, _reactNativeReanimated.useDerivedValue)(() => dragStartUnix.value !== -1);
  const animView = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      top: top.value,
      height: eventHeight.value,
      left: resourceIndex * eventWidth,
      opacity: isDragging.value || top.value === -1 ? 0 : 1
    };
  });
  const gesture = _reactNativeGestureHandler.Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'center',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  const topEdgeGesture = _reactNativeGestureHandler.Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'top',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  const bottomEdgeGesture = _reactNativeGestureHandler.Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'bottom',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, {
      width: eventWidth
    }, animView]
  }, selectedEvent && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_reactNative.StyleSheet.absoluteFill, theme.eventContainerStyle, styles.event, {
      backgroundColor: (selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.color) ?? (_reactNative.Platform.OS === 'android' ? theme.primaryColor : 'transparent'),
      borderColor: theme.primaryColor
    }, containerStyle]
  }, renderEvent ? renderEvent(selectedEvent, {
    width: eventWidthAnim,
    height: eventHeight
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [styles.eventTitle, theme.eventTitleStyle]
  }, selectedEvent.title)), /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [_reactNative.StyleSheet.absoluteFill, {
      cursor: 'pointer'
    }]
  })), /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: topEdgeGesture
  }, TopEdgeComponent || /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dot, styles.dotLeft, numberOfDays === 1 && styles.dotLeftSingle]
  }, /*#__PURE__*/_react.default.createElement(_DragDot.default, null))), /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: bottomEdgeGesture
  }, BottomEdgeComponent || /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dot, styles.dotRight, numberOfDays === 1 && styles.dotRightSingle]
  }, /*#__PURE__*/_react.default.createElement(_DragDot.default, null))));
};
exports.ResourceDraggableEvent = ResourceDraggableEvent;
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'absolute'
  },
  dot: {
    position: 'absolute',
    borderRadius: 12,
    width: 24,
    height: 24,
    cursor: 'pointer'
  },
  event: {
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 3
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
const DraggableEventResource = ({
  renderDraggableEvent,
  resources,
  renderEvent
}) => {
  const startUnix = (0, _VisibleDateProvider.useDateChangedListener)();
  const {
    selectedEvent
  } = (0, _DragEventProvider.useDragEvent)();
  if (!selectedEvent) {
    return null;
  }
  if (renderDraggableEvent) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, renderDraggableEvent({
      startUnix,
      visibleDates: {
        [startUnix]: {
          diffDays: 1,
          unix: startUnix
        }
      },
      index: 0,
      renderEvent,
      resources
    }));
  }
  return /*#__PURE__*/_react.default.createElement(ResourceDraggableEvent, {
    startUnix: startUnix,
    visibleDates: {
      [startUnix]: {
        diffDays: 1,
        unix: startUnix
      }
    },
    index: 0,
    renderEvent: renderEvent,
    resources: resources
  });
};
exports.DraggableEventResource = DraggableEventResource;
//# sourceMappingURL=ResourceDraggableEvent.js.map