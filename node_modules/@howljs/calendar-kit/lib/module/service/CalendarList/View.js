import * as React from 'react';
import { Platform, View as RNView } from 'react-native';
const RCTView = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement('RCTView', {
    ...props,
    ref
  });
});
RCTView.displayName = 'RCTView';
export const View = Platform.OS === 'android' || Platform.OS === 'ios' ? RCTView : RNView;
//# sourceMappingURL=View.js.map