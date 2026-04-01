"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceContainer = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResourceContainer = exports.ResourceContainer = /*#__PURE__*/_react.default.memo(({
  resources,
  renderItem,
  itemSize,
  visibleRange,
  totalSize,
  resourcePerPage,
  getItemPosition
}) => {
  const renderItems = (0, _react.useMemo)(() => {
    const items = [];
    if (!resources) {
      return items;
    }
    const firstVisiblePosition = getItemPosition(visibleRange.start);
    const pageCount = Math.ceil(resources.length / resourcePerPage);
    for (let pageIndex = visibleRange.start; pageIndex <= Math.min(visibleRange.end, pageCount - 1); pageIndex++) {
      const startIndex = pageIndex * resourcePerPage;
      const endIndex = Math.min(startIndex + resourcePerPage, resources.length);
      const pageResources = resources.slice(startIndex, endIndex);
      if (pageResources.length > 0) {
        const absolutePosition = getItemPosition(pageIndex);
        const relativePosition = absolutePosition - firstVisiblePosition;
        const key = `page-${pageIndex}`;
        items.push(/*#__PURE__*/_react.default.createElement(_reactNative.View, {
          key: key,
          style: {
            position: 'absolute',
            left: relativePosition,
            width: itemSize,
            height: '100%'
          }
        }, renderItem({
          items: pageResources,
          index: pageIndex
        })));
      }
    }
    return items;
  }, [visibleRange.start, visibleRange.end, resources, resourcePerPage, getItemPosition, itemSize, renderItem]);
  const firstVisiblePosition = visibleRange.start > 0 ? getItemPosition(visibleRange.start) : 0;
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
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
ResourceContainer.displayName = 'ResourceContainer';
//# sourceMappingURL=ResourceContainers.js.map