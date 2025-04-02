import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utils/fetches";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Money, //наличные
  CreditCard, //карта
  AccountBalance, //кредит
  QueryBuilder, //рассрочка
  DeleteOutlined,
  TrendingDown,
  TrendingUp,
  CalendarMonth,
  SsidChart,
  Category,
  Abc,
  ShoppingBag,
  Source,
} from "@mui/icons-material";
import { useScreen } from "@contexts/screenContext";
import { useDialog } from "@contexts/dialogContext";

const sourceIcons = {
  Наличные: <Money />,
  Карта: <CreditCard />,
  Кредит: <AccountBalance />,
  Рассрочка: <QueryBuilder />,
};

const headerIcons = {
  "Дата и время": <CalendarMonth />,
  Тип: <SsidChart />,
  Категория: <Category />,
  Причина: <Abc />,
  Сумма: <ShoppingBag />,
  Источник: <Source />,
};

export default function MainTable({ endpoint = "/transactions" }) {
  const { isMobile, isTablet, isSm } = useScreen();
  const { toggleDialog } = useDialog();
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
  });

  const rowsWithIndex = transactions.map((row, index) => {
    //Номер строки в таблице != "id"
    return { ...row, index: index + 1 };
  });

  const renderHeaderWithIcon = (headerName) => (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {headerIcons[headerName]}
        {isMobile || isSm ? "" : headerName}
      </Box>
    </div>
  );

  const columns = [
    {
      field: "index",
      headerName: "",
      flex: 0.4,
      sortable: false,
      filterable: false,
      align: "center",
      renderCell: (params) => {
        return <div>{params.row.index}</div>;
      },
    },
    {
      field: "created_at",
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Дата и время"),
      renderCell: (params) => {
        // Конвертация из timestamp
        const timestamp = params.value;
        const date = new Date(timestamp).toLocaleDateString();
        return date;
      },
    },
    {
      field: "type",
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Тип"),
      renderCell: (params) => {
        const type = params.row?._type?.type;
        return (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {type === "Доход" ? (
              <TrendingUp sx={{ color: "green" }} />
            ) : (
              <TrendingDown sx={{ color: "red" }} />
            )}
            {isMobile || isTablet ? "" : type}
          </Box>
        );
      },
    },
    {
      field: "category",
      editable: false,
      flex: 2,
      headerAlign: "center",
      align: "left",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Категория"),
      renderCell: (params) => (
        <Box>{params.row?._categories?.label || "—"}</Box>
      ),
    },
    {
      field: "reason",
      editable: true,
      flex: 2,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Причина"),
    },
    {
      field: "summary",
      type: "number",
      editable: true,
      flex: 1,
      headerAlign: "center",
      align: "left",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Сумма"),
    },
    {
      field: "value",
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
      renderHeader: () => renderHeaderWithIcon("Источник"),
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {sourceIcons[params.row?._source?.value]}
            {isMobile || isTablet ? "" : params.row?._source?.value}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.1,
      align: "center",
      sortable: false,
      filterable: false,
      renderCell: () => {
        return;
      },
    },
  ];

  return (
    <Box
      sx={{ width: "100%", height: "100%", overflow: "auto", padding: "4px" }}
    >
      <DataGrid
        disableRowSelectionOnClick
        autoPageSize
        disableColumnMenu
        rows={rowsWithIndex}
        onRowClick={(params) => toggleDialog(true, params.row)}
        columns={columns}
        columnVisibilityModel={{
          index: false,
          reason: !(isMobile || isSm),
          actions: !(isMobile || isSm),
          created_at: !(isMobile || isSm),
        }}
        loading={isLoading}
        initialState={{
          density: "compact", // узкие строки
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
