"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _DayBarContext = require("../context/DayBarContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const HeaderResourceItem = ({
  resources
}) => {
  const {
    columnWidth,
    resourcePerPage
  } = (0, _DayBarContext.useHeader)();
  const renderItem = (0, _react.useCallback)(resource => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: resource.id,
      style: {
        width: columnWidth / resourcePerPage,
        backgroundColor: '#ccc',
        height: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, resource.title));
  }, [columnWidth, resourcePerPage]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: {
      flex: 1,
      flexDirection: 'row'
    }
  }, resources.map(renderItem));
};
var _default = exports.default = HeaderResourceItem;
//# sourceMappingURL=HeaderResourceItem.js.map