import React, { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
const VisibleDateValueContext = /*#__PURE__*/React.createContext(undefined);
const VisibleDateActionsContext = /*#__PURE__*/React.createContext(undefined);
const VisibleDateProvider = ({
  initialStart,
  children
}, ref) => {
  const [visibleDateUnix, setVisibleDateUnix] = useState(initialStart.current);
  const [debouncedDateUnix, setDebouncedDateUnix] = React.useState(initialStart.current);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedDateUnix(visibleDateUnix);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [visibleDateUnix]);
  const updateVisibleDate = useCallback(date => {
    setVisibleDateUnix(date);
  }, []);
  useImperativeHandle(ref, () => ({
    updateVisibleDate
  }));
  return /*#__PURE__*/React.createElement(VisibleDateActionsContext.Provider, {
    value: updateVisibleDate
  }, /*#__PURE__*/React.createElement(VisibleDateValueContext.Provider, {
    value: debouncedDateUnix
  }, children));
};
export default /*#__PURE__*/forwardRef(VisibleDateProvider);
export const useDateChangedListener = () => {
  const context = useContext(VisibleDateValueContext);
  if (!context) {
    throw new Error('useDateChangedListener must be used within a VisibleDateProvider');
  }
  return context;
};
export const useNotifyDateChanged = () => {
  const context = useContext(VisibleDateActionsContext);
  if (context === undefined) {
    throw new Error('useDateChangeActions must be used within a VisibleDateProvider');
  }
  return context;
};
//# sourceMappingURL=VisibleDateProvider.js.map