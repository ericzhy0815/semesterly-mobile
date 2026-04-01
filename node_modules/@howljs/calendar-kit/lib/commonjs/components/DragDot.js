"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ThemeProvider = require("../context/ThemeProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const DragDot = () => {
  const primaryColor = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => state.colors.primary, []));
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.dotBackground
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dotBackgroundOverlay, {
      position: undefined,
      backgroundColor: primaryColor
    }]
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.dotInner, {
      backgroundColor: primaryColor
    }]
  }));
};
var _default = exports.default = DragDot;
const styles = _reactNative.StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  dotBackground: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: '#FFF'
  },
  dotBackgroundOverlay: {
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: '#FFF',
    opacity: 0.3
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#FFF'
  }
});
//# sourceMappingURL=DragDot.js.map