import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";

const AnalyticsCard = (props) => {
  let { total, available, parkingType, colour } = props;

  return (
    <Card bg={colour} style={{ width: "10rem" }}>
      <Card.Body>
        <Card.Title className="text-center text-white font-weight-bold">
          {parkingType}
        </Card.Title>
        <Card.Subtitle className="text-center text-white display-1">
          {available}
        </Card.Subtitle>
        <Card.Text className="text-center text-white font-weight-bold">
          out of {total}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AnalyticsCard;
