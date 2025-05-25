import { useState } from 'react';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ReviewModerationScreen = () => {
  const [productId, setProductId] = useState('');
  const [reviews, setReviews] = useState([]);
  const [productName, setProductName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [replyComment, setReplyComment] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const fetchReviews = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProductName(data.name);
      const mapped = data.reviews.map((r) => ({
        ...r,
        productName: data.name,
      }));
      setReviews(mapped);
      setLoading(false);
    } catch (err) {
      toast.error('Invalid Product ID or product not found');
      setReviews([]);
      setProductName('');
      setLoading(false);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm('Permanently delete this review?')) {
      try {
        await axios.delete(`/api/products/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Review deleted');
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  const openReplyModal = (reviewId) => {
    setSelectedReviewId(reviewId);
    setReplyComment('');
    setShowModal(true);
  };

  const handleReplySubmit = async () => {
    if (!replyComment.trim()) {
      toast.warning('Reply cannot be empty');
      return;
    }
    try {
      await axios.post(
        `/api/products/reviews/${selectedReviewId}/reply`,
        { comment: replyComment },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success('Reply added');
      setReviews((prev) =>
        prev.map((r) =>
          r._id === selectedReviewId
            ? {
                ...r,
                adminReply: { comment: replyComment, repliedAt: new Date() },
              }
            : r
        )
      );
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to add reply');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (productId.trim()) {
      fetchReviews(productId.trim());
    }
  };

  return (
    <>
      <h1>Review Moderation</h1>
      <Form onSubmit={submitHandler} className='mb-4'>
        <Row className='align-items-center'>
          <Col xs={8} md={6}>
            <Form.Control
              type='text'
              placeholder='Enter Product id'
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </Col>
          <Col xs={4} md={2}>
            <Button type='submit' variant='primary'>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <p>Loading...</p>
      ) : reviews.length > 0 ? (
        <>
          <h5>Showing reviews for: <strong>{productName}</strong></h5>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>Comment</th>
                <th>Rating</th>
                <th>Replied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.name}</td>
                  <td>
                    {review.comment}
                    {review.adminReply?.comment && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px',
                        backgroundColor: '#f9f9f9',
                        borderLeft: '4px solid #0d6efd'
                      }}>
                        <strong>Selyn Support:</strong>{' '}
                        <span>{review.adminReply.comment}</span>
                      </div>
                    )}
                  </td>
                  <td>{review.rating}</td>
                  <td>{review.adminReply?.comment ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant='danger'
                      className='btn-sm me-2'
                      onClick={() => deleteReviewHandler(review._id)}
                    >
                      <FaTrash />
                    </Button>
                    {!review.adminReply?.comment && (
                      <Button
                        variant='secondary'
                        className='btn-sm'
                        onClick={() => openReplyModal(review._id)}
                      >
                        Reply
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        productId && <p>No reviews found for this product.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='replyComment'>
            <Form.Label>Your Reply</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
              placeholder='Write your response as Selyn Support...'
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleReplySubmit}>
            Submit Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewModerationScreen;