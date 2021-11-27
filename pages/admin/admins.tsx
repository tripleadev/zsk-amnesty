import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PrismaClient } from ".prisma/client";
import Link from 'next/link';
import { Box, Button } from "@mui/material";

const columnsObject: GridColDef[] = [
  { field: 'email', headerName: 'Email Adress', width: 150 },
];

const AdminsManagement = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Box m={5}>
      <Link href="/admin/dashboard">
        <Button>Dashboard</Button>
      </Link>
      <div style={{ height: '50vh', width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columnsObject}
          autoPageSize
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </Box>
  );
};


export const getServerSideProps: GetServerSideProps = async () => {
  const prisma = new PrismaClient();

  try {
    const allAdmins = await prisma.admin.findMany();

    return {
      props: {
        data: allAdmins
      },
    };
  } catch (err) {
    alert(err);

    return {
      props: {},
    }
  }
}

export default AdminsManagement;