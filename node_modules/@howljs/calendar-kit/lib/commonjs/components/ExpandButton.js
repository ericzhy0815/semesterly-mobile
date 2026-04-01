"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _ThemeProvider = require("../context/ThemeProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const ExpandButton = ({
  isExpanded,
  isShowExpandButton,
  containerStyle,
  renderExpandIcon
}) => {
  const borderColor = (0, _ThemeProvider.useTheme)((0, _react.useCallback)(({
    colors
  }) => colors.border, []));
  const animStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      display: isShowExpandButton.value ? 'flex' : 'none'
    };
  });
  const iconRotate = (0, _reactNativeReanimated.useDerivedValue)(() => {
    return (0, _reactNativeReanimated.withTiming)(isExpanded.value ? 180 : 0, {
      duration: 350
    });
  });
  const expandIcon = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        rotate: `${iconRotate.value}deg`
      }]
    };
  });
  const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
  };
  const _renderExpandIcon = () => {
    if (renderExpandIcon) {
      return renderExpandIcon({
        isExpanded
      });
    }
    return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
      style: [styles.expandIcon, expandIcon]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.chevron, styles.chevronLeft, {
        backgroundColor: borderColor
      }]
    }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: [styles.chevron, styles.chevronRight, {
        backgroundColor: borderColor
      }]
    }));
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.btnContainer, containerStyle, animStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
    hitSlop: 8,
    onPress: toggleExpand,
    activeOpacity: 0.6
  }, _renderExpandIcon()));
};
var _default = exports.default = ExpandButton;
const styles = _reactNative.StyleSheet.create({
  btnContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  expandIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chevron: {
    position: 'absolute',
    width: 11,
    height: 2,
    borderRadius: 3
  },
  chevronLeft: {
    left: 1,
    transform: [{
      rotate: '40deg'
    }]
  },
  chevronRight: {
    right: 1,
    transform: [{
      rotate: '-40deg'
    }]
  }
});
//# sourceMappingURL=ExpandButton.js.map