import { Rectangle } from 'recharts';

const CustomBar = (props) => {

    const {occupancy} = props;
    let fill = '#000';

    const colours = ['#61FF00', '#CCFF00', '#FF8A00', '#FF0000'];
    
    if (occupancy < 4) {
        fill = colours[0];
    } 
    else if (4 <= occupancy && occupancy < 6) {
        fill = colours[1];
    }
    else if (6 <= occupancy && occupancy < 8) {
        fill = colours[2];
    }
    else if (8 <= occupancy && occupancy <= 10) {
        fill = colours[3];
    }

    return <Rectangle {...props} fill={fill} />
};

export default CustomBar;