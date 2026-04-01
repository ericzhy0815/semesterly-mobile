import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useHeader } from '../context/DayBarContext';
const HeaderResourceItem = ({
  resources
}) => {
  const {
    columnWidth,
    resourcePerPage
  } = useHeader();
  const renderItem = useCallback(resource => {
    return /*#__PURE__*/React.createElement(View, {
      key: resource.id,
      style: {
        width: columnWidth / resourcePerPage,
        backgroundColor: '#ccc',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement(Text, null, resource.title));
  }, [columnWidth, resourcePerPage]);
  return /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      flexDirection: 'row'
    }
  }, resources.map(renderItem));
};
export default HeaderResourceItem;
//# sourceMappingURL=HeaderResourceItem.js.map