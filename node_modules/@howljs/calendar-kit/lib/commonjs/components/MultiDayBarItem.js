"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _ActionsProvider = require("../context/ActionsProvider");
var _DayBarContext = require("../context/DayBarContext");
var _EventsProvider = require("../context/EventsProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _TimeZoneProvider = require("../context/TimeZoneProvider");
var _dateUtils = require("../utils/dateUtils");
var _DayItem = _interopRequireDefault(require("./DayItem"));
var _Overlay = _interopRequireDefault(require("./Loading/Overlay"));
var _ProgressBar = _interopRequireDefault(require("./Loading/ProgressBar"));
var _Text = _interopRequireDefault(require("./Text"));
var _Touchable = _interopRequireDefault(require("./Touchable"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const MultiDayBarItem = ({
  pageIndex,
  startUnix,
  renderEvent,
  renderDayItem
}) => {
  const dayBarStyles = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => ({
    borderColor: state.dayBarBorderColor ?? state.colors.border,
    dayBarContainer: state.dayBarContainer,
    allDayEventsContainer: state.allDayEventsContainer,
    headerBottomContainer: state.headerBottomContainer,
    countContainer: state.countContainer,
    countText: state.countText
  }), []));
  const {
    dayBarHeight,
    calendarData,
    columns,
    numberOfDays,
    allDayEventsHeight,
    columnWidth
  } = (0, _DayBarContext.useHeader)();
  const {
    timeZone
  } = (0, _TimeZoneProvider.useTimezone)();
  const {
    onPressEvent,
    onPressBackground,
    onLongPressBackground
  } = (0, _ActionsProvider.useActions)();
  const visibleDates = (0, _react.useMemo)(() => {
    const data = {};
    for (let i = 0; i < columns; i++) {
      const dateUnix = calendarData.visibleDatesArray[pageIndex + i];
      if (!dateUnix) {
        continue;
      }
      data[dateUnix] = {
        unix: dateUnix
      };
    }
    return data;
  }, [calendarData.visibleDatesArray, columns, pageIndex]);
  const {
    data: events,
    eventCounts
  } = (0, _EventsProvider.useAllDayEvents)(startUnix, numberOfDays, visibleDates);
  const _onPressBackground = event => {
    const columnIndex = Math.floor(event.nativeEvent.locationX / columnWidth);
    const dayIndex = pageIndex + columnIndex;
    const dayUnix = calendarData.visibleDatesArray[dayIndex];
    if (dayUnix) {
      const dateObj = (0, _dateUtils.forceUpdateZone)((0, _dateUtils.parseDateTime)(dayUnix), timeZone);
      const dateString = (0, _dateUtils.dateTimeToISOString)(dateObj);
      onPressBackground === null || onPressBackground === void 0 || onPressBackground({
        date: dateString
      }, event);
    }
  };
  const _onLongPressBackground = event => {
    const columnIndex = Math.floor(event.nativeEvent.locationX / columnWidth);
    const dayIndex = pageIndex + columnIndex;
    const dayUnix = calendarData.visibleDatesArray[dayIndex];
    if (dayUnix) {
      const dateObj = (0, _dateUtils.forceUpdateZone)((0, _dateUtils.parseDateTime)(dayUnix), timeZone);
      const dateString = (0, _dateUtils.dateTimeToISOString)(dateObj);
      onLongPressBackground === null || onLongPressBackground === void 0 || onLongPressBackground({
        date: dateString
      }, event);
    }
  };
  const eventsContainerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: allDayEventsHeight.value
  }));
  const _renderDayItem = date => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: `column_${visibleDates[date].unix}`,
      pointerEvents: "box-none",
      style: {
        width: columnWidth
      }
    }, renderDayItem ? renderDayItem({
      dateUnix: visibleDates[date].unix
    }) : /*#__PURE__*/_react.default.createElement(_DayItem.default, {
      dateUnix: visibleDates[date].unix
    }));
  };
  const _renderEvent = (0, _react.useCallback)(event => {
    return /*#__PURE__*/_react.default.createElement(EventItem, {
      key: event.localId,
      event: event,
      onPressEvent: onPressEvent,
      renderEvent: renderEvent
    });
  }, [onPressEvent, renderEvent]);
  const _renderBottomColumn = date => {
    const count = eventCounts[date];
    return /*#__PURE__*/_react.default.createElement(BottomColumn, {
      key: `bottom_${date}`,
      count: count,
      columnWidth: columnWidth,
      borderColor: dayBarStyles.borderColor,
      countContainerStyle: dayBarStyles.countContainer,
      countTextStyle: dayBarStyles.countText
    });
  };
  const height = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return dayBarHeight + allDayEventsHeight.value;
  }, [dayBarHeight]);
  const containerHeight = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: height.value
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: containerHeight
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, dayBarStyles.dayBarContainer, {
      height: dayBarHeight
    }]
  }, Object.keys(visibleDates).map(_renderDayItem)), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [dayBarStyles.allDayEventsContainer, eventsContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(_Touchable.default, {
    onPress: _onPressBackground,
    onLongPress: onLongPressBackground ? _onLongPressBackground : undefined,
    disabled: !onLongPressBackground && !onPressBackground,
    style: _reactNative.StyleSheet.absoluteFill
  }), events.map(_renderEvent)), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.bottomContainer, dayBarStyles.headerBottomContainer]
  }, Object.keys(visibleDates).map(_renderBottomColumn)), /*#__PURE__*/_react.default.createElement(_Overlay.default, null), /*#__PURE__*/_react.default.createElement(_ProgressBar.default, null));
};
var _default = exports.default = MultiDayBarItem;
const BottomColumn = ({
  columnWidth,
  borderColor,
  count,
  countContainerStyle,
  countTextStyle
}) => {
  const {
    collapsedItems,
    isExpanded,
    headerBottomHeight
  } = (0, _DayBarContext.useHeader)();
  const isShowCount = count && count > collapsedItems;
  const countStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    display: isExpanded.value ? 'none' : 'flex',
    width: '100%'
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      width: columnWidth
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.bottomLine, {
      backgroundColor: borderColor
    }]
  }), isShowCount && /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.countContainer, countContainerStyle, {
      height: headerBottomHeight
    }, countStyle]
  }, /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [styles.countText, countTextStyle]
  }, "+", count - collapsedItems), /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    style: _reactNative.StyleSheet.absoluteFill,
    onPress: () => {
      isExpanded.value = true;
    }
  })));
};
const EventItem = ({
  event,
  onPressEvent,
  renderEvent
}) => {
  const {
    rightEdgeSpacing,
    columnWidth,
    eventHeight: height,
    isExpanded,
    overlapEventsSpacing
  } = (0, _DayBarContext.useHeader)();
  const {
    _internal,
    ...rest
  } = event;
  const eventWidth = _internal.columnSpan * columnWidth - rightEdgeSpacing;
  const eventWidthAnim = (0, _reactNativeReanimated.useDerivedValue)(() => eventWidth, [eventWidth]);
  const isShow = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return isExpanded.value || _internal.rowIndex < 2;
  }, [_internal.rowIndex]);
  const eventHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return isShow.value ? height.value - overlapEventsSpacing : 0;
  }, [overlapEventsSpacing]);
  const left = _internal.startIndex * columnWidth;
  const top = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return _internal.rowIndex * height.value;
  }, [_internal.rowIndex]);
  const eventContainerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      position: 'absolute',
      top: top.value,
      height: eventHeight.value,
      opacity: isShow.value ? 1 : 0
    };
  });
  const _onPressEvent = () => {
    if (onPressEvent) {
      onPressEvent(rest);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [{
      left,
      width: eventWidth
    }, eventContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    activeOpacity: 0.6,
    disabled: !onPressEvent,
    onPress: _onPressEvent,
    style: [styles.eventContent, {
      backgroundColor: rest.color ?? '#ccc'
    }, rest.containerStyle]
  }, renderEvent ? renderEvent(event, {
    width: eventWidthAnim,
    height: eventHeight
  }) : /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [styles.eventTitle, rest.titleStyle, {
      color: rest.titleColor
    }]
  }, rest.title)));
};
const styles = _reactNative.StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  eventContent: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 2,
    paddingHorizontal: 2,
    paddingVertical: 1
  },
  eventTitle: {
    fontSize: 10,
    color: '#FFF',
    paddingHorizontal: 2
  },
  bottomLine: {
    position: 'absolute',
    height: 16,
    width: 1,
    bottom: 0,
    left: 0
  },
  bottomContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0
  },
  countContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  countText: {
    fontSize: 12
  }
});
//# sourceMappingURL=MultiDayBarItem.js.map