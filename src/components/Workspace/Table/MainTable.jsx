import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, deleteData } from "@utils/fetches";
import { useContext } from "react";
import ThemeContext from "@context/themeContext";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Money, //наличные
  CreditCard, //карта
  AccountBalance, //кредит
  QueryBuilder, //рассрочка
  DeleteOutlined,
} from "@mui/icons-material";

const sourceIcons = {
  Наличные: <Money />,
  Карта: <CreditCard />,
  Кредит: <AccountBalance />,
  Рассрочка: <QueryBuilder />,
};

// Отрисовка столбцов таблицы:
const columns = [
  {
    field: "index",
    headerName: "",
    flex: 0.4,
    renderCell: (params) => {
      return <div>{params.row.index}</div>;
    },
  },
  { field: "date", headerName: "Дата и время", editable: false, flex: 1 },
  {
    field: "type",
    headerName: "Тип",
    editable: false,
    flex: 1,
  },
  { field: "category", headerName: "Категория", editable: false, flex: 2 },
  {
    field: "reason",
    headerName: "Причина",
    editable: true,
    flex: 2,
  },
  {
    field: "summary",
    headerName: "Сумма",
    type: "number",
    editable: true,
    flex: 1,
  },
  {
    field: "source",
    headerName: "Источник",
    editable: false,
    flex: 1,
    renderCell: (params) => {
      return (
        <Box className="flex items-center gap-2">
          {sourceIcons[params.value]}
          {params.value}
        </Box>
      );
    },
  },
  {
    field: "actions",
    headerName: "",
    flex: 0.1,
    renderCell: (params) => {
      return <DelRowButton id={params.row.id} />;
    },
  },
];

const DelRowButton = ({ id }) => {
  //Функция добавляющая кнопку удаления строки по ID
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteData("/dataBase", id),
    onSuccess: () => {
      queryClient.invalidateQueries(["/dataBase"]);
    },
    onError: () => {
      console.log(`Ошибка удаления строки ${id}`);
    },
  });
  return (
    <Box className="flex items-center gap-4 my-1">
      <DeleteOutlined
        className="text-slate-300 hover:text-red-600 hover:cursor-pointer"
        onClick={() => {
          mutation.mutate();
        }}
      />
    </Box>
  );
};

export default function MainTable({ endpoint = "/dataBase" }) {
  const { mode } = useContext(ThemeContext);
  const { data: tableData = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
  });

  const rowsWithIndex = tableData.map((row, index) => {
    //Номер строки в таблице != "id"
    return { ...row, index: index + 1 };
  });

  return (
    <Box className="flex flex-col 2xl:w-1/2 w-full h-full overflow-auto">
      <DataGrid
        disableRowSelectionOnClick
        autoPageSize
        rows={rowsWithIndex}
        columns={columns}
        loading={isLoading}
        getCellClassName={(params) => {
          if (params.field === "type") {
            if (params.value === "Доход") {
              return mode === "dark" ? "bg-green-700" : "bg-green-200";
            } else {
              return mode === "dark" ? "bg-red-700" : "bg-red-200";
            }
          }
          return ""; // Для других столбцов возвращаем пустую строку
        }}
        initialState={{
          density: "compact", // узкие строки
          sorting: {
            // сортировка по умолчанию от большего индекса к меньшему
            sortModel: [
              {
                field: "index",
                sort: "desc",
              },
            ],
          },
        }}
        sx={{
          minHeight: 0, // Таблица не разрывается
          flexGrow: 1, // Таблица растет в пределах контейнера
          "& .MuiDataGrid-cell:focus": {
            // Убирает обводку вокруг ячейки при клике
            outline: "none",
          },
        }}
      />
    </Box>
  );
}
