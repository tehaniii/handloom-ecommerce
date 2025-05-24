import { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';

import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../slices/productsApiSlice';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { keyword, pageNumber } = useParams();
  const currentPage = pageNumber || 1;

  const [selectedCategory, setSelectedCategory] = useState('');

  const { data, isLoading, error } = useGetProductsQuery({
    keyword: keyword || '',
    pageNumber: currentPage,
    pageSize: 8,
    category: selectedCategory,
  });

  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoryError,
  } = useGetCategoriesQuery();

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // Reset to first page when category changes
    navigate(`/`);
  };

  return (
    <>
      {!keyword && <ProductCarousel />}

      <Meta />
      <h1 className='mb-3'>Latest Products</h1>

      {/* Category Filter */}
      <Row className='mb-4'>
        <Col md={4}>
          <Form.Group controlId='category'>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Control
              as='select'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value=''>All Categories</option>
              {loadingCategories ? (
                <option disabled>Loading...</option>
              ) : categoryError ? (
                <option disabled>Error loading categories</option>
              ) : (
                categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))
              )}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {data.products.length === 0 ? (
            <Message>No products found.</Message>
          ) : (
            <>
              <Row>
                {data.products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword || ''}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
