import { render, screen } from '@testing-library/react';

import { FullProviderWrapper } from '../testUtils';

test("should pass", async () => {
  render(<FullProviderWrapper route="/" />);

  screen.debug();
});
