import { Letter, Author, Destination } from "@prisma/client";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridSelectionModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { fetcher } from "../../lib/fetcher";
import Axios from "axios";
import Toast from "../common/Toast";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const DEFAULT_LETTERS_TAKE = 20;

type Letters = (Letter & { author: Author; destination: Destination })[];

const cols: GridColDef[] = [
  {
    field: "destinationName",
    headerName: "Destination",
    flex: 2,
    sortable: false,
    filterable: false,
  },
  { field: "classId", headerName: "Class", flex: 1, sortable: false, filterable: false },
  {
    field: "registerNumber",
    headerName: "Register number",
    flex: 1,
    sortable: false,
    filterable: false,
  },
];

export const LettersTable = () => {
  const [pageSize, setPageSize] = useState(DEFAULT_LETTERS_TAKE);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, error } = useQuery<{
    letters: Letters;
    pagination: { allLettersCount: number };
  }>(
    [`/api/letters`, { take: pageSize, skip: page * pageSize }],
    // TODO: Add typings
    fetcher<any>(`/api/letters?take=${pageSize}&skip=${page * pageSize}`),
  );

  const [message, setMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [selectedLetters, setSelectedLetters] = useState<GridSelectionModel>([]);

  const handleDelete = () => {
    if (selectedLetters.length) {
      Axios.delete("/api/letters", { data: { ids: selectedLetters } })
        .then((res) => {
          setMessage(res.data.message);

          queryClient.invalidateQueries("/api/letters");
        })
        .catch((err) => {
          setDeleteError(err.response?.data?.message || "Something went wrong");
        });
    }
  };

  const rows: GridRowsProp =
    data?.letters.map((letter) => ({
      id: letter.id,
      destinationName: letter.destination.name,
      classId: letter.author.classId,
      registerNumber: letter.author.registerNumber,
    })) || [];

  return (
    <>
      <Box mt={3} height="80vh">
        <DataGrid
          columns={cols}
          rows={rows}
          sortingMode="server"
          paginationMode="server"
          filterMode="server"
          pagination
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => {
            setPageSize(pageSize);
            queryClient.invalidateQueries("/api/letters");
          }}
          rowsPerPageOptions={[DEFAULT_LETTERS_TAKE, 50, 100]}
          rowCount={data?.pagination?.allLettersCount || 0}
          onPageChange={(page) => {
            setPage(page);
            queryClient.invalidateQueries("/api/letters");
          }}
          page={page}
          loading={!error && !data}
          error={error}
          checkboxSelection
          onSelectionModelChange={setSelectedLetters}
          components={{
            Toolbar: () => (
              <GridToolbarContainer>
                <Button
                  onClick={handleDelete}
                  color="warning"
                  startIcon={<DeleteIcon />}
                  disabled={!selectedLetters.length}
                >
                  Delete selected
                </Button>
              </GridToolbarContainer>
            ),
          }}
        />
      </Box>
      <Toast value={message} severity="success" />
      <Toast value={deleteError} severity="error" />
    </>
  );
};
