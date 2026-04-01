"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _ActionsProvider = require("../context/ActionsProvider");
var _CalendarProvider = require("../context/CalendarProvider");
var _VisibleDateProvider = require("../context/VisibleDateProvider");
var _dateUtils = require("../utils/dateUtils");
const useSyncedList = ({
  id
}) => {
  const {
    visibleDateUnix,
    triggerDateChanged,
    visibleDateUnixAnim,
    visibleWeeks,
    linkedScrollGroup
  } = (0, _CalendarProvider.useCalendar)();
  const currentUnix = (0, _VisibleDateProvider.useDateChangedListener)();
  const notifyDateChanged = (0, _VisibleDateProvider.useNotifyDateChanged)();
  const {
    onChange,
    onDateChanged
  } = (0, _ActionsProvider.useActions)();
  const isDragging = (0, _react.useRef)(false);
  const isPendingDateChanged = (0, _react.useRef)(false);
  const onScrollBeginDrag = (0, _react.useCallback)(() => {
    isDragging.current = true;
  }, []);
  const onMomentumScrollBegin = (0, _react.useCallback)(() => {
    if (isDragging.current) {
      isPendingDateChanged.current = true;
      isDragging.current = false;
    }
  }, []);
  const debounceTimer = (0, _react.useRef)(null);
  const onVisibleColumnChanged = (0, _react.useCallback)(props => {
    const {
      index: pageIndex,
      column,
      columns,
      extraScrollData
    } = props;
    const {
      visibleColumns,
      visibleDates
    } = extraScrollData;
    const activeId = linkedScrollGroup.getActiveId() || _constants.ScrollType.calendarGrid;
    if (activeId === id.toString() && visibleColumns && visibleDates) {
      const dayIndex = pageIndex * columns + column;
      const visibleStart = visibleDates[pageIndex * columns];
      const visibleEnd = visibleDates[pageIndex * columns + column + visibleColumns];
      if (visibleStart && visibleEnd) {
        const diffDays = Math.floor((visibleEnd - visibleStart) / _constants.MILLISECONDS_IN_DAY);
        if (diffDays <= 7) {
          visibleWeeks.value = [visibleStart];
        } else {
          const nextWeekStart = visibleDates[pageIndex * columns + 7];
          if (nextWeekStart) {
            visibleWeeks.value = [visibleStart, nextWeekStart];
          }
        }
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      const currentDate = visibleDates[dayIndex];
      if (!currentDate) {
        triggerDateChanged.current = undefined;
        return;
      }
      if (visibleDateUnix.current !== currentDate) {
        const dateIsoStr = (0, _dateUtils.dateTimeToISOString)((0, _dateUtils.parseDateTime)(currentDate));
        onChange === null || onChange === void 0 || onChange(dateIsoStr);
        visibleDateUnix.current = currentDate;
        (0, _reactNativeReanimated.runOnUI)(() => {
          visibleDateUnixAnim.value = currentDate;
        })();
      }
      debounceTimer.current = setTimeout(() => {
        const isSamePrevUnix = currentUnix === currentDate;
        if (isSamePrevUnix) {
          return;
        }
        if (triggerDateChanged.current && triggerDateChanged.current === currentDate || isPendingDateChanged.current) {
          const dateIsoStr = (0, _dateUtils.dateTimeToISOString)((0, _dateUtils.parseDateTime)(currentDate));
          triggerDateChanged.current = undefined;
          onDateChanged === null || onDateChanged === void 0 || onDateChanged(dateIsoStr);
          notifyDateChanged(currentDate);
        }
        isPendingDateChanged.current = false;
      }, 150);
    }
  }, [linkedScrollGroup, id, visibleDateUnix, visibleWeeks, triggerDateChanged, onChange, visibleDateUnixAnim, currentUnix, onDateChanged, notifyDateChanged]);
  return {
    onScrollBeginDrag,
    onMomentumScrollBegin,
    onVisibleColumnChanged
  };
};
var _default = exports.default = useSyncedList;
//# sourceMappingURL=useSyncedList.js.map