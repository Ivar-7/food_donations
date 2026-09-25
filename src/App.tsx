import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./app/AppRouter";
import { AuthProvider } from "./app/AuthProvider";
import { ThemeProvider } from "./app/ThemeProvider";
import ErrorBoundary from "./shared/errors/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
