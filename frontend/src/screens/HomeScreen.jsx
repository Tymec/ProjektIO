import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import queryString from 'query-string';
import { useListProductsQuery } from '../features/product'


function HomeScreen({ history }) {
    const {search, page} = queryString.parse(history.location.search)
    const { data, isLoading, isError, error } = useListProductsQuery({keyword: search, page, orderBy: 'createdAt'})

    return (
        <div>
            {!search && <ProductCarousel />}

            <h1>Latest Products</h1>
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
