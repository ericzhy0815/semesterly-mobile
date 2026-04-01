import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { EXTRA_HEIGHT } from '../../constants';
import { useActions } from '../../context/ActionsProvider';
import { useBody } from '../../context/BodyContext';
import { useDragEventActions } from '../../context/DragEventProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useTimezone } from '../../context/TimeZoneProvider';
import { dateTimeToISOString, forceUpdateZone, parseDateTime } from '../../utils/dateUtils';
import HorizontalLine from '../TimelineBoard/HorizontalLine';
import VerticalLine from '../TimelineBoard/VerticalLine';
import Touchable from '../Touchable';
import UnavailableHoursByResource from './UnavailableHoursByResource';
const ResourceBoard = ({
  resources
}) => {
  const colors = useTheme(state => state.colors);
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
  } = useBody();
  const {
    timeZone
  } = useTimezone();
  const {
    onPressBackground,
    onLongPressBackground
  } = useActions();
  const {
    triggerDragCreateEvent
  } = useDragEventActions();
  const contentView = useAnimatedStyle(() => ({
    height: timelineHeight.value - spaceFromTop - spaceFromBottom
  }));
  const onPress = event => {
    const dayUnix = visibleDateUnixAnim.value;
    const minutes = event.nativeEvent.locationY / minuteHeight.value + start;
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const baseDateTime = parseDateTime(dayUnix).set({
      hour,
      minute
    });
    const dateObj = forceUpdateZone(baseDateTime, timeZone);
    const newProps = {
      dateTime: dateTimeToISOString(dateObj)
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
    const baseDateTime = parseDateTime(dayUnix).set({
      hour,
      minute
    });
    const dateObj = forceUpdateZone(baseDateTime, timeZone);
    const dateString = dateTimeToISOString(dateObj);
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
  const _renderVerticalLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= resources.length; i++) {
      lines.push(/*#__PURE__*/React.createElement(VerticalLine, {
        key: i,
        borderColor: colors.border,
        index: i,
        columnWidth: columnWidth,
        childColumns: resourcePerPage
      }));
    }
    return lines;
  }, [resources.length, colors.border, columnWidth, resourcePerPage]);
  const _renderHorizontalLines = useMemo(() => {
    const rows = [];
    for (let i = 0; i < totalSlots; i++) {
      rows.push(/*#__PURE__*/React.createElement(HorizontalLine, {
        key: i,
        borderColor: colors.border,
        index: i,
        totalSlots: totalSlots,
        renderCustomHorizontalLine: renderCustomHorizontalLine
      }));
      rows.push(/*#__PURE__*/React.createElement(HorizontalLine, {
        key: `${i}.5`,
        borderColor: colors.border,
        index: i + 0.5,
        totalSlots: totalSlots,
        renderCustomHorizontalLine: renderCustomHorizontalLine
      }));
    }
    rows.push(/*#__PURE__*/React.createElement(HorizontalLine, {
      key: totalSlots,
      borderColor: colors.border,
      index: totalSlots,
      totalSlots: totalSlots,
      renderCustomHorizontalLine: renderCustomHorizontalLine
    }));
    return rows;
  }, [totalSlots, colors.border, renderCustomHorizontalLine]);
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.calendarGrid, {
      marginTop: EXTRA_HEIGHT + spaceFromTop
    }, contentView]
  }, /*#__PURE__*/React.createElement(Touchable, {
    style: styles.touchable,
    onPress: onPressBackground ? onPress : undefined,
    onLongPress: triggerDragCreateEvent || onLongPressBackground ? onLongPress : undefined,
    disabled: !onPressBackground && !triggerDragCreateEvent && !onLongPressBackground
  }), /*#__PURE__*/React.createElement(UnavailableHoursByResource, {
    resources: resources
  }), _renderHorizontalLines), resources.length > 1 && _renderVerticalLines);
};
export default /*#__PURE__*/memo(ResourceBoard);
const styles = StyleSheet.create({
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