import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const currentPasswordRef = useRef();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPasswordRef.current.value
    );

    try {
      setLoading(true);
      setError("");

      // Reauthenticate the user
      await reauthenticateWithCredential(currentUser, credential);

      const promises = [];
      if (emailRef.current.value !== currentUser.email) {
        promises.push(updateEmail(currentUser, emailRef.current.value));
      }
      if (passwordRef.current.value) {
        promises.push(updatePassword(currentUser, passwordRef.current.value));
      }

      await Promise.all(promises);
      navigate("/");
    } catch (error) {
      setError("Failed to update account. Make sure your current password is correct.");
    } finally {
      setLoading(false);
    }
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
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      required
                      defaultValue={currentUser.email}
                      readOnly
                      style={{ backgroundColor: "#e9ecef" }}
                    />
                  </Form.Group>
                  <Form.Group controlId="current-password">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={currentPasswordRef}
                      required
                      placeholder="Enter current password"
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="Leave blank to keep the same"
                    />
                  </Form.Group>
                  <Form.Group controlId="password-confirm">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      placeholder="Leave blank to keep the same"
                    />
                  </Form.Group>
                  <Button disabled={loading} className="w-100 mt-3" type="submit" variant="primary">
                    Update
                  </Button>
                </Form>
                <div className="w-100 text-center mt-2">
                  <Button
                    variant="secondary"
                    className="w-100"
                    as={Link}
                    to="/"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
