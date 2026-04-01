import React from 'react';
import { StyleSheet, View } from 'react-native';
const HorizontalLine = ({
  index,
  borderColor,
  totalSlots,
  renderCustomHorizontalLine
}) => {
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: [styles.horizontalLine, !renderCustomHorizontalLine ? {
      backgroundColor: borderColor
    } : {}, {
      top: `${index / totalSlots * 100}%`
    }]
  }, renderCustomHorizontalLine === null || renderCustomHorizontalLine === void 0 ? void 0 : renderCustomHorizontalLine({
    index,
    borderColor
  }));
};
export default HorizontalLine;
const styles = StyleSheet.create({
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1
  }
});
//# sourceMappingURL=HorizontalLine.js.map