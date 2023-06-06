import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import queryString from 'query-string';
import { useListUsersQuery, useDeleteUserMutation } from '../features/user'

function UserListScreen({ history }) {
    const { page = 1 } = queryString.parse(history.location.search)

    const { data, isLoading, isError, error, refetch } = useListUsersQuery(page)
    const { user } = useSelector(state => state.userState)
    const [deleteUser, { isLoading: isLoadingDelete, isError: isErrorDelete, error: errorDelete, isSuccess: successDelete }] = useDeleteUserMutation()

    useEffect(() => {
        if (!(user && user.isAdmin)) {
            history.push('/login')
        }
        if (successDelete) {
            refetch()
        }
    }, [history, user, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteUser(id)
        }
    }

    return (
        <div>
            <h1>Users</h1>
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
                                        <th>EMAIL</th>
                                        <th>ADMIN</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.isAdmin ? (
                                                <i className='fas fa-check' style={{ color: 'green' }}></i>
                                            ) : (
                                                    <i className='fas fa-check' style={{ color: 'red' }}></i>
                                                )}</td>

                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>

                                                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
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

export default UserListScreen
