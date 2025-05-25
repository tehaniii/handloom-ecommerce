import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import logoAdmin from '../assets/logo-admin.png';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = userInfo?.isAdmin;

  const navTextStyle = { color: '#fff' };

  const navbarProps = {
    bg: isAdmin ? 'black' : 'light',
    variant: 'dark',
    expand: 'lg',
    collapseOnSelect: true,
  };

  const signInButtonStyle = {
    backgroundColor: '#f76c0f',
    color: '#fff',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '0.5rem',
  };

  return (
    <header>
      <Navbar {...navbarProps}>
        <Container>
          <Navbar.Brand
            as={Link}
            to={isAdmin ? '/admin/dashboard' : '/'}
            className='d-flex align-items-center'
          >
            <img
              src={isAdmin ? logoAdmin : logo}
              alt='Selyn'
              style={{
                height: isAdmin ? '50px' : '90px',
                width: isAdmin ? 'auto' : '170px',
                marginRight: '40px',
                marginLeft: isAdmin ? undefined : '-10px',
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto align-items-center'>
              {isAdmin && (
                <Button
                  size='sm'
                  className='me-3'
                  variant='link'
                  as={Link}
                  to='/admin/dashboard'
                  style={{ color: '#fff', textDecoration: 'none' }}
                >
                  Home
                </Button>
              )}

              {!isAdmin && (
                <>
                  <SearchBox />
                  <Nav.Link
                    as={Link}
                    to='/cart'
                    style={{ color: '#f76c0f' }}
                  >
                    <FaShoppingCart className='mb-1' />
                    Cart
                    {cartItems.length > 0 && (
                      <Badge pill bg='success' text='white' className='ms-1'>
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </>
              )}

              {userInfo ? (
                <NavDropdown
                  title={
                    <span style={{ color: isAdmin ? '#fff' : '#f76c0f' }}>
                      {userInfo.name}
                    </span>
                  }
                  id='username'
                >
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login' style={signInButtonStyle}>
                  <FaUser className='mb-1 me-1' /> Sign In
                </Nav.Link>
              )}

              {isAdmin && (
                <NavDropdown
                  title={<span style={navTextStyle}>Admin</span>}
                  id='adminmenu'
                >
                  <NavDropdown.Item as={Link} to='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orderlist'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/userlist'>
                    Users
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/reviews'>
                    Review Moderation
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
