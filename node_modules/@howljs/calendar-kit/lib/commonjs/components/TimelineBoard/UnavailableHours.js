"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UnavailableHoursByDate = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _BodyContext = require("../../context/BodyContext");
var _ThemeProvider = require("../../context/ThemeProvider");
var _UnavailableHoursProvider = require("../../context/UnavailableHoursProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const UnavailableHours = ({
  visibleDates,
  resources
}) => {
  const _renderColumn = (currentUnix, index) => /*#__PURE__*/_react.default.createElement(UnavailableHoursByDate, {
    key: `UnavailableHours_${currentUnix}`,
    currentUnix: Number(currentUnix),
    visibleDateIndex: index,
    resources: resources
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, Object.keys(visibleDates).map(_renderColumn));
};
var _default = exports.default = UnavailableHours;
const UnavailableHoursByDate = exports.UnavailableHoursByDate = /*#__PURE__*/(0, _react.memo)(({
  currentUnix,
  visibleDateIndex,
  resources,
  widthPercentage
}) => {
  const unavailableHours = (0, _UnavailableHoursProvider.useUnavailableHoursByDate)(currentUnix);
  if (!unavailableHours) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(UnavailableColumns, {
    currentUnix: currentUnix,
    visibleDateIndex: visibleDateIndex,
    unavailableHours: unavailableHours,
    resources: resources,
    widthPercentage: widthPercentage
  });
});
const UnavailableColumns = /*#__PURE__*/(0, _react.memo)(({
  currentUnix,
  visibleDateIndex,
  unavailableHours,
  resources,
  widthPercentage
}) => {
  const {
    start: calendarStart,
    end: calendarEnd,
    renderCustomUnavailableHour,
    numberOfDays
  } = (0, _BodyContext.useBody)();
  const {
    backgroundColor,
    containerStyle
  } = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => {
    return {
      backgroundColor: state.unavailableHourBackgroundColor || state.colors.surface,
      containerStyle: state.unavailableHourContainerStyle || {}
    };
  }, []));
  const allUnavailableHours = (0, _react.useMemo)(() => {
    const resourcesList = resources || [];
    const isResourceSupported = numberOfDays === 1;
    // If no resources or only one resource, apply all unavailable hours to the full width
    if (resourcesList.length <= 1 || !isResourceSupported) {
      return unavailableHours.map(item => ({
        item,
        resourceIndex: 0,
        widthPercentage: widthPercentage || 1
      }));
    }

    // For multiple resources scenario
    const result = [];
    const widthPerResource = widthPercentage || 1 / resourcesList.length;

    // Create a map for faster resource lookup
    const resourceMap = new Map();
    resourcesList.forEach((resource, index) => {
      if (resource.id) {
        resourceMap.set(resource.id, index);
      }
    });

    // Process all unavailable hours in a single pass
    unavailableHours.forEach(item => {
      if (!item.resourceId) {
        // Global unavailable hour - apply to all resources
        resourcesList.forEach((_, index) => {
          result.push({
            item,
            resourceIndex: index,
            widthPercentage: widthPerResource
          });
        });
      } else {
        // Resource-specific unavailable hour
        const resourceIndex = resourceMap.get(item.resourceId);
        if (resourceIndex !== undefined) {
          result.push({
            item,
            resourceIndex,
            widthPercentage: widthPerResource
          });
        }
      }
    });
    return result;
  }, [resources, numberOfDays, widthPercentage, unavailableHours]);
  const _renderSpecialRegion = (props, regionIndex) => {
    const item = props.item;
    const clampedStart = Math.max(item.start - calendarStart, 0);
    const start = item.start > calendarStart ? item.start : calendarStart;
    const duration = item.end - start;
    return /*#__PURE__*/_react.default.createElement(UnavailableHourItem, {
      key: `${currentUnix}_${regionIndex}`,
      diffDays: visibleDateIndex,
      diffMinutes: clampedStart,
      duration: duration,
      totalMinutes: calendarEnd - calendarStart,
      backgroundColor: item.backgroundColor || backgroundColor,
      containerStyle: containerStyle,
      enableBackgroundInteraction: item.enableBackgroundInteraction,
      renderCustomUnavailableHour: renderCustomUnavailableHour,
      originalProps: item,
      resourceIndex: props.resourceIndex,
      widthPercentage: props.widthPercentage
    });
  };
  return allUnavailableHours.map(_renderSpecialRegion);
});
const UnavailableHourItem = ({
  totalMinutes,
  duration,
  diffDays,
  diffMinutes,
  backgroundColor,
  containerStyle,
  enableBackgroundInteraction,
  renderCustomUnavailableHour,
  originalProps,
  resourceIndex,
  widthPercentage = 1
}) => {
  const {
    minuteHeight,
    columnWidth
  } = (0, _BodyContext.useBody)();
  const height = (0, _reactNativeReanimated.useDerivedValue)(() => minuteHeight.value * duration);
  const childWidth = (0, _reactNativeReanimated.useDerivedValue)(() => columnWidth * widthPercentage, [widthPercentage]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: enableBackgroundInteraction ? 'none' : 'auto',
    style: [containerStyle, styles.container, {
      backgroundColor,
      width: columnWidth * widthPercentage,
      left: diffDays * columnWidth + resourceIndex * (columnWidth * widthPercentage),
      top: `${diffMinutes / totalMinutes * 100}%`,
      height: `${duration / totalMinutes * 100}%`
    }]
  }, renderCustomUnavailableHour && renderCustomUnavailableHour({
    ...originalProps,
    width: childWidth,
    height
  }));
};
const styles = _reactNative.StyleSheet.create({
  container: {
    position: 'absolute'
  }
});
//# sourceMappingURL=UnavailableHours.js.map