import { Link } from 'react-router-dom';

const NotFound = () => (
  <section>
    <h1>404 - Không tìm thấy trang</h1>
    <Link to="/">Về trang chủ</Link>
  </section>
);

export default NotFound;
