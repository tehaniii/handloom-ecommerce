import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination className="justify-content-center my-3">
        {[...Array(pages).keys()].map((x) => {
          const pageNum = x + 1;
          const path = !isAdmin
            ? keyword
              ? `/search/${keyword}/page/${pageNum}`
              : `/page/${pageNum}`
            : `/admin/productlist/page/${pageNum}`;

          return (
            <LinkContainer to={path} key={pageNum}>
              <Pagination.Item active={pageNum === Number(page)}>
                {pageNum}
              </Pagination.Item>
            </LinkContainer>
          );
        })}
      </Pagination>
    )
  );
};

export default Paginate;
