"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLocale = exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash.merge"));
var _react = _interopRequireWildcard(require("react"));
var _constants = require("../constants");
var _useLazyRef = _interopRequireDefault(require("../hooks/useLazyRef"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const LocaleContext = /*#__PURE__*/_react.default.createContext(undefined);
const LocaleProvider = ({
  initialLocales,
  locale = 'en',
  children
}) => {
  const locales = (0, _useLazyRef.default)(() => (0, _lodash.default)({}, _constants.DEFAULT_LOCALES, initialLocales));
  const localeConfig = (0, _react.useMemo)(() => locales.current[locale] || locales.current.en, [locale, locales]);
  return /*#__PURE__*/_react.default.createElement(LocaleContext.Provider, {
    value: localeConfig
  }, children);
};
var _default = exports.default = LocaleProvider;
const useLocale = () => {
  const locale = _react.default.useContext(LocaleContext);
  if (!locale) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return locale;
};
exports.useLocale = useLocale;
//# sourceMappingURL=LocaleProvider.js.map