import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { useBody } from '../../context/BodyContext';
import { useTheme } from '../../context/ThemeProvider';
import { useUnavailableHoursByDate } from '../../context/UnavailableHoursProvider';
const UnavailableHours = ({
  visibleDates,
  resources
}) => {
  const _renderColumn = (currentUnix, index) => /*#__PURE__*/React.createElement(UnavailableHoursByDate, {
    key: `UnavailableHours_${currentUnix}`,
    currentUnix: Number(currentUnix),
    visibleDateIndex: index,
    resources: resources
  });
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, Object.keys(visibleDates).map(_renderColumn));
};
export default UnavailableHours;
export const UnavailableHoursByDate = /*#__PURE__*/memo(({
  currentUnix,
  visibleDateIndex,
  resources,
  widthPercentage
}) => {
  const unavailableHours = useUnavailableHoursByDate(currentUnix);
  if (!unavailableHours) {
    return null;
  }
  return /*#__PURE__*/React.createElement(UnavailableColumns, {
    currentUnix: currentUnix,
    visibleDateIndex: visibleDateIndex,
    unavailableHours: unavailableHours,
    resources: resources,
    widthPercentage: widthPercentage
  });
});
const UnavailableColumns = /*#__PURE__*/memo(({
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
  } = useBody();
  const {
    backgroundColor,
    containerStyle
  } = useTheme(useCallback(state => {
    return {
      backgroundColor: state.unavailableHourBackgroundColor || state.colors.surface,
      containerStyle: state.unavailableHourContainerStyle || {}
    };
  }, []));
  const allUnavailableHours = useMemo(() => {
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
    return /*#__PURE__*/React.createElement(UnavailableHourItem, {
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
  } = useBody();
  const height = useDerivedValue(() => minuteHeight.value * duration);
  const childWidth = useDerivedValue(() => columnWidth * widthPercentage, [widthPercentage]);
  return /*#__PURE__*/React.createElement(View, {
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
const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  }
});
//# sourceMappingURL=UnavailableHours.js.map