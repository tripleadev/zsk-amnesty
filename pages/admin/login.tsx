import { Container, Box } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import { LoginForm } from "../../components/admin/LoginForm";
import { verifySession } from "../../lib/auth/auth";

const Login = () => {
  return (
    <Container maxWidth="sm">
      <Box height="100vh" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <LoginForm />
      </Box>
    </Container>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const sessionId = ctx.req.cookies.authorization;
    const session = await verifySession(sessionId);

    if (session) {
      return {
        redirect: {
          destination: "/admin/dashboard",
          permanent: false,
        },
      };
    }
  } catch {
    return {
      props: {},
    };
  }
};

export default Login;
