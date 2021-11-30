import { Letter, Author, Destination } from "@prisma/client";
import { Box } from "@mui/system";
import useSWR from "swr";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { useState } from "react";

export const DEFAULT_LETTERS_TAKE = 20;

type Letters = (Letter & { author: Author; destination: Destination })[];

const cols: GridColDef[] = [
  { field: "destinationName", headerName: "Adresat", flex: 2, sortable: false, filterable: false },
  { field: "classId", headerName: "Klasa", flex: 1, sortable: false, filterable: false },
  {
    field: "registerNumber",
    headerName: "Numer w dzienniku",
    flex: 1,
    sortable: false,
    filterable: false,
  },
];

export const LettersTable = () => {
  const [pageSize, setPageSize] = useState(DEFAULT_LETTERS_TAKE);
  const [page, setPage] = useState(0);

  const { data, error } = useSWR<{ letters: Letters; pagination: { allLettersCount: number } }>(
    `/api/letters?take=${pageSize}&skip=${page * pageSize}`,
  );

  const rows: GridRowsProp =
    data?.letters.map((letter) => ({
      id: letter.id,
      destinationName: letter.destination.name,
      classId: letter.author.classId,
      registerNumber: letter.author.registerNumber,
    })) || [];

  return (
    <Box mt={3} height="80vh">
      <DataGrid
        disableSelectionOnClick
        columns={cols}
        rows={rows}
        sortingMode="server"
        paginationMode="server"
        filterMode="server"
        pagination
        pageSize={pageSize}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        rowsPerPageOptions={[DEFAULT_LETTERS_TAKE, 50, 100]}
        rowCount={data?.pagination?.allLettersCount || 0}
        onPageChange={(page) => setPage(page)}
        page={page}
        loading={!error && !data}
        error={error}
      />
    </Box>
  );
};
