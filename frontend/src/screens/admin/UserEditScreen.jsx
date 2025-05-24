import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [createdAt, setCreatedAt] = useState('');

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setCreatedAt(user.createdAt);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
  <Row className="mb-3">
  <Col>
    <div style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', display: 'inline-block' }}>
      <Link to="/admin/userlist">
        <Button variant="outline-secondary" size="sm">
          &larr; Back to User List
        </Button>
      </Link>
    </div>
  </Col>
</Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
<Card
  className="rounded-3"
  style={{
    border: '1px solid #dee2e6',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  }}
>            <Card.Body className="p-4">
              <h3 className="mb-4 text-center text-primary">Edit User</h3>

              {loadingUpdate && <Loader />}
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              ) : (
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="isadmin">
                    <Form.Check
                      type="checkbox"
                      label="Is Admin"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="createdAt">
                    <Form.Label>Registered On</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        createdAt
                          ? new Date(createdAt).toLocaleString()
                          : 'Unavailable'
                      }
                      readOnly
                      plaintext
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-center">
                    <Button type="submit" variant="dark" className="px-5">
                      Update User
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserEditScreen;
