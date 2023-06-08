import React, { useContext } from "react";
import { Button, Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Notification from "./chat/Notification.jsx";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">Chat App</Link>
        </h2>
        {user && <span className="text-warning">{user?.name}({user?.email})</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user && user ?
                <>
                  <Notification />
                  <Button onClick={() => logoutUser()} className="link-light text-decoration-none">
                    Logout
                  </Button>
                </>
               :
              (
                <>
                  <Link to="/login" className="link-light text-decoration-none">
                    Login
                  </Link>
                  <Link to="/register" className="link-light text-decoration-none">
                    Register
                  </Link>
                </>
              )
            }
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default NavBar;