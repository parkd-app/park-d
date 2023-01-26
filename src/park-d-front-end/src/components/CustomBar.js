import React from 'react';
import { Rectangle } from 'recharts';

/*
    This component was written to allow for custom colouring for individual bar graphs.
    The colouring technique is based on the occupancy percentage. The colours progress
    from green to red as occupancy increases.
*/

function CustomBar(props) {
  const { occupancy, total, colours } = props;
  let fill = colours[4];

  const occupancyPercent = occupancy / total;

  if (occupancyPercent < 0.2) fill = colours[0];
  else if (occupancyPercent >= 0.2 && occupancyPercent < 0.4) fill = colours[1];
  else if (occupancyPercent >= 0.4 && occupancyPercent < 0.6) fill = colours[2];
  else if (occupancyPercent >= 0.6 && occupancyPercent <= 0.8) fill = colours[3];

  return <Rectangle {...props} fill={fill} />;
}

export default CustomBar;
