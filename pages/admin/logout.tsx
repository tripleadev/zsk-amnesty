import { GetServerSidePropsContext } from "next";
import { getDeleteSessionCookie } from "../../lib/auth/auth";
import { prisma } from "../../lib/db";

const LogoutPage = () => null;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const { req, res } = ctx;
    res.setHeader("Set-Cookie", getDeleteSessionCookie());
    await prisma.session.delete({ where: { id: req.cookies.authorization } });
  } catch {}

  return {
    redirect: {
      destination: "/admin/login",
      permanent: false,
    },
  };
};

export default LogoutPage;
