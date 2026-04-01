"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useNowIndicator = exports.default = void 0;
var _luxon = require("luxon");
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = require("react-native-reanimated");
var _constants = require("../constants");
var _useLazyRef = _interopRequireDefault(require("../hooks/useLazyRef"));
var _dateUtils = require("../utils/dateUtils");
var _TimeZoneProvider = require("./TimeZoneProvider");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const NowIndicatorContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const getCurrentDatetime = timeZone => {
  const now = (0, _dateUtils.forceUpdateZone)(_luxon.DateTime.now().setZone(timeZone));
  const dateInMs = now.startOf('day').toMillis();
  return {
    date: dateInMs,
    time: now.hour * 60 + now.minute
  };
};
const NowIndicatorProvider = ({
  children
}) => {
  const {
    timeZone
  } = (0, _TimeZoneProvider.useTimezone)();
  const nowRef = (0, _useLazyRef.default)(() => getCurrentDatetime(timeZone));
  const [currentDateUnix, setCurrentDateUnix] = (0, _react.useState)(nowRef.current.date);
  const currentTime = (0, _reactNativeReanimated.useSharedValue)(nowRef.current.time);
  const timerRef = (0, _react.useRef)(undefined);
  const appState = (0, _react.useRef)(_reactNative.AppState.currentState);
  const appStateListener = (0, _react.useRef)(undefined);
  const stopTimer = (0, _react.useCallback)(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);
  const updateTime = (0, _react.useCallback)(() => {
    stopTimer();
    const current = getCurrentDatetime(timeZone);
    setCurrentDateUnix(prev => {
      const diffMsSeconds = current.date - prev;
      const isSameDay = diffMsSeconds >= 0 && diffMsSeconds < _constants.MILLISECONDS_IN_DAY;
      if (isSameDay) {
        return prev;
      }
      return current.date;
    });
    currentTime.value = (0, _reactNativeReanimated.withTiming)(current.time);
    const nextSeconds = 60 - _luxon.DateTime.now().second;
    timerRef.current = setTimeout(updateTime, nextSeconds * 1000);
  }, [currentTime, stopTimer, timeZone]);
  const handleAppStateChange = (0, _react.useCallback)(nextAppState => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      updateTime();
    } else {
      stopTimer();
    }
    appState.current = nextAppState;
  }, [stopTimer, updateTime]);
  (0, _react.useEffect)(() => {
    updateTime();
    appStateListener.current = _reactNative.AppState.addEventListener('change', handleAppStateChange);
    return () => {
      var _appStateListener$cur;
      stopTimer();
      (_appStateListener$cur = appStateListener.current) === null || _appStateListener$cur === void 0 || _appStateListener$cur.remove();
    };
  }, [handleAppStateChange, stopTimer, updateTime]);
  const value = (0, _react.useMemo)(() => ({
    currentTime,
    currentDateUnix
  }), [currentDateUnix, currentTime]);
  return /*#__PURE__*/_react.default.createElement(NowIndicatorContext.Provider, {
    value: value
  }, children);
};
var _default = exports.default = NowIndicatorProvider;
const useNowIndicator = () => {
  const value = (0, _react.useContext)(NowIndicatorContext);
  if (!value) {
    throw new Error('useNowIndicator must be called from within NowIndicatorContext!');
  }
  return value;
};
exports.useNowIndicator = useNowIndicator;
//# sourceMappingURL=NowIndicatorProvider.js.map