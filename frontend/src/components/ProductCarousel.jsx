import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='mb-4' variant='dark'>
      {products.map((product) => (
        <Carousel.Item key={product._id} className='text-center bg-light'>
          <Link to={`/product/${product._id}`}>
            <Image
              src={product.image}
              alt={product.name}
              className='d-block mx-auto'
              style={{
                height: '600px',
                objectFit: 'cover',
                width: '100%',
                maxWidth: '1300px',
              }}
              fluid
            />
            <Carousel.Caption className='bg-dark bg-opacity-50 p-3 rounded'>
              <h4 className='text-white'>
                {product.name} (${product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
