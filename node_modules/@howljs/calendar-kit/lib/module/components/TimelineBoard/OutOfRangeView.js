import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDerivedValue } from 'react-native-reanimated';
import { useBody } from '../../context/BodyContext';
import { useTheme } from '../../context/ThemeProvider';
const OutOfRangeView = ({
  position,
  diffDays
}) => {
  const {
    columnWidth,
    renderCustomOutOfRange,
    timeIntervalHeight,
    totalSlots
  } = useBody();
  const disableBackgroundColor = useTheme(state => state.outOfRangeBackgroundColor || state.colors.surface);
  const disableHeight = useDerivedValue(() => timeIntervalHeight.value * totalSlots, [totalSlots]);
  const disableWidth = useDerivedValue(() => diffDays * columnWidth, [columnWidth, diffDays]);
  const positionStyle = useMemo(() => position === 'left' ? {
    left: 0
  } : {
    right: 0
  }, [position]);
  return /*#__PURE__*/React.createElement(View, {
    style: [styles.outOfRange, positionStyle, {
      backgroundColor: disableBackgroundColor,
      width: diffDays * columnWidth
    }]
  }, renderCustomOutOfRange && renderCustomOutOfRange({
    width: disableWidth,
    height: disableHeight
  }));
};
export default OutOfRangeView;
const styles = StyleSheet.create({
  outOfRange: {
    position: 'absolute',
    height: '100%'
  }
});
//# sourceMappingURL=OutOfRangeView.js.map