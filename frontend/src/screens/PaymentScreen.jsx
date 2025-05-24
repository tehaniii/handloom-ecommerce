import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Row, Col, ListGroup, Card } from 'react-bootstrap';

const PaymentScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const order = useSelector((state) => state.orderCreate);
  const orderId = order?.order?._id;

  useEffect(() => {
    if (!orderId) {
      navigate('/placeorder');
    }
  }, [orderId, navigate]);

  const handleStripeCheckout = async () => {
    try {
      const { data } = await axios.post('/api/payments/create-checkout-session', {
        cartItems: cart.cartItems,
        orderId: orderId,
      });

      window.location.href = data.url; // Redirect to Stripe Checkout
    } catch (err) {
      console.error('❌ Stripe Checkout Error:', err.response?.data?.message || err.message);
      alert('There was a problem redirecting to Stripe. Please try again.');
    }
  };

  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Payment</h2>
              <p>Please click below to proceed to Stripe checkout.</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4>Order Summary</h4>
                <p>Total Items: {cart.cartItems.reduce((acc, item) => acc + item.qty, 0)}</p>
                <p>
                  Total Price: $
                  {cart.cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </p>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button type='button' className='btn-block' onClick={handleStripeCheckout}>
                  Pay with Stripe
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PaymentScreen;
