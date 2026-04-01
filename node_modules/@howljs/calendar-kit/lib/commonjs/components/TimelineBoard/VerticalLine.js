"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const VerticalLine = ({
  index,
  borderColor,
  columnWidth,
  childColumns
}) => {
  const eventWidth = childColumns > 1 ? columnWidth / childColumns : columnWidth;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "box-none",
    style: [styles.verticalLine, {
      backgroundColor: borderColor,
      left: index * eventWidth
    }]
  });
};
var _default = exports.default = VerticalLine;
const styles = _reactNative.StyleSheet.create({
  verticalLine: {
    position: 'absolute',
    width: 1,
    backgroundColor: 'grey',
    height: '100%'
  }
});
//# sourceMappingURL=VerticalLine.js.map