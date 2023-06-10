import { Spinner } from 'react-bootstrap';

function Loader() {
  return (
    <Spinner
      animation="border" // Animation style of the spinner (border)
      role="status"
      style={{
        height: '100px', // Height of the spinner
        width: '100px', // Width of the spinner
        margin: 'auto', // Center the spinner horizontally
        display: 'block' // Display the spinner as a block element
      }}
    >
      <span className="sr-only">Loading...</span> {/* Screen reader text */}
    </Spinner>
  );
}

export default Loader;
