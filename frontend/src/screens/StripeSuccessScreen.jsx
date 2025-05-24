import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Spinner, Alert, Container } from 'react-bootstrap';

const StripeSuccessScreen = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [error, setError] = useState(null);

  const orderId = new URLSearchParams(search).get('orderId');

  useEffect(() => {
    const updateOrderStatus = async () => {
      if (!orderId) {
        setError('Order ID not found in URL.');
        return;
      }

      try {
        await axios.put(`/api/orders/${orderId}/pay`, {
          id: 'manual-stripe-success',
          status: 'paid',
          email_address: userInfo?.email || 'guest@example.com',
        });

        setTimeout(() => {
          navigate(`/order/${orderId}`);
        }, 2000);
      } catch (err) {
        console.error('❌ Failed to mark order as paid:', err.message);
        setError('Something went wrong while updating order status.');
      }
    };

    updateOrderStatus();
  }, [orderId, navigate, userInfo]);

  return (
    <Container className="text-center mt-5">
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <h2>✅ Payment Successful!</h2>
          <p>Redirecting you to your order summary...</p>
          <Spinner animation="border" role="status" />
        </>
      )}
    </Container>
  );
};

export default StripeSuccessScreen;
