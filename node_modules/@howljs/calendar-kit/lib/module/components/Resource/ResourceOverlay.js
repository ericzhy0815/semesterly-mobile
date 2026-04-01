import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EXTRA_HEIGHT } from '../../constants';
import { useBody } from '../../context/BodyContext';
import { DraggableEventResource } from './ResourceDraggableEvent';
const ResourceOverlay = ({
  totalSize,
  resources,
  renderDraggableEvent
}) => {
  const {
    spaceFromTop
  } = useBody();
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: [styles.absolute, {
      top: EXTRA_HEIGHT + spaceFromTop
    }, styles.dragContainer]
  }, /*#__PURE__*/React.createElement(DraggableEventResource, {
    resources: resources,
    totalSize: totalSize,
    renderDraggableEvent: renderDraggableEvent
  }));
};
export default ResourceOverlay;
const styles = StyleSheet.create({
  absolute: {
    position: 'absolute'
  },
  dragContainer: {
    flex: 1
  }
});
//# sourceMappingURL=ResourceOverlay.js.map