import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

import { ChatBox, Footer, Header } from '../components';

export default function Root() {
  return (
    <div id="root">
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <ChatBox />
      <Footer />
    </div>
  );
}
