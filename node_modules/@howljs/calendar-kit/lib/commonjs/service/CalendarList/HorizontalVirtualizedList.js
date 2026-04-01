"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HorizontalVirtualizedList = void 0;
var _react = _interopRequireWildcard(require("react"));
var _View = require("./View");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const HorizontalVirtualizedList = exports.HorizontalVirtualizedList = /*#__PURE__*/_react.default.memo(({
  count,
  renderItem,
  keyExtractor,
  itemSize,
  visibleRange,
  totalSize,
  getItemPosition
}) => {
  const renderItems = (0, _react.useMemo)(() => {
    const items = [];
    const firstVisiblePosition = getItemPosition(visibleRange.start);
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (i < count) {
        const key = keyExtractor(i, i);
        const absolutePosition = getItemPosition(i);
        const relativePosition = Math.round(absolutePosition - firstVisiblePosition);
        items.push(/*#__PURE__*/_react.default.createElement(_View.View, {
          key: key,
          style: {
            position: 'absolute',
            left: relativePosition,
            width: itemSize,
            height: '100%'
          }
        }, renderItem({
          item: i,
          index: i
        })));
      }
    }
    return items;
  }, [visibleRange.start, visibleRange.end, count, keyExtractor, getItemPosition, renderItem, itemSize]);
  const firstVisiblePosition = visibleRange.start > 0 ? getItemPosition(visibleRange.start) : 0;
  return /*#__PURE__*/_react.default.createElement(_View.View, {
    style: {
      position: 'relative',
      width: totalSize,
      height: '100%',
      transform: [{
        translateX: firstVisiblePosition
      }]
    }
  }, renderItems);
});
HorizontalVirtualizedList.displayName = 'HorizontalVirtualizedList';
//# sourceMappingURL=HorizontalVirtualizedList.js.map