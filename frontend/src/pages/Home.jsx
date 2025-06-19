import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <h1>Bun venit!</h1>
      <p>Te rugăm să te autentifici sau să creezi un cont.</p>
      <div className="button-group">
        <Link to="/login">
          <button className="btn">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-outline">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
