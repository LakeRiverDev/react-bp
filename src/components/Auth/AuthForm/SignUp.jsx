import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { postData, getErrorMessage } from "@utils/fetches";
import { patterns } from "@utils/patterns";

export default function SignUp({ setSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [agree, setAgree] = useState(false);
  const [validationError, setValidationError] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [validationSuccess, setValidationSuccess] = useState(false);

  const validateField = (field, value) => {
    const isValid = value.length > 0 && !patterns[field].test(value);
    setValidationError((prev) => ({
      ...prev,
      [field]: isValid,
    }));
    setValidationSuccess((prev) => ({
      ...prev,
      [field]: !isValid,
    }));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAgree(false);
    setValidationError({ name: false, email: false, password: false });
    setValidationSuccess({ name: false, email: false, password: false });
  };

  const mutation = useMutation({
    // mutationFn: () => postData("/register", { name, email, password }),
    mutationFn: () => postData("/register", { name, email, password }),
    onSuccess: () => {
      setAlertMessage({ type: "success", message: "Регистрация успешна!" });
      setTimeout(() => setSignIn(true), 3000);
    },
    onError: (error) => {
      const serverError = error.response?.data?.message || "Ошибка сервера"; // Получение текста ошибки из ответа сервера
      console.log(error.response?.data?.message);
      setAlertMessage({ type: "error", message: getErrorMessage(serverError) });
    },
  });

  const handleSubmitRegistration = (event) => {
    event.preventDefault();
    const userData = { name, email, password };
    mutation.mutate(userData, {
      onSuccess: resetForm,
      onError: resetForm,
    });
  };

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => setAlertMessage(null), 3000);
    }
  }, [alertMessage]);

  const isButtonDisabled =
    !name ||
    !email ||
    !password ||
    !agree ||
    !validationSuccess.name ||
    !validationSuccess.email ||
    !validationSuccess.password;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "8px",
        gap: "8px",
      }}
    >
      <TextField
        label="Имя"
        type="text"
        variant="outlined"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          validateField("name", e.target.value);
        }}
        error={validationError.name}
        helperText={validationError.name && "Некорректное имя: только буквы"}
        color={validationSuccess.name ? "success" : "primary"}
        autoFocus
        required
        fullWidth
      />
      <TextField
        label="E-mail"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateField("email", e.target.value);
        }}
        error={validationError.email}
        helperText={validationError.email && "Некорректный email"}
        color={validationSuccess.email ? "success" : "primary"}
        required
        fullWidth
      />
      <TextField
        label="Пароль"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validateField("password", e.target.value);
        }}
        error={validationError.password}
        helperText={
          validationError.password && "Некорректный пароль: минимум 8 символов"
        }
        color={validationSuccess.password ? "success" : "primary"}
        required
        fullWidth
      />

      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
        }
        label={
          <Typography variant="body2">
            Я соглашаюсь на обработку и хранение моих персональных данных.
          </Typography>
        }
      />

      <Button
        variant="contained"
        color="primary"
        disabled={isButtonDisabled}
        fullWidth
        onClick={handleSubmitRegistration}
      >
        {mutation.isLoading ? "Загрузка..." : "Зарегистрироваться"}
      </Button>
      {alertMessage && (
        <Alert
          severity={alertMessage.type}
          className="absolute top-20 left-1/2 transform -translate-x-1/2"
          variant="outlined"
        >
          {alertMessage.message}
        </Alert>
      )}
    </Box>
  );
}
