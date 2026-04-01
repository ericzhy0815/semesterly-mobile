"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _LocaleProvider = require("../context/LocaleProvider");
var _ThemeProvider = require("../context/ThemeProvider");
var _dateUtils = require("../utils/dateUtils");
var _DayBarContext = require("../context/DayBarContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ResourceHeaderItem = ({
  resources,
  startUnix,
  DateComponent,
  renderResource,
  isShowSeparator = true,
  dateFormat = 'yyyy-MM-dd',
  isShowWeekDay = true
}) => {
  const {
    weekDayShort
  } = (0, _LocaleProvider.useLocale)();
  const {
    enableResourceScroll,
    resourcePerPage,
    columnWidth
  } = (0, _DayBarContext.useHeader)();
  const borderColor = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(state => state.headerBorderColor ?? state.colors.border, []));
  const _renderDate = () => {
    const date = (0, _dateUtils.parseDateTime)(startUnix);
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: styles.dateContainer
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: styles.dateText
    }, `${date.toFormat(dateFormat)}`, isShowWeekDay && ` (${weekDayShort[date.weekday % 7]})`));
  };
  const _renderResource = (resource, index) => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      key: resource.id,
      style: [{
        flex: enableResourceScroll ? undefined : 1,
        height: enableResourceScroll ? '100%' : undefined,
        width: enableResourceScroll ? columnWidth / resourcePerPage : undefined
      }]
    }, isShowSeparator && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        width: 1,
        position: 'absolute',
        left: -0.5,
        height: '100%',
        backgroundColor: borderColor
      }
    }), renderResource ? renderResource(resource, index) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.resourceContent, {
        borderColor
      }]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, resource.title)));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.container
  }, DateComponent === null || enableResourceScroll ? null : DateComponent ?? _renderDate(), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.resourceContainer
  }, resources === null || resources === void 0 ? void 0 : resources.map(_renderResource)));
};
var _default = exports.default = ResourceHeaderItem;
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  resourceContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  resourceContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1
  },
  dateContainer: {
    paddingVertical: 4
  },
  dateText: {
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
//# sourceMappingURL=ResourceHeaderItem.js.map