import "./index.css";
import App from "@/App.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProviderWrapper } from "@contexts/ThemeProviderContext.jsx";
import { AuthProvider } from "@contexts/AuthContextProvider.jsx";
import { ScreenProvider } from "@contexts/ScreenProviderContext.jsx";
import { DrawerProvider } from "@contexts/DrawerContextProvider";
import { DialogProvider } from "@contexts/DialogContextProvider";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1, retryDelay: 5000 },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router basename="/react-bp">
        <AuthProvider>
          <ThemeProviderWrapper>
            <ScreenProvider>
              <DialogProvider>
                <DrawerProvider>
                  <App />
                </DrawerProvider>
              </DialogProvider>
            </ScreenProvider>
          </ThemeProviderWrapper>
        </AuthProvider>
      </Router>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>
);
