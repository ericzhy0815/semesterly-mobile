"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _CalendarListView = _interopRequireDefault(require("./components/CalendarListView"));
var _ExpandButton = _interopRequireDefault(require("./components/ExpandButton"));
var _MultiDayBarItem = _interopRequireDefault(require("./components/MultiDayBarItem"));
var _ResourceListView = _interopRequireDefault(require("./components/Resource/ResourceListView"));
var _ResourceHeaderItem = _interopRequireDefault(require("./components/ResourceHeaderItem"));
var _SingleDayBarItem = _interopRequireDefault(require("./components/SingleDayBarItem"));
var _WeekNumber = _interopRequireDefault(require("./components/WeekNumber"));
var _constants = require("./constants");
var _CalendarProvider = require("./context/CalendarProvider");
var _DayBarContext = require("./context/DayBarContext");
var _EventsProvider = require("./context/EventsProvider");
var _ThemeProvider = require("./context/ThemeProvider");
var _useSyncedList = _interopRequireDefault(require("./hooks/useSyncedList"));
var _utils = require("./utils/utils");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CalendarHeader = ({
  dayBarHeight = _constants.DAY_BAR_HEIGHT,
  renderHeaderItem,
  renderExpandIcon,
  LeftAreaComponent,
  headerBottomHeight = _constants.HEADER_BOTTOM_HEIGHT,
  collapsedItems = _constants.COLLAPSED_ITEMS,
  renderEvent,
  eventMinMinutes = _constants.MIN_ALL_DAY_MINUTES,
  eventMaxMinutes = _constants.MAX_ALL_DAY_MINUTES,
  eventInitialMinutes = _constants.DEFAULT_ALL_DAY_MINUTES,
  renderDayItem,
  insetBottom = 100
}) => {
  const {
    calendarLayout,
    numberOfDays,
    minuteHeight,
    hourWidth,
    dayBarListRef,
    calendarData,
    calendarGridWidth,
    isRTL,
    snapToInterval,
    scrollByDay,
    initialOffset,
    columns,
    showWeekNumber,
    visibleDateUnixAnim,
    visibleWeeks,
    columnWidth,
    useAllDayEvent,
    rightEdgeSpacing,
    overlapEventsSpacing,
    firstDay,
    allowHorizontalSwipe,
    enableResourceScroll,
    resourcePerPage,
    resourcePagingEnabled,
    linkedScrollGroup
  } = (0, _CalendarProvider.useCalendar)();
  const {
    onTouchStart,
    onWheel
  } = linkedScrollGroup.addAndGet(_constants.ScrollType.dayBar, dayBarListRef);
  const resources = (0, _EventsProvider.useResources)();
  const headerStyles = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => ({
    headerBackgroundColor: state.headerBackgroundColor || state.colors.background,
    borderColor: state.headerBorderColor ?? state.colors.border,
    headerContainer: state.headerContainer
  }), []));
  const scrollProps = (0, _useSyncedList.default)({
    id: _constants.ScrollType.dayBar
  });
  const isExpanded = (0, _reactNativeReanimated.useSharedValue)(false);
  const eventHeight = (0, _reactNativeReanimated.useDerivedValue)(() => (0, _utils.clampValues)(eventInitialMinutes * minuteHeight.value, eventMinMinutes * minuteHeight.value, eventMaxMinutes * minuteHeight.value), [eventInitialMinutes, eventMinMinutes, eventMaxMinutes]);
  const eventCounts = (0, _EventsProvider.useEventCountsByWeek)(columns === 1 ? 'day' : 'week');
  const maxEventRows = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const currentStartWeek = visibleWeeks.value[0];
    const nextStartWeek = visibleWeeks.value[1];
    let count = currentStartWeek ? eventCounts[currentStartWeek] ?? 0 : 0;
    if (nextStartWeek) {
      const countNextWeek = eventCounts[nextStartWeek] ?? 0;
      count = Math.max(count, countNextWeek);
    }
    return count;
  }, [eventCounts]);
  const isShowExpandButton = (0, _reactNativeReanimated.useDerivedValue)(() => maxEventRows.value > collapsedItems, [maxEventRows, collapsedItems]);
  const visibleRows = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const minRows = Math.min(maxEventRows.value, collapsedItems);
    if (isExpanded.value) {
      return (0, _reactNativeReanimated.withTiming)(maxEventRows.value, {
        duration: 250
      });
    }
    return (0, _reactNativeReanimated.withTiming)(minRows, {
      duration: 250
    });
  }, [maxEventRows, collapsedItems]);
  const allDayEventsHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    const extraHeight = numberOfDays > 1 ? headerBottomHeight : 0;
    let nextHeight = 0;
    if (visibleRows.value) {
      nextHeight = visibleRows.value * eventHeight.value + extraHeight;
    }
    return nextHeight;
  }, [numberOfDays, headerBottomHeight]);
  const contentHeight = (0, _reactNativeReanimated.useDerivedValue)(() => {
    if (!useAllDayEvent) {
      return dayBarHeight;
    }
    if (numberOfDays === 1) {
      const bottomHeight = isExpanded.value ? 10 : headerBottomHeight + 10;
      return (0, _utils.clampValues)(allDayEventsHeight.value + bottomHeight, dayBarHeight, calendarLayout.height - insetBottom);
    }
    return (0, _utils.clampValues)(dayBarHeight + allDayEventsHeight.value, 0, calendarLayout.height - insetBottom);
  }, [numberOfDays, dayBarHeight, headerBottomHeight, insetBottom]);
  const headerContainerStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: contentHeight.value
  }));
  const value = (0, _react.useMemo)(() => ({
    dayBarHeight,
    numberOfDays,
    calendarLayout,
    hourWidth,
    minuteHeight,
    isRTL,
    scrollByDay,
    columns,
    calendarData,
    eventHeight,
    isExpanded,
    allDayEventsHeight,
    columnWidth,
    useAllDayEvent,
    isShowExpandButton,
    collapsedItems,
    headerBottomHeight,
    rightEdgeSpacing,
    overlapEventsSpacing,
    firstDay,
    resourcePerPage,
    enableResourceScroll
  }), [dayBarHeight, numberOfDays, calendarLayout, hourWidth, minuteHeight, isRTL, scrollByDay, columns, calendarData, eventHeight, isExpanded, allDayEventsHeight, columnWidth, useAllDayEvent, isShowExpandButton, headerBottomHeight, collapsedItems, rightEdgeSpacing, overlapEventsSpacing, firstDay, resourcePerPage, enableResourceScroll]);
  const extraData = (0, _react.useMemo)(() => ({
    minDate: calendarData.minDateUnix,
    visibleDatesArray: calendarData.visibleDatesArray,
    columns,
    renderHeaderItem,
    renderEvent,
    renderExpandIcon,
    resources,
    renderDayItem
  }), [calendarData.minDateUnix, calendarData.visibleDatesArray, columns, renderHeaderItem, renderEvent, renderExpandIcon, resources, renderDayItem]);
  const _renderHeaderItem = (index, extra) => {
    const dateUnixByIndex = extra.visibleDatesArray[index * extra.columns];
    if (!dateUnixByIndex) {
      return null;
    }
    if (extra.renderHeaderItem) {
      return extra.renderHeaderItem({
        startUnix: dateUnixByIndex,
        index,
        extra
      });
    }
    if (extra.resources) {
      return /*#__PURE__*/_react.default.createElement(_ResourceHeaderItem.default, {
        resources: extra.resources,
        startUnix: dateUnixByIndex
      });
    }
    if (extra.columns === 1) {
      return /*#__PURE__*/_react.default.createElement(_SingleDayBarItem.default, {
        startUnix: dateUnixByIndex,
        renderExpandIcon: extra.renderExpandIcon,
        renderEvent: extra.renderEvent,
        pageIndex: index,
        renderDayItem: extra.renderDayItem
      });
    }
    return /*#__PURE__*/_react.default.createElement(_MultiDayBarItem.default, {
      pageIndex: index * extra.columns,
      startUnix: dateUnixByIndex,
      renderEvent: extra.renderEvent,
      renderDayItem: extra.renderDayItem
    });
  };
  const extraScrollData = (0, _react.useMemo)(() => {
    return {
      visibleDates: calendarData.visibleDatesArray,
      visibleColumns: numberOfDays
    };
  }, [calendarData.visibleDatesArray, numberOfDays]);
  const leftSize = numberOfDays > 1 || !!resources ? hourWidth : 0;
  const _renderLeftArea = () => {
    if (LeftAreaComponent) {
      return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
        style: [styles.leftArea, {
          width: hourWidth
        }]
      }, LeftAreaComponent);
    }
    return /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
      onPress: () => {
        if (isShowExpandButton.value) {
          isExpanded.value = !isExpanded.value;
        }
      },
      style: [styles.leftArea, {
        width: hourWidth
      }]
    }, showWeekNumber && /*#__PURE__*/_react.default.createElement(_WeekNumber.default, {
      date: visibleDateUnixAnim
    }), useAllDayEvent && /*#__PURE__*/_react.default.createElement(_ExpandButton.default, {
      isExpanded: isExpanded,
      isShowExpandButton: isShowExpandButton,
      renderExpandIcon: renderExpandIcon
    }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.border, {
        backgroundColor: headerStyles.borderColor
      }]
    }));
  };
  const _renderResourceHeaderItem = (0, _react.useCallback)(item => {
    if (renderHeaderItem) {
      return renderHeaderItem({
        startUnix: visibleDateUnixAnim.value,
        index: 0,
        extra: {
          resources: item.items
        }
      });
    }
    return /*#__PURE__*/_react.default.createElement(_ResourceHeaderItem.default, {
      resources: item.items,
      startUnix: visibleDateUnixAnim.value
    });
  }, [visibleDateUnixAnim, renderHeaderItem]);
  const height = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return numberOfDays === 1 ? Math.max(dayBarHeight, allDayEventsHeight.value + (isExpanded.value ? 10 : headerBottomHeight + 10)) : dayBarHeight + allDayEventsHeight.value;
  }, [dayBarHeight, headerBottomHeight, calendarLayout.height, numberOfDays]);
  const headerContentStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    height: height.value
  }));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.headerContainer, {
      backgroundColor: headerStyles.headerBackgroundColor,
      borderBottomColor: headerStyles.borderColor
    }, headerStyles.headerContainer, {
      width: calendarLayout.width
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.ScrollView, {
    style: headerContainerStyle,
    alwaysBounceVertical: false,
    bounces: false,
    overScrollMode: "never"
  }, /*#__PURE__*/_react.default.createElement(_DayBarContext.HeaderContext.Provider, {
    value: value
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [{
      width: calendarLayout.width
    }, headerContentStyle]
  }, (numberOfDays > 1 || !!resources) && _renderLeftArea(), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.absolute, {
      left: Math.max(0, leftSize - 1),
      width: calendarLayout.width - leftSize,
      height: '100%'
    }]
  }, enableResourceScroll ? /*#__PURE__*/_react.default.createElement(_ResourceListView.default, {
    ref: dayBarListRef,
    resources: resources,
    width: calendarGridWidth,
    height: dayBarHeight,
    resourcePerPage: resourcePerPage,
    renderItem: _renderResourceHeaderItem,
    pagingEnabled: resourcePagingEnabled,
    scrollEnabled: allowHorizontalSwipe,
    onTouchStart: onTouchStart,
    onWheel: onWheel
  }) : /*#__PURE__*/_react.default.createElement(_CalendarListView.default, _extends({
    animatedRef: dayBarListRef,
    count: calendarData.count,
    width: calendarGridWidth,
    renderItem: _renderHeaderItem,
    extraData: extraData,
    inverted: isRTL,
    snapToInterval: snapToInterval,
    initialOffset: initialOffset,
    columnsPerPage: columns,
    extraScrollData: extraScrollData,
    scrollEnabled: allowHorizontalSwipe
  }, scrollProps, {
    onTouchStart: onTouchStart,
    onWheel: onWheel
  })))))));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(CalendarHeader);
const styles = _reactNative.StyleSheet.create({
  headerContainer: {
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  absolute: {
    position: 'absolute'
  },
  leftArea: {
    height: '100%'
  },
  border: {
    right: 0,
    height: '100%',
    position: 'absolute',
    width: 1
  }
});
//# sourceMappingURL=CalendarHeader.js.map