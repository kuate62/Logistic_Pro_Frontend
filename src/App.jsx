import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import index from "./route/index.jsx";
import useAuthStore from "./store/useAuthStore";

function App() {
  const router = createBrowserRouter(index);

  useEffect(() => {
    useAuthStore.getState().initApp();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
