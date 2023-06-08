import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Loader, Message, Paginate } from '../components'
import { useListProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../features'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function ProductListPage() {
    const navigate = useNavigate()

    const [searchParams] = useSearchParams()
    const keyword = searchParams.get('keyword') || ''
    const page = searchParams.get('page') || 1

    const { data, isLoading, isError, error } = useListProductsQuery({ search: keyword, page, orderBy: 'createdAt' })
    const [deleteProduct, { isLoading: isLoadingDelete, isError: isErrorDelete, isSuccess: isSuccessDelete, error: errorDelete }] = useDeleteProductMutation()
    const [createProduct, { data: dataCreate, isLoading: isLoadingCreate, isError: isErrorCreate, isSuccess: isSuccessCreate, error: errorCreate, data: createdProduct }] = useCreateProductMutation()
    const { user } = useSelector(state => state.userState)

    useEffect(() => {
        if (!user.isAdmin) {
            navigate('/login')
        }

        if (isSuccessCreate) {
            navigate(`/admin/product/${dataCreate._id}/edit`)
        }
    }, [history, user, isSuccessCreate, dataCreate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
        }
    }

    const createProductHandler = () => {
        createProduct({
            "name": "Sample name",
                "category": "Sample category",
            "brand": "Sample brand",
            "price": 0,
        })
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
            {isErrorDelete && <Message variant='danger'>{errorDelete.data?.detail}</Message>}


            {isLoadingCreate && <Loader />}
            {isErrorCreate && <Message variant='danger'>{errorCreate.data?.detail}</Message>}

            {isLoading
                ? (<Loader />)
                : isError
                    ? (<Message variant='danger'>{error.data?.detail || "Error"}</Message>)
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
                            <Paginate pages={data.pages} page={data.page} path={`/admin/productlist/`} />
                        </div>
                    )}
        </div>
    )
}
