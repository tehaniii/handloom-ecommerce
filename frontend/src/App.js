import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Stripe Imports
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe public key from environment
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  // Check if current route is Stripe payment screen
  const isStripeRoute = location.pathname === '/payment';

  return (
    <>
      <ToastContainer />
      <Header />
      <main className='py-3'>
        <Container>
          {isStripeRoute ? (
            <Elements stripe={stripePromise}>
              <Outlet />
            </Elements>
          ) : (
            <Outlet />
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
