import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <RouterProvider router={router} />
        <Toaster richColors />
  </StrictMode>
);
