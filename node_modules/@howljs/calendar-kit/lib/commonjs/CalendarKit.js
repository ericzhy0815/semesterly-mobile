"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _CalendarBody = _interopRequireDefault(require("./CalendarBody"));
var _CalendarContainer = _interopRequireDefault(require("./CalendarContainer"));
var _CalendarHeader = _interopRequireDefault(require("./CalendarHeader"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CalendarKit = (props, ref) => {
  const {
    hourFormat,
    renderHour,
    showNowIndicator,
    showTimeColumnRightLine,
    dayBarHeight,
    renderCustomOutOfRange,
    renderCustomUnavailableHour,
    renderEvent,
    renderDraggableEvent,
    renderDraggingEvent,
    renderDraggingHour,
    renderExpandIcon,
    renderHeaderItem,
    NowIndicatorComponent,
    LeftAreaComponent,
    headerBottomHeight,
    collapsedItems,
    eventMaxMinutes,
    eventInitialMinutes,
    eventMinMinutes,
    renderCustomHorizontalLine,
    ...rest
  } = props;
  const dayBarProps = {
    dayBarHeight,
    renderHeaderItem,
    renderExpandIcon,
    renderEvent,
    LeftAreaComponent,
    headerBottomHeight,
    collapsedItems,
    eventMaxMinutes,
    eventInitialMinutes,
    eventMinMinutes
  };
  const bodyProps = {
    hourFormat,
    renderHour,
    renderDraggingHour,
    showNowIndicator,
    showTimeColumnRightLine,
    renderCustomOutOfRange,
    renderCustomUnavailableHour,
    renderEvent,
    renderDraggableEvent,
    renderDraggingEvent,
    NowIndicatorComponent,
    renderCustomHorizontalLine
  };
  return /*#__PURE__*/_react.default.createElement(_CalendarContainer.default, _extends({}, rest, {
    ref: ref
  }), /*#__PURE__*/_react.default.createElement(_CalendarHeader.default, dayBarProps), /*#__PURE__*/_react.default.createElement(_CalendarBody.default, bodyProps));
};
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(CalendarKit);
//# sourceMappingURL=CalendarKit.js.map