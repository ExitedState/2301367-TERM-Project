import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const emailRef = useRef();
  const auth = getAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);

      await sendPasswordResetEmail(auth, emailRef.current.value);

      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
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

          .form-container {
            width: 100%;
            max-width: 400px; /* Adjust the max-width as needed */
          }

          .content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
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
              <div className="form-container">
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" ref={emailRef} required />
                  </Form.Group>
                  <Button disabled={loading} className="w-100 mt-3" type="submit">
                    Reset Password
                  </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                  <Link to="/login">Login</Link>
                </div>
                <div className="w-100 text-center mt-2">
                  Need an account? <Link to="/signup">Sign Up</Link>
                </div>
                <div className="w-100 text-center mt-2">
                  Browse as guest  <Link to="/">Home</Link>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
