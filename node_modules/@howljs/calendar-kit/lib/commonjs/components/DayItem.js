"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ActionsProvider = require("../context/ActionsProvider");
var _HighlightDatesProvider = require("../context/HighlightDatesProvider");
var _LocaleProvider = require("../context/LocaleProvider");
var _NowIndicatorProvider = require("../context/NowIndicatorProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _dateUtils = require("../utils/dateUtils");
var _Text = _interopRequireDefault(require("./Text"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const selectDayItemTheme = state => ({
  colors: state.colors,
  weekDayText: state.dayName,
  dayNumContainer: state.dayNumberContainer,
  dayNumText: state.dayNumber,
  todayName: state.todayName || {
    color: state.colors.text
  },
  todayNumberContainer: state.todayNumberContainer || {
    backgroundColor: state.colors.primary
  },
  todayNumber: state.todayNumber || {
    color: state.colors.onPrimary
  },
  dayContainer: state.dayContainer
});
const DayItem = ({
  dateUnix,
  children,
  showDayItem = true,
  dayItemContainerStyle
}) => {
  const {
    weekDayShort
  } = (0, _LocaleProvider.useLocale)();
  const {
    currentDateUnix
  } = (0, _NowIndicatorProvider.useNowIndicator)();
  const {
    onPressDayNumber
  } = (0, _ActionsProvider.useActions)();
  const highlightDates = (0, _HighlightDatesProvider.useHighlightDates)(dateUnix);
  const date = (0, _react.useMemo)(() => (0, _dateUtils.parseDateTime)(dateUnix), [dateUnix]);
  const {
    colors,
    weekDayText,
    dayNumContainer,
    dayNumText,
    todayName,
    todayNumberContainer,
    todayNumber,
    dayContainer
  } = (0, _ThemeProvider.useTheme)(selectDayItemTheme);
  const isToday = dateUnix === currentDateUnix;
  const customStyle = (0, _react.useMemo)(() => {
    let container = isToday ? todayNumberContainer : dayNumContainer;
    let dayText = isToday ? todayName : weekDayText;
    let numText = isToday ? todayNumber : dayNumText;
    if (highlightDates) {
      const isOverride = isToday && highlightDates.isTodayOverride;
      if (highlightDates && !isToday || isOverride) {
        container = (highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates.dayNumberContainer) ?? container;
        dayText = (highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates.dayName) ?? dayText;
        numText = (highlightDates === null || highlightDates === void 0 ? void 0 : highlightDates.dayNumber) ?? numText;
      }
    }
    return {
      container,
      dayText,
      numText
    };
  }, [highlightDates, dayNumContainer, dayNumText, isToday, todayName, todayNumber, todayNumberContainer, weekDayText]);
  const _onDayPress = () => {
    const dateStr = (0, _dateUtils.dateTimeToISOString)(date);
    onPressDayNumber === null || onPressDayNumber === void 0 || onPressDayNumber(dateStr);
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: dayItemContainerStyle
  }, showDayItem && /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    activeOpacity: 0.6,
    disabled: !onPressDayNumber,
    onPress: _onDayPress
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dayContainer, dayContainer]
  }, /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [styles.weekDayText, {
      color: colors.text
    }, customStyle.dayText]
  }, weekDayShort[date.weekday % 7]), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dayNumContainer, customStyle.container]
  }, /*#__PURE__*/_react.default.createElement(_Text.default, {
    style: [styles.dayNumText, {
      color: colors.text
    }, customStyle.numText]
  }, date.day)))), children);
};
var _default = exports.default = DayItem;
const styles = _reactNative.StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayNumContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  dayNumText: {
    fontSize: 16,
    fontWeight: '500'
  },
  weekDayText: {
    fontSize: 12,
    color: '#5F6267',
    marginBottom: 2
  }
});
//# sourceMappingURL=DayItem.js.map