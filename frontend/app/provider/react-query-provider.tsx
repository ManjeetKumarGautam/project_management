
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";
import { NotificationProvider } from "./notify-context";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // const userId = localStorage.getItem("userId") || "";
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider >
          {children}
        </NotificationProvider>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
