"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useNotifyDateChanged = exports.useDateChangedListener = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const VisibleDateValueContext = /*#__PURE__*/_react.default.createContext(undefined);
const VisibleDateActionsContext = /*#__PURE__*/_react.default.createContext(undefined);
const VisibleDateProvider = ({
  initialStart,
  children
}, ref) => {
  const [visibleDateUnix, setVisibleDateUnix] = (0, _react.useState)(initialStart.current);
  const [debouncedDateUnix, setDebouncedDateUnix] = _react.default.useState(initialStart.current);
  (0, _react.useEffect)(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedDateUnix(visibleDateUnix);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [visibleDateUnix]);
  const updateVisibleDate = (0, _react.useCallback)(date => {
    setVisibleDateUnix(date);
  }, []);
  (0, _react.useImperativeHandle)(ref, () => ({
    updateVisibleDate
  }));
  return /*#__PURE__*/_react.default.createElement(VisibleDateActionsContext.Provider, {
    value: updateVisibleDate
  }, /*#__PURE__*/_react.default.createElement(VisibleDateValueContext.Provider, {
    value: debouncedDateUnix
  }, children));
};
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(VisibleDateProvider);
const useDateChangedListener = () => {
  const context = (0, _react.useContext)(VisibleDateValueContext);
  if (!context) {
    throw new Error('useDateChangedListener must be used within a VisibleDateProvider');
  }
  return context;
};
exports.useDateChangedListener = useDateChangedListener;
const useNotifyDateChanged = () => {
  const context = (0, _react.useContext)(VisibleDateActionsContext);
  if (context === undefined) {
    throw new Error('useDateChangeActions must be used within a VisibleDateProvider');
  }
  return context;
};
exports.useNotifyDateChanged = useNotifyDateChanged;
//# sourceMappingURL=VisibleDateProvider.js.map