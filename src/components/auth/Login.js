import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const auth = getAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      await signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value);

      navigate("/");
    } catch (error) {
      setError("Failed to log in: " + error.message);
    }

    setLoading(false);
  }

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background: linear-gradient(to top, #06dfc4, #abf9bd); // Update the gradient colors
          }

          .center-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }

          .content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .logo {
            width: 225px;
            margin-bottom: 10px;
          }

          .form-container {
            width: 100%;
            max-width: 400px; /* Adjust the max-width as needed */
          }

          .name-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #003e64;
            margin-bottom: 15px;
          }
          
          .name{
            white-space: nowrap;
            margin-bottom: 10px;
          }

          @media (max-width: 600px) {
            .form-container {
              max-width: 100%;
            }
          }
        `}
      </style>

      <Container className="center-container">
        <Card style={{ width: "90%" }}>
          <Card.Body style={{ padding: "20px" }}>
            <div className="content-container">
              <div className="logo-container">
                <div className="logo">
                  <img src="/logo512.png" alt="Logo" style={{ width: "100%" }} />
                  <div className="name-container">
                    <h3 className="name">AccessiBus</h3>
                    <h6 className="name">Ensuring accessible bus travel for everyone</h6>
                  </div>
                </div>
              </div>
              <div className="form-container">
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" ref={passwordRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100 mt-3" type="submit">
                    Log In
                  </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <div className="w-100 text-center mt-2">
                  Need an account? <Link to="/signup">Sign Up</Link>
                </div>
                <div className="w-100 text-center mt-2">
                  Sign in later <Link to="/">Home</Link>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
