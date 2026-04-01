import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { runOnJS, useAnimatedReaction, useAnimatedRef, useScrollViewOffset } from 'react-native-reanimated';
import { ResourceContainer } from './ResourceContainers';
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const ResourceListView = /*#__PURE__*/forwardRef(({
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
  const [viewportWidth, setViewportWidth] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollTimeoutRef = useRef(null);
  const count = Math.ceil(((resources === null || resources === void 0 ? void 0 : resources.length) ?? 0) / resourcePerPage);
  const totalSize = ((resources === null || resources === void 0 ? void 0 : resources.length) ?? 0) * (width / resourcePerPage);
  const snapToInterval = width / resourcePerPage;
  const visibleRange = useMemo(() => {
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
  const animScrollRef = useAnimatedRef();
  const scrollOffsetAnim = useScrollViewOffset(animScrollRef);
  const throttledSetScrollOffset = useCallback(offset => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setScrollOffset(offset);
    }, 16);
  }, []);
  useAnimatedReaction(() => scrollOffsetAnim.value, offset => {
    runOnJS(throttledSetScrollOffset)(offset);
  });
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  const handleLayout = useCallback(event => {
    const {
      width: viewWidth
    } = event.nativeEvent.layout;
    setViewportWidth(viewWidth);
  }, []);
  const getItemPosition = useCallback(index => {
    return index * width;
  }, [width]);
  return /*#__PURE__*/React.createElement(AnimatedScrollView, {
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
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      width: totalSize,
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(ResourceContainer, {
    resources: resources,
    resourcePerPage: resourcePerPage,
    itemSize: width,
    visibleRange: visibleRange,
    totalSize: totalSize,
    getItemPosition: getItemPosition,
    renderItem: renderItem
  }), !!renderOverlay && /*#__PURE__*/React.createElement(View, {
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
export default ResourceListView;
//# sourceMappingURL=ResourceListView.js.map