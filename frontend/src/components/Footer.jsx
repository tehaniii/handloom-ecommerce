import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-dark text-white mt-5'>
      <Container>
        <Row className='py-4 text-center text-md-start'>
          <Col md={4} className='mb-3'>
            <h5 className='text-uppercase'>Selyn</h5>
            <p>
              Handloom with heart. Supporting women and rural communities
              through fair trade and tradition.
            </p>
          </Col>

          <Col md={4} className='mb-3'>
            <h5 className='text-uppercase'>Quick Links</h5>
            <ul className='list-unstyled'>
              <li>
                <Link to='/about' className='text-white text-decoration-none'>
                  About Us
                </Link>
              </li>
              <li>
                <Link to='/' className='text-white text-decoration-none'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/cart' className='text-white text-decoration-none'>
                  Cart
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={4} className='mb-3'>
            <h5 className='text-uppercase'>Contact</h5>
            <p>Email: support@selyn.lk</p>
            <p>Phone: +94 11 123 4567</p>
            <p>Location: Kurunegala, Sri Lanka</p>
          </Col>
        </Row>
        <Row>
          <Col className='text-center pb-3 border-top pt-3'>
            <small>&copy; {currentYear} Selyn | All rights reserved</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

