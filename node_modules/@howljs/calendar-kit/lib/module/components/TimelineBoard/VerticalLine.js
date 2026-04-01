import React from 'react';
import { StyleSheet, View } from 'react-native';
const VerticalLine = ({
  index,
  borderColor,
  columnWidth,
  childColumns
}) => {
  const eventWidth = childColumns > 1 ? columnWidth / childColumns : columnWidth;
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: [styles.verticalLine, {
      backgroundColor: borderColor,
      left: index * eventWidth
    }]
  });
};
export default VerticalLine;
const styles = StyleSheet.create({
  verticalLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'grey',
    height: '100%'
  }
});
//# sourceMappingURL=VerticalLine.js.map