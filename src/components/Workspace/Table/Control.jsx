import { useState, useEffect } from "react";

import { useScreen } from "@contexts/screenContext";
import { useDrawer } from "@contexts/drawerContext";
import { useDialog } from "@contexts/dialogContext";

import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  ButtonGroup,
  Autocomplete,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";

import {
  Money, //наличные
  CreditCard, //карта
  AccountBalance, //кредит
  QueryBuilder, //рассрочка
  Close,
} from "@mui/icons-material";

const sourceIcons = {
  Наличные: <Money />,
  Карта: <CreditCard />,
  Кредит: <AccountBalance />,
  Рассрочка: <QueryBuilder />,
};

export default function Control({
  setAlertMessage,
  controlQuery,
  initialData,
  editRow,
  addRow,
  delRow,
}) {
  const { openDialog, toggleDialog } = useDialog();
  const { isXs, isSm, isMd } = useScreen();
  const { toggleDrawer } = useDrawer();

  const [source, setSource] = useState(initialData?._source?.value || false);
  const [type, setType] = useState(initialData?._type?.type || null);
  const [category, setCategory] = useState(initialData?._categories || null);
  const [reason, setReason] = useState(initialData?.reason || "");
  const [summary, setSummary] = useState(initialData?.summary || "");

  useEffect(() => {
    // Подстановка при редактировании исходных данных
    if (initialData) {
      setSource(initialData?._source?.value || false);
      setType(initialData?._type?.type || null);
      setCategory(initialData?._categories || null);
      setReason(initialData?.reason || "");
      setSummary(initialData?.summary || "");
    }
  }, [initialData]);

  const resetForm = () => {
    setSource(false);
    setType(null);
    setCategory(null);
    setReason("");
    setSummary("");
  };

  const removeAny = () => {
    resetForm();
    toggleDialog(false);
    toggleDrawer(false);
  };

  const handleSuccess = () => {
    setAlertMessage("Запись успешно добавлена!");
    setTimeout(() => setAlertMessage(null), 3000);
    removeAny();
  };

  const handleSourceChange = (event, newSource) => {
    if (newSource !== null) {
      setSource(newSource);
    }
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setType(newType);
      setCategory(null);
    }
  };

  const handleCategoryChange = (_, newCategory) => {
    setCategory(newCategory);
  };

  const selectedTypeId =
    controlQuery.data?.types.find((t) => t.type === type)?.id || null; // Получаем массив types, в нём ищем тип, который соответствует выбранному значению type в input'е - для фильтрации категорий!

  const filteredCategories =
    controlQuery.data?.categories.filter(
      (category) => category.type === selectedTypeId
    ) ?? []; // Получаем массив categories, фильтруем категории взависимости от выбранного типа

  const selectedSourceId =
    controlQuery.data?.sources.find((s) => s.value === source)?.id || null; // Получаем массив sources, в нём ищем источник, который соответствует выбранному значению source в input'е - для подстановки в data.sourse_id

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      types_id: selectedTypeId,
      categories_id: category,
      source_id: selectedSourceId,
      reason,
      summary,
    };
    if (initialData) {
      editRow(
        { id: initialData.id, updatedData: data },
        {
          onSuccess: handleSuccess,
        }
      );
    } else {
      addRow(data, {
        onSuccess: handleSuccess,
      });
    }
  };

  const isButtonDisabled = !summary || !category || !source || !reason;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "4px",
        width: {
          md: "50%",
          lg: "40%",
          xl: "40%",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.25 rem",
            textAlign: "center",
            fontWeight: "bold",
            display: openDialog && !initialData ? "none" : "block",
          }}
        >
          {initialData ? "Редактировать запись" : "Добавить запись"}
        </Typography>
        {initialData && (
          <IconButton onClick={removeAny} size="small">
            <Close />
          </IconButton>
        )}
      </Stack>

      <ToggleButtonGroup
        fullWidth
        color="primary"
        value={type}
        exclusive
        onChange={handleTypeChange}
        aria-label="Тип"
        size={isMd ? "small" : ""}
      >
        {controlQuery.data?.types.map(({ id, type }) => (
          <ToggleButton
            key={id}
            value={type}
            aria-label={type}
            disabled={controlQuery.isError || controlQuery.isLoading}
          >
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={filteredCategories}
        getOptionLabel={(option) => option.label || ""}
        renderInput={(params) => <TextField {...params} label="Категория" />}
        onChange={handleCategoryChange}
        value={category}
        disabled={!type || controlQuery.isError || controlQuery.isLoading}
        size={isMd ? "small" : ""}
      />

      <TextField
        id="outlined-basic"
        label="Причина"
        variant="outlined"
        fullWidth
        type="string"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        disabled={!category}
        size={isMd ? "small" : ""}
      />

      <TextField
        id="outlined-basic"
        label="Сумма"
        variant="outlined"
        fullWidth
        required
        type="number"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        disabled={!reason}
        size={isMd ? "small" : ""}
      />

      <ToggleButtonGroup
        fullWidth
        color="primary"
        value={source}
        exclusive
        onChange={handleSourceChange}
        aria-label="Источник"
        disabled={!summary}
        size={isMd ? "small" : ""}
        orientation={isXs || isSm ? "vertical" : "horizontal"}
      >
        {controlQuery.data?.sources.map((source) => (
          <ToggleButton
            key={source.value}
            value={source.value}
            aria-label={source.ariaLabel}
            disabled={type === "Доход" && source.value === "Рассрочка"}
            sx={{
              gap: 1,
              alignItems: "center",
            }}
          >
            {sourceIcons[source.value]}
            {source.value}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ButtonGroup>
        {initialData && (
          <Button
            color="error"
            variant="outlined"
            size="medium"
            fullWidth
            onClick={() => delRow(initialData?.id)}
          >
            Удалить
          </Button>
        )}

        <Button
          variant="outlined"
          disabled={isButtonDisabled}
          loading={
            addRow.isLoading || editRow.isLoading || controlQuery.isLoading
          }
          onClick={handleSubmit}
          size="medium"
          fullWidth
        >
          {initialData ? "Обновить" : "Добавить"}
        </Button>
      </ButtonGroup>
    </Box>
  );
}
