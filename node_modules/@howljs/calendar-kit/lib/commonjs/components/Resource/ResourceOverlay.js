"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _constants = require("../../constants");
var _BodyContext = require("../../context/BodyContext");
var _ResourceDraggableEvent = require("./ResourceDraggableEvent");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ResourceOverlay = ({
  totalSize,
  resources,
  renderDraggableEvent
}) => {
  const {
    spaceFromTop
  } = (0, _BodyContext.useBody)();
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "box-none",
    style: [styles.absolute, {
      top: _constants.EXTRA_HEIGHT + spaceFromTop
    }, styles.dragContainer]
  }, /*#__PURE__*/_react.default.createElement(_ResourceDraggableEvent.DraggableEventResource, {
    resources: resources,
    totalSize: totalSize,
    renderDraggableEvent: renderDraggableEvent
  }));
};
var _default = exports.default = ResourceOverlay;
const styles = _reactNative.StyleSheet.create({
  absolute: {
    position: 'absolute'
  },
  dragContainer: {
    flex: 1
  }
});
//# sourceMappingURL=ResourceOverlay.js.map