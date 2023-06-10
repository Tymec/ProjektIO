import { Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Paginate({ pages, page, path, args = {}, className = '' }) {
  const navigate = useNavigate();

  const goto = (page) => {
    const query = new URLSearchParams({ ...args, page });
    navigate({
      pathname: path,
      search: query.toString()
    });
  };

  return (
    pages > 1 && (
      <Pagination className={className}>
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item active={x + 1 === page} key={x + 1} onClick={() => goto(x + 1)}>
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
}

export default Paginate;
