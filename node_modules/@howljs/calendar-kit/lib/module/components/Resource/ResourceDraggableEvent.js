import React, { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { useBody } from '../../context/BodyContext';
import { useDragEvent, useDragEventActions } from '../../context/DragEventProvider';
import { useTheme } from '../../context/ThemeProvider';
import { useDateChangedListener } from '../../context/VisibleDateProvider';
import DragDot from '../DragDot';
export const ResourceDraggableEvent = ({
  renderEvent,
  resources,
  TopEdgeComponent,
  BottomEdgeComponent,
  containerStyle
}) => {
  const theme = useTheme(useCallback(state => {
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
  } = useBody();
  const {
    dragStartUnix,
    dragSelectedDuration,
    dragSelectedStartMinutes,
    selectedEvent,
    isDraggingAnim
  } = useDragEvent();
  const {
    triggerDragSelectedEvent
  } = useDragEventActions();
  const eventWidth = columnWidth / resourcePerPage;
  const eventWidthAnim = useDerivedValue(() => eventWidth, [eventWidth]);
  const resourceIndex = useMemo(() => {
    if (!resources) {
      return -1;
    }
    return resources.findIndex(resource => resource.id === (selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId));
  }, [resources, selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId]);
  const top = useDerivedValue(() => {
    return (dragSelectedStartMinutes.value - start) * minuteHeight.value;
  }, [start]);
  const eventHeight = useDerivedValue(() => dragSelectedDuration.value * minuteHeight.value);
  const isDragging = useDerivedValue(() => dragStartUnix.value !== -1);
  const animView = useAnimatedStyle(() => {
    return {
      top: top.value,
      height: eventHeight.value,
      left: resourceIndex * eventWidth,
      opacity: isDragging.value || top.value === -1 ? 0 : 1
    };
  });
  const gesture = Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'center',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  const topEdgeGesture = Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'top',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  const bottomEdgeGesture = Gesture.Tap().runOnJS(true).onTouchesDown(() => {
    triggerDragSelectedEvent({
      startIndex: 0,
      type: 'bottom',
      resourceId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.resourceId
    });
  }).onTouchesUp(() => {
    isDraggingAnim.value = false;
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.container, {
      width: eventWidth
    }, animView]
  }, selectedEvent && /*#__PURE__*/React.createElement(View, {
    style: [StyleSheet.absoluteFill, theme.eventContainerStyle, styles.event, {
      backgroundColor: (selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.color) ?? (Platform.OS === 'android' ? theme.primaryColor : 'transparent'),
      borderColor: theme.primaryColor
    }, containerStyle]
  }, renderEvent ? renderEvent(selectedEvent, {
    width: eventWidthAnim,
    height: eventHeight
  }) : /*#__PURE__*/React.createElement(Text, {
    style: [styles.eventTitle, theme.eventTitleStyle]
  }, selectedEvent.title)), /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gesture
  }, /*#__PURE__*/React.createElement(View, {
    style: [StyleSheet.absoluteFill, {
      cursor: 'pointer'
    }]
  })), /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: topEdgeGesture
  }, TopEdgeComponent || /*#__PURE__*/React.createElement(View, {
    style: [styles.dot, styles.dotLeft, numberOfDays === 1 && styles.dotLeftSingle]
  }, /*#__PURE__*/React.createElement(DragDot, null))), /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: bottomEdgeGesture
  }, BottomEdgeComponent || /*#__PURE__*/React.createElement(View, {
    style: [styles.dot, styles.dotRight, numberOfDays === 1 && styles.dotRightSingle]
  }, /*#__PURE__*/React.createElement(DragDot, null))));
};
const styles = StyleSheet.create({
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
export const DraggableEventResource = ({
  renderDraggableEvent,
  resources,
  renderEvent
}) => {
  const startUnix = useDateChangedListener();
  const {
    selectedEvent
  } = useDragEvent();
  if (!selectedEvent) {
    return null;
  }
  if (renderDraggableEvent) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, renderDraggableEvent({
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
  return /*#__PURE__*/React.createElement(ResourceDraggableEvent, {
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
//# sourceMappingURL=ResourceDraggableEvent.js.map