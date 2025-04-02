import { Typography, Box } from "@mui/material";
import {
  CheckCircle,
  Insights,
  Security,
  TrendingUp,
  SupportAgent,
} from "@mui/icons-material";

export default function Description() {
  const features = [
    {
      icon: <Insights fontSize="large" />,
      title: "Аналитика",
      description: "Получайте детальный анализ ваших финансов.",
    },
    {
      icon: <TrendingUp fontSize="large" />,
      title: "Рост доходов",
      description: "Оптимизируйте расходы и увеличивайте доход.",
    },
    {
      icon: <Security fontSize="large" />,
      title: "Безопасность",
      description: "Ваши данные под надежной защитой. Но это не точно :)",
    },
    {
      icon: <SupportAgent fontSize="large" />,
      title: "Поддержка 24/7",
      description: "Круглосуточная помощь и консультации.",
    },
    {
      icon: <CheckCircle fontSize="large" />,
      title: "Простота",
      description: "Удобный и понятный интерфейс.",
    },
  ];

  return (
    <Box className="flex flex-col justify-center gap-2">
      {features.map((feature, index) => (
        <Box key={index} className="flex items-center mb-4">
          <Box className="mr-4">{feature.icon}</Box>
          <Box>
            <Typography className="text-lg font-bold ">
              {feature.title}
            </Typography>
            <Typography>{feature.description}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
