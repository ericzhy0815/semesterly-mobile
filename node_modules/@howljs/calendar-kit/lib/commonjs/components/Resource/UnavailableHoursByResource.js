"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _UnavailableHoursProvider = require("../../context/UnavailableHoursProvider");
var _VisibleDateProvider = require("../../context/VisibleDateProvider");
var _UnavailableHours = require("../TimelineBoard/UnavailableHours");
var _reactNative = require("react-native");
var _BodyContext = require("../../context/BodyContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const UnavailableHoursByResource = ({
  resources
}) => {
  const visibleDateUnix = (0, _VisibleDateProvider.useDateChangedListener)();
  const unavailableHours = (0, _UnavailableHoursProvider.useUnavailableHoursByDate)(visibleDateUnix);
  const {
    enableResourceScroll,
    resourcePerPage
  } = (0, _BodyContext.useBody)();
  if (!unavailableHours) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/_react.default.createElement(_UnavailableHours.UnavailableHoursByDate, {
    currentUnix: visibleDateUnix,
    visibleDateIndex: 0,
    resources: resources,
    widthPercentage: enableResourceScroll ? 1 / resourcePerPage : undefined
  }));
};
var _default = exports.default = UnavailableHoursByResource;
//# sourceMappingURL=UnavailableHoursByResource.js.map