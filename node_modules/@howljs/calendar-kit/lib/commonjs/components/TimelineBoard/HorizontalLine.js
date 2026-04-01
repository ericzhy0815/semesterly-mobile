"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const HorizontalLine = ({
  index,
  borderColor,
  totalSlots,
  renderCustomHorizontalLine
}) => {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
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
var _default = exports.default = HorizontalLine;
const styles = _reactNative.StyleSheet.create({
  horizontalLine: {
    position: 'absolute',
    width: '100%',
    height: 1
  }
});
//# sourceMappingURL=HorizontalLine.js.map