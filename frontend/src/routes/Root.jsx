import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Header, Footer, ChatBox } from '../components';

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
    )
}
