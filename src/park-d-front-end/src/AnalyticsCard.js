import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const AnalyticsCard = (props) => {
  let { total, available, parkingType } = props;

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{parkingType}</Card.Title>
        <Card.Subtitle className="mb-2">{available}</Card.Subtitle>
        <Card.Text>out of {total}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AnalyticsCard;