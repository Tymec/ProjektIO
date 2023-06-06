import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import queryString from 'query-string';
import { useListProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../features/product'

function ProductListScreen({ history, match }) {
    const { keyword = '', page = 1 } = queryString.parse(history.location.search)

    const { data, isLoading, isError, error } = useListProductsQuery({ search: keyword, page, orderBy: 'createdAt' })
    const [deleteProduct, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete }] = useDeleteProductMutation()
    const [createProduct, { data: dataCreate, isLoading: isLoadingCreate, isError: isErrorCreate, isSuccess: isSuccessCreate, error: errorCreate, data: createdProduct }] = useCreateProductMutation()
    const { user } = useSelector(state => state.userState)

    useEffect(() => {
        if (!user.isAdmin) {
            history.push('/login')
        }

        if (isSuccessCreate) {
            history.push(`/admin/product/${dataCreate._id}/edit`)
        }
    }, [history, user, isSuccessCreate, dataCreate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
        }
    }

    const createProductHandler = () => {
        createProduct()
    }

    return (
        <div>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>

                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>

            {isLoadingDelete && <Loader />}
            {isErrorDelete && <Message variant='danger'>{errorDelete}</Message>}


            {isLoadingCreate && <Loader />}
            {isErrorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {isLoading
                ? (<Loader />)
                : isError
                    ? (<Message variant='danger'>{error}</Message>)
                    : (
                        <div>
                            <Table striped bordered hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>PRICE</th>
                                        <th>CATEGORY</th>
                                        <th>BRAND</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>

                                            <td>
                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>

                                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
                        </div>
                    )}
        </div>
    )
}

export default ProductListScreen
