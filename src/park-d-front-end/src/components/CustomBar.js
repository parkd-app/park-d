import { Rectangle } from 'recharts';

{/* 
    This component was written to allow for custom colouring for individual bar graphs.
    The colouring technique is based on the occupancy percentage. The colours progress
    from green to red as occupancy increases.
*/}

const CustomBar = (props) => {
    const {occupancy, total, colours} = props;
    let fill = colours[4];

    let occupancyPercent = occupancy/total;
    
    if (occupancyPercent < 0.2) fill = colours[0];
    else if (0.2 <= occupancyPercent && occupancyPercent < 0.4) fill = colours[1];
    else if (0.4 <= occupancyPercent && occupancyPercent < 0.6) fill = colours[2];
    else if (0.6 <= occupancyPercent && occupancyPercent <= 0.8) fill = colours[3];

    return <Rectangle {...props} fill={fill} />
};

export default CustomBar;