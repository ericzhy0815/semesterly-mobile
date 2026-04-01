import React from 'react';
import { useUnavailableHoursByDate } from '../../context/UnavailableHoursProvider';
import { useDateChangedListener } from '../../context/VisibleDateProvider';
import { UnavailableHoursByDate } from '../TimelineBoard/UnavailableHours';
import { StyleSheet, View } from 'react-native';
import { useBody } from '../../context/BodyContext';
const UnavailableHoursByResource = ({
  resources
}) => {
  const visibleDateUnix = useDateChangedListener();
  const unavailableHours = useUnavailableHoursByDate(visibleDateUnix);
  const {
    enableResourceScroll,
    resourcePerPage
  } = useBody();
  if (!unavailableHours) {
    return null;
  }
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(UnavailableHoursByDate, {
    currentUnix: visibleDateUnix,
    visibleDateIndex: 0,
    resources: resources,
    widthPercentage: enableResourceScroll ? 1 / resourcePerPage : undefined
  }));
};
export default UnavailableHoursByResource;
//# sourceMappingURL=UnavailableHoursByResource.js.map