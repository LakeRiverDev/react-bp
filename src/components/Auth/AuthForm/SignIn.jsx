import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { postData, getErrorMessage } from "@/utils/fetches";
import { patterns } from "@utils/patterns";
import { AuthContext } from "@contexts/authContext";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [validationError, setValidationError] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [validationSuccess, setValidationSuccess] = useState(false);
  const { login } = useContext(AuthContext);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAgree(false);
    setValidationError({ name: false, email: false, password: false });
    setValidationSuccess({ name: false, email: false, password: false });
  };

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

  const mutation = useMutation({
    mutationFn: () => postData("/login", { email, password, agree }),
    onSuccess: (data) => {
      const {
        access_token,
        _users: { name, email },
      } = data;
      resetForm();
      login(access_token, name, email);
    },
    onError: (error) => {
      console.log(getErrorMessage(error));
    },
  });

  const handleSubmitAuth = (event) => {
    event.preventDefault();
    const userData = { email, password, agree };
    mutation.mutate(userData);
  };

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
        label="E-mail"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateField("email", e.target.value);
        }}
        error={validationError.email}
        helperText={validationError.email && "Некорректный e-mail"}
        color={validationSuccess.email ? "success" : "primary"}
        required
        autoFocus
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
      />

      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            value={agree}
          />
        }
        label={
          <Typography variant="body2">Запомнить меня на 7 дней</Typography>
        }
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitAuth}
        fullWidth
      >
        Войти
      </Button>
    </Box>
  );
}
