import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { useUpdateUserMutation, useGetUserQuery } from '../features/user'

function UserEditScreen({ match, history }) {
    const userId = match.params.id

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const { data: user, isLoading, isError, error, refetch } = useGetUserQuery(userId)
    const [updateUser, { isLoading: isUpdateLoading, isError: isUpdateError, isSuccess: isUpdateSuccess, error: updateError }] = useUpdateUserMutation()

    useEffect(() => {
        if (isUpdateSuccess) {
            history.push('/admin/userlist')
        } else {
            if (!user || user._id !== userId) {
                refetch()
            } else {
                setFirstName(user.firstName)
                setLastName(user.lastName)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
        }

    }, [user, isUpdateSuccess, history, refetch])

    const submitHandler = (e) => {
        e.preventDefault()
        updateUser({ _id: user._id, firstName, lastName, email, isAdmin })
    }

    return (
        <div>
            <Link to='/admin/userlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit User</h1>
                {isUpdateLoading && <Loader />}
                {isUpdateError && <Message variant='danger'>{updateError}</Message>}

                {isLoading ? <Loader /> : isError ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='firstName'>
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    type='firstName'
                                    placeholder='Enter name'
                                    autoComplete='firstName'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='lastName'>
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    type='lastName'
                                    placeholder='Enter last name'
                                    autoComplete='lastName'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='isadmin'>
                                <Form.Check
                                    type='checkbox'
                                    label='Is Admin'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                >
                                </Form.Check>
                            </Form.Group>

                            <Button type='submit' variant='primary'>
                                Update
                        </Button>

                        </Form>
                    )}

            </FormContainer >
        </div>

    )
}

export default UserEditScreen
