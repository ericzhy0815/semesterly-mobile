"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTheme = exports.default = exports.ThemeContext = void 0;
var _lodash = _interopRequireDefault(require("lodash.merge"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _constants = require("../constants");
var _useLazyRef = _interopRequireDefault(require("../hooks/useLazyRef"));
var _useSyncExternalStoreWithSelector = require("../hooks/useSyncExternalStoreWithSelector");
var _storeBuilder = require("../storeBuilder");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const ThemeContext = exports.ThemeContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const ThemeProvider = ({
  children,
  theme
}) => {
  const store = (0, _useLazyRef.default)(() => (0, _storeBuilder.createStore)((0, _lodash.default)({}, _constants.DEFAULT_THEME, theme))).current;
  (0, _react.useEffect)(() => {
    const configs = (0, _lodash.default)({}, _constants.DEFAULT_THEME, theme);
    store.setState(configs);
  }, [store, theme]);
  return /*#__PURE__*/_react.default.createElement(ThemeContext.Provider, {
    value: store
  }, /*#__PURE__*/_react.default.createElement(ThemedContainer, {
    children: children
  }));
};
var _default = exports.default = ThemeProvider;
const selectBackground = state => state.colors.background;
const ThemedContainer = ({
  children
}) => {
  const backgroundColor = useTheme(selectBackground);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.container, {
      backgroundColor
    }]
  }, children);
};
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
const useTheme = selector => {
  const theme = (0, _react.useContext)(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const state = (0, _useSyncExternalStoreWithSelector.useSyncExternalStoreWithSelector)(theme.subscribe, theme.getState, selector);
  return state;
};
exports.useTheme = useTheme;
//# sourceMappingURL=ThemeProvider.js.map