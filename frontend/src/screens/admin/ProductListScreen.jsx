import { useState } from 'react';
import { Table, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const currentPage = pageNumber || 1;
  const pageSize = 20;

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber: currentPage,
    pageSize,
  });

  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct] = useCreateProductMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleCreateProduct = async () => {
    try {
      await createProduct();
      refetch();
      toast.success('New product created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setShowCreateModal(false);
  };

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(productToDelete);
      refetch();
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={() => setShowCreateModal(true)}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>In Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${product._id}/edit`}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => {
                        setProductToDelete(product._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}

      {/* Create Product Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Product Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          A new draft product will be created and added to your list. You can edit
          its details afterward. Do you want to continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleCreateProduct}>
            Create Product
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Product Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Product Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will permanently remove the product from your store.
          Are you sure you want to proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleDeleteProduct}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductListScreen;