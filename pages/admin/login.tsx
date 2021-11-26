import { Container, Box } from "@mui/material";
import { LoginForm } from "../../components/admin/LoginForm";

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box height="100vh" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default Login;
