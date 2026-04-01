"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLayout = exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _constants = require("../constants");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const LayoutContext = /*#__PURE__*/(0, _react.createContext)(_constants.DEFAULT_SIZE);
const LayoutProvider = ({
  children
}) => {
  const [layout, setLayout] = (0, _react.useState)(_constants.DEFAULT_SIZE);
  const timerRef = (0, _react.useRef)(undefined);
  const onLayout = (0, _react.useCallback)(event => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const {
      width,
      height
    } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) {
      return;
    }
    timerRef.current = setTimeout(() => {
      setLayout({
        width,
        height
      });
    }, _constants.DEBOUNCE_TIME);
  }, []);
  const value = (0, _react.useMemo)(() => ({
    width: layout.width,
    height: layout.height
  }), [layout.height, layout.width]);
  const isValidLayout = layout.width > 0 && layout.height > 0;
  return /*#__PURE__*/_react.default.createElement(LayoutContext.Provider, {
    value: value
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureHandlerRootView, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.flex,
    onLayout: onLayout
  }, isValidLayout ? children : null)));
};
var _default = exports.default = LayoutProvider;
const useLayout = () => {
  const value = _react.default.useContext(LayoutContext);
  if (!value) {
    throw new Error('useLayout must be called from within LayoutProvider!');
  }
  return value;
};
exports.useLayout = useLayout;
const styles = _reactNative.StyleSheet.create({
  flex: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=LayoutProvider.js.map