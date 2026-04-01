import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { useBody } from '../context/BodyContext';
import { useNowIndicator } from '../context/NowIndicatorProvider';
import { useTheme } from '../context/ThemeProvider';
import { useDateChangedListener } from '../context/VisibleDateProvider';
const NowIndicatorInner = ({
  dayIndex,
  currentTime,
  showDot = true,
  width,
  startLeft = 0
}) => {
  const {
    minuteHeight,
    start,
    end,
    startOffset,
    columnWidth,
    NowIndicatorComponent
  } = useBody();
  const nowIndicatorColor = useTheme(useCallback(state => state.nowIndicatorColor || state.colors.primary, []));
  const opacity = useDerivedValue(() => {
    return currentTime.value >= start && currentTime.value <= end ? 1 : 0;
  }, [start, end]);
  const animView = useAnimatedStyle(() => {
    return {
      top: currentTime.value * minuteHeight.value - startOffset.value,
      opacity: opacity.value
    };
  }, [width]);
  return /*#__PURE__*/React.createElement(Animated.View, {
    pointerEvents: "box-none",
    style: [styles.container, {
      width: width ?? columnWidth,
      left: dayIndex * columnWidth + startLeft
    }, animView]
  }, NowIndicatorComponent || /*#__PURE__*/React.createElement(View, {
    style: styles.lineContainer
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.line, {
      backgroundColor: nowIndicatorColor
    }]
  }), showDot && /*#__PURE__*/React.createElement(View, {
    style: [styles.dot, {
      backgroundColor: nowIndicatorColor
    }]
  })));
};
const NowIndicator = ({
  visibleDates,
  showDot = true
}) => {
  const {
    showNowIndicator
  } = useBody();
  const {
    currentDateUnix,
    currentTime
  } = useNowIndicator();
  const visibleDate = visibleDates[currentDateUnix];
  const isShowNowIndicator = showNowIndicator && visibleDate;
  if (!isShowNowIndicator) {
    return null;
  }
  return /*#__PURE__*/React.createElement(NowIndicatorInner, {
    currentTime: currentTime,
    dayIndex: visibleDate.diffDays - 1,
    showDot: showDot
  });
};
export const NowIndicatorResource = () => {
  const {
    showNowIndicator,
    hourWidth
  } = useBody();
  const {
    currentDateUnix,
    currentTime
  } = useNowIndicator();
  const startUnix = useDateChangedListener();
  const isShowNowIndicator = showNowIndicator && startUnix === currentDateUnix;
  if (!isShowNowIndicator) {
    return null;
  }
  return /*#__PURE__*/React.createElement(NowIndicatorInner, {
    currentTime: currentTime,
    dayIndex: 0,
    startLeft: hourWidth
  });
};
export default /*#__PURE__*/React.memo(NowIndicator);
const styles = StyleSheet.create({
  container: {
    position: 'absolute'
  },
  line: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007aff',
    width: '100%'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007aff',
    position: 'absolute',
    left: -4
  },
  lineContainer: {
    justifyContent: 'center'
  }
});
//# sourceMappingURL=NowIndicator.js.map