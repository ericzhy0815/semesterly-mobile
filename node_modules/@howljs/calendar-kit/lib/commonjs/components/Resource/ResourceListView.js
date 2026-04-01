"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _ResourceContainers = require("./ResourceContainers");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const AnimatedScrollView = _reactNativeReanimated.default.createAnimatedComponent(_reactNative.ScrollView);
const ResourceListView = /*#__PURE__*/(0, _react.forwardRef)(({
  width,
  height,
  onScroll,
  resources,
  resourcePerPage,
  drawDistance = width * 2,
  renderItem,
  pagingEnabled = false,
  renderOverlay,
  scrollEnabled,
  onTouchStart,
  scrollEventThrottle = 16,
  onWheel
}, ref) => {
  const [viewportWidth, setViewportWidth] = (0, _react.useState)(0);
  const [scrollOffset, setScrollOffset] = (0, _react.useState)(0);
  const scrollTimeoutRef = (0, _react.useRef)(null);
  const count = Math.ceil(((resources === null || resources === void 0 ? void 0 : resources.length) ?? 0) / resourcePerPage);
  const totalSize = ((resources === null || resources === void 0 ? void 0 : resources.length) ?? 0) * (width / resourcePerPage);
  const snapToInterval = width / resourcePerPage;
  const visibleRange = (0, _react.useMemo)(() => {
    if (viewportWidth === 0 || count === 0) {
      return {
        start: 0,
        end: 0
      };
    }
    const buffer = drawDistance;
    const scrollStart = Math.max(0, scrollOffset - buffer);
    const scrollEnd = scrollOffset + viewportWidth + buffer;
    const startIndex = Math.max(0, Math.floor(scrollStart / width));
    const endIndex = Math.min(count - 1, Math.floor(scrollEnd / width));
    return {
      start: startIndex,
      end: endIndex
    };
  }, [count, scrollOffset, viewportWidth, drawDistance, width]);
  const animScrollRef = (0, _reactNativeReanimated.useAnimatedRef)();
  const scrollOffsetAnim = (0, _reactNativeReanimated.useScrollViewOffset)(animScrollRef);
  const throttledSetScrollOffset = (0, _react.useCallback)(offset => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollOffset(offset);
    }, 16);
  }, []);
  (0, _reactNativeReanimated.useAnimatedReaction)(() => scrollOffsetAnim.value, offset => {
    (0, _reactNativeReanimated.runOnJS)(throttledSetScrollOffset)(offset);
  });
  (0, _react.useEffect)(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  const handleLayout = (0, _react.useCallback)(event => {
    const {
      width: viewWidth
    } = event.nativeEvent.layout;
    setViewportWidth(viewWidth);
  }, []);
  const getItemPosition = (0, _react.useCallback)(index => {
    return index * width;
  }, [width]);
  return /*#__PURE__*/_react.default.createElement(AnimatedScrollView, {
    ref: node => {
      if (node) {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        animScrollRef(node);
      }
    },
    horizontal: true,
    onScroll: onScroll,
    onLayout: handleLayout,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    snapToInterval: pagingEnabled ? undefined : snapToInterval,
    pagingEnabled: pagingEnabled,
    disableIntervalMomentum: !pagingEnabled,
    scrollEnabled: scrollEnabled,
    scrollEventThrottle: scrollEventThrottle,
    onTouchStart: onTouchStart,
    onWheel,
    style: {
      height
    }
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      width: totalSize,
      height: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_ResourceContainers.ResourceContainer, {
    resources: resources,
    resourcePerPage: resourcePerPage,
    itemSize: width,
    visibleRange: visibleRange,
    totalSize: totalSize,
    getItemPosition: getItemPosition,
    renderItem: renderItem
  }), !!renderOverlay && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    id: "overlay-view",
    style: [{
      position: 'absolute',
      height,
      width: totalSize,
      zIndex: 999
    }],
    pointerEvents: "box-none"
  }, renderOverlay({
    totalSize,
    resources: resources ?? []
  }))));
});
var _default = exports.default = ResourceListView;
//# sourceMappingURL=ResourceListView.js.map