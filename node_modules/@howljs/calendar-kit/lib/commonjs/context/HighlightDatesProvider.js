"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHighlightDates = exports.default = exports.HighlightDatesContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var _useSyncExternalStoreWithSelector = require("../hooks/useSyncExternalStoreWithSelector");
var _storeBuilder = require("../storeBuilder");
var _dateUtils = require("../utils/dateUtils");
var _useLazyRef = _interopRequireDefault(require("../hooks/useLazyRef"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const HighlightDatesContext = exports.HighlightDatesContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const HighlightDatesProvider = ({
  children,
  highlightDates
}) => {
  const highlightDatesStore = (0, _useLazyRef.default)(() => (0, _storeBuilder.createStore)({
    highlightDates: undefined
  })).current;
  (0, _react.useEffect)(() => {
    highlightDatesStore.setState({
      highlightDates
    });
  }, [highlightDates, highlightDatesStore]);
  return /*#__PURE__*/_react.default.createElement(HighlightDatesContext.Provider, {
    value: highlightDatesStore
  }, children);
};
var _default = exports.default = HighlightDatesProvider;
const useHighlightDates = date => {
  const highlightDatesContext = (0, _react.useContext)(HighlightDatesContext);
  const selectorByDate = (0, _react.useCallback)(state => {
    let data;
    if (!state.highlightDates) {
      return data;
    }
    const dateObj = (0, _dateUtils.parseDateTime)(date);
    const weekDay = dateObj.weekday;
    const dateStr = dateObj.toFormat('yyyy-MM-dd');
    const highlightDatesWeekDay = state.highlightDates[weekDay];
    if (highlightDatesWeekDay) {
      data = highlightDatesWeekDay;
    }
    const highlightDatesByDate = state.highlightDates[dateStr];
    if (highlightDatesByDate) {
      data = highlightDatesByDate;
    }
    return data;
  }, [date]);
  if (!highlightDatesContext) {
    throw new Error('useRegionsByDate must be used within a HighlightDatesProvider');
  }
  const state = (0, _useSyncExternalStoreWithSelector.useSyncExternalStoreWithSelector)(highlightDatesContext.subscribe, highlightDatesContext.getState, selectorByDate);
  return state;
};
exports.useHighlightDates = useHighlightDates;
//# sourceMappingURL=HighlightDatesProvider.js.map