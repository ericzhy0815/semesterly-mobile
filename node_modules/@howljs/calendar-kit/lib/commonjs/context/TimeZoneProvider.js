"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTimezone = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const TimezoneContext = /*#__PURE__*/_react.default.createContext(undefined);
const TimezoneProvider = ({
  children,
  timeZone
}) => {
  const value = (0, _react.useMemo)(() => ({
    timeZone
  }), [timeZone]);
  return /*#__PURE__*/_react.default.createElement(TimezoneContext.Provider, {
    value: value
  }, children);
};
var _default = exports.default = TimezoneProvider;
const useTimezone = () => {
  const context = _react.default.useContext(TimezoneContext);
  if (context === undefined) {
    throw new Error('TimeZoneContext is not available');
  }
  return context;
};
exports.useTimezone = useTimezone;
//# sourceMappingURL=TimeZoneProvider.js.map