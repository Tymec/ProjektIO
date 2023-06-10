import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { moneyFormat } from '../utils';
import Rating from './Rating';

function Product({ product, rounded = false }) {
  return (
    <Card
      className="my-3"
      style={{
        border: 'none',
        borderRadius: rounded ? '0.5rem 0.5rem 0.5rem 0.5rem' : '0.3rem', // Set border radius based on 'rounded' prop
        height: '100%'
      }}
    >
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            objectPosition: 'right',
            borderRadius: rounded ? '0.5rem 0.5rem 0 0' : '0.3rem 0.3rem 0 0' // Set image border radius based on 'rounded' prop
          }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              color={'#f8e825'}
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">{moneyFormat(product.price)}</Card.Text> {/* Format the product price using the 'moneyFormat' utility function */}
      </Card.Body>
    </Card>
  );
}

export default Product;
