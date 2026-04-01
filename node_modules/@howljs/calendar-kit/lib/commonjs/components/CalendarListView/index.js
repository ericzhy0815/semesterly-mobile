"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _CalendarList = require("../../service/CalendarList");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MAX_OFFSETS = 180537;
const CalendarListView = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const {
    count,
    width,
    height,
    extraData,
    renderItem,
    initialOffset = 0,
    renderAheadItem = 2,
    scrollEventThrottle = 16,
    scrollEnabled,
    animatedRef,
    onScroll,
    snapToInterval,
    // inverted,
    columnsPerPage,
    ...rest
  } = props;
  const _renderItem = (0, _react.useCallback)(({
    item
  }) => renderItem(item, extraData), [renderItem, extraData]);
  const baseOffsets = (0, _react.useMemo)(() => {
    if (!snapToInterval || !width) {
      return undefined;
    }
    return Array.from({
      length: columnsPerPage
    }, (_, col) => col * snapToInterval);
  }, [columnsPerPage, snapToInterval, width]);
  const _snapToOffsets = (0, _react.useMemo)(() => {
    if (!baseOffsets) {
      return undefined;
    }
    const offsets = [];
    for (let page = 0; page < count; page++) {
      offsets.push(...baseOffsets.map(offset => offset + page * width));
    }
    if (offsets.length > MAX_OFFSETS) {
      console.warn('The number of days to display is too large');
    }
    return offsets;
  }, [baseOffsets, count, width]);
  const keyExtractor = (0, _react.useCallback)(item => item.toString(), []);
  return /*#__PURE__*/_react.default.createElement(_CalendarList.CalendarList, _extends({
    ref: ref,
    animatedRef: animatedRef,
    count: count,
    renderItem: _renderItem,
    itemSize: width,
    style: {
      height
    },
    pagingEnabled: !snapToInterval,
    initialOffset: initialOffset,
    snapToOffsets: _snapToOffsets,
    drawDistance: width * renderAheadItem,
    columnsPerPage: columnsPerPage,
    keyExtractor: keyExtractor,
    onScroll: onScroll,
    scrollEventThrottle: scrollEventThrottle,
    scrollEnabled: scrollEnabled
  }, rest));
});
var _default = exports.default = /*#__PURE__*/_react.default.memo(CalendarListView);
//# sourceMappingURL=index.js.map