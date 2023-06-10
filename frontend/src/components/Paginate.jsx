import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Paginate({ pages, page, path, args = {}, className = '' }) {
  const navigate = useNavigate(); // Hook from react-router-dom for navigation

  const goto = (page) => {
    const query = new URLSearchParams({ ...args, page }); // Create URL search parameters with updated page value
    navigate({
      pathname: path, // Set the pathname for navigation
      search: query.toString() // Set the search query string for navigation
    });
  };

  return (
    pages > 1 && ( // Render pagination only if there are multiple pages
      <Pagination className={className}>
        {[...Array(pages).keys()].map(
          (
            x // Generate pagination items for each page
          ) => (
            <Pagination.Item active={x + 1 === page} key={x + 1} onClick={() => goto(x + 1)}>
              {x + 1} {/* Page number */}
            </Pagination.Item>
          )
        )}
      </Pagination>
    )
  );
}

export default Paginate;
