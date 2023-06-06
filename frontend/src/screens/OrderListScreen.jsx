import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import queryString from 'query-string';
import { useListOrdersQuery } from '../features/order'

function OrderListScreen({ history }) {
    const { page = 1 } = queryString.parse(history.location.search)
    const { data, isLoading, isError, error, refetch } = useListOrdersQuery({ page })
    const { user } = useSelector(state => state.userState)

    useEffect(() => {
        if (user && user.isAdmin) {
            refetch()
        } else {
            history.push('/login')
        }

    }, [refetch, history, user])

    return (
        <div>
            <h1>Orders</h1>
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
                                        <th>USER</th>
                                        <th>DATE</th>
                                        <th>Total</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.orders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.user && order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>

                                            <td>{order.isPaid ? (
                                                order.paidAt.substring(0, 10)
                                            ) : (
                                                    <i className='fas fa-check' style={{ color: 'red' }}></i>
                                                )}
                                            </td>

                                            <td>{order.isDelivered ? (
                                                order.deliveredAt.substring(0, 10)
                                            ) : (
                                                    <i className='fas fa-check' style={{ color: 'red' }}></i>
                                                )}
                                            </td>

                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        Details
                                                    </Button>
                                                </LinkContainer>


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

export default OrderListScreen
