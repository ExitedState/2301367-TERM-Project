import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

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
      <Card>
        <Container
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-100" style={{ maxWidth: "400px" }}>
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    required
                    defaultValue={currentUser.email}
                    readOnly
                    style={{ backgroundColor: '#e9ecef' }}
                  />
                </Form.Group>
                <Form.Group id="current-password">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={currentPasswordRef}
                    required
                    placeholder="Enter current password"
                  />
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                  />
                </Form.Group>
                <Form.Group id="password-confirm">
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
            </Card.Body>
          </div>
        </Container>

      </Card>

    </>
  );
}
