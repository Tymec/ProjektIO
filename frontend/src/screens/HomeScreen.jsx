import React from 'react'
import { Row, Col, Dropdown } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import queryString from 'query-string';
import { useListProductsQuery } from '../features/product'

function HomeScreen({ history }) {
    const {search, page, orderBy} = queryString.parse(history.location.search)
    const { data, isLoading, isError, error } = useListProductsQuery({keyword: search, page, orderBy})

    const sortOptions = [
        {name: 'Created At', value: 'createdAt'},
        {name: 'Price', value: 'price'},
        {name: 'Rating', value: 'rating'},
        {name: 'Name', value: 'name'},
        {name: 'Number of Reviews', value: 'numReviews'},
        {name: 'Count in Stock', value: 'countInStock'}
    ]

    const handleSortChange = (value) => {
        history.push(`/?${queryString.stringify({keyword: search, page, orderBy: value})}`)
    }

    return (
        <div>
            {!search && <ProductCarousel />}

            <h1>Our Prompts</h1>

            <Dropdown onSelect={handleSortChange}>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Sort By
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {sortOptions.map(option => (
                        <Dropdown.Item href="#" eventKey={option.value}>{option.name}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            {isLoading ? <Loader />
                : isError ? <Message variant='danger'>{error}</Message>
                    :
                    <div>
                        <Row>
                            {data.products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate page={data.page} pages={data.pages} keyword={search} />
                    </div>
            }
        </div>
    )
}

export default HomeScreen
