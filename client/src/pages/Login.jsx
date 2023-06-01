import React, { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { loginUser,
    loginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading } = useContext(AuthContext)

  return (
    <>
      <Form onSubmit={loginUser}>
        <Row style={{ height: "100vh", justifyContent: "center", paddingTop: "10%" }}>
          <Col md={6} sm={10}>
            <Stack gap={3}>
              <h2>Login</h2>

              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e)=> updateLoginInfo({...loginInfo, email: e.target.value})}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e)=> updateLoginInfo({...loginInfo, password: e.target.value})}
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Login Success!" : "Login"}
              </Button>

              {
                loginError?.error && (
                  <Alert variant="danger">
                    <p>{loginError?.message}</p>
                  </Alert>
                )
              }
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default Login;