import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => (
  <>
    <NavBar />
    <main className="container">
      {loading ? (
        <p role="status">Đang tải câu hỏi...</p>
      ) : error ? (
        <p role="alert">Không tải được câu hỏi.</p>
      ) : (
        <Outlet />
      )}
    </main>
  </>
);

export default Layout;
