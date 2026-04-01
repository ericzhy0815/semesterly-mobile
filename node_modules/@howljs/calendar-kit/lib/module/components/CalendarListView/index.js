function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useCallback, useMemo } from 'react';
import { CalendarList } from '../../service/CalendarList';
const MAX_OFFSETS = 180537;
const CalendarListView = /*#__PURE__*/forwardRef((props, ref) => {
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
  const _renderItem = useCallback(({
    item
  }) => renderItem(item, extraData), [renderItem, extraData]);
  const baseOffsets = useMemo(() => {
    if (!snapToInterval || !width) {
      return undefined;
    }
    return Array.from({
      length: columnsPerPage
    }, (_, col) => col * snapToInterval);
  }, [columnsPerPage, snapToInterval, width]);
  const _snapToOffsets = useMemo(() => {
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
  const keyExtractor = useCallback(item => item.toString(), []);
  return /*#__PURE__*/React.createElement(CalendarList, _extends({
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
export default /*#__PURE__*/React.memo(CalendarListView);
//# sourceMappingURL=index.js.map