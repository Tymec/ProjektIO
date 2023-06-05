import React, { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { Link } from 'react-router-dom'

function Product({ product }) {
    const [dogImage, setDogImage] = useState(''); // State for storing dog image URL

    // Fetch dog image URL when component mounts
    useEffect(() => {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => setDogImage(data.message))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
               <Card.Img src={dogImage || product.image} /> {/* Use dog image if available, otherwise use product image */}
            </Link>

            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as="div">
                    <div className="my-3">
                        <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                    </div>
                </Card.Text>


                <Card.Text as="h3">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
