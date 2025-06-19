import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Refolosim stilurile moderne

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        setSuccess(null);
        return;
      }

      setError(null);
      setSuccess("Registration successful! Redirecting to login...");
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Network error");
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Create Account</h1>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="submit-button">Register</button>

        {error && <p className="error-text">{error}</p>}
        {success && <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>{success}</p>}
      </form>
    </div>
  );
}

export default Register;
